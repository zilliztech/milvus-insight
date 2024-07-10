import { useCallback, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Slider } from '@material-ui/core';
import CustomInput from '@/components/customInput/CustomInput';
import CustomSelector from '@/components/customSelector/CustomSelector';
import CustomMultiSelector from '@/components/customSelector/CustomMultiSelector';

import {
  CONSISTENCY_LEVEL_OPTIONS,
  TOP_K_OPTIONS,
  RERANKER_OPTIONS,
  DataTypeStringEnum,
} from '@/consts';
import { SearchParams, GlobalParams } from '../../types';
import { FieldObject } from '@server/types';

export interface SearchGlobalProps {
  searchGlobalParams: GlobalParams;
  searchParams: SearchParams;
  handleFormChange: (form: GlobalParams) => void;
  onSlideChange: (field: string) => void;
  onSlideChangeCommitted: () => void;
  fields: FieldObject[];
  outputFields: FieldObject[];
}

const UNSPORTED_GROUPBY_TYPES = [
  DataTypeStringEnum.Double,
  DataTypeStringEnum.Float,
  DataTypeStringEnum.JSON,
];

const SearchGlobalParams = (props: SearchGlobalProps) => {
  // props
  const {
    searchParams,
    searchGlobalParams,
    handleFormChange,
    onSlideChange,
    onSlideChangeCommitted,
    fields,
    outputFields,
  } = props;
  const selectedCount = searchParams.searchParams.filter(
    sp => sp.selected
  ).length;
  const showReranker = selectedCount > 1;

  // translations
  const { t: warningTrans } = useTranslation('warning');
  const { t: commonTrans } = useTranslation();
  const { t: searchTrans } = useTranslation('search');
  const gridTrans = commonTrans('grid');

  // UI functions
  const handleInputChange = useCallback(
    <K extends keyof GlobalParams>(key: K, value: GlobalParams[K]) => {
      let form = { ...searchGlobalParams };
      if (value === '') {
        delete form[key];
      } else {
        form = { ...searchGlobalParams, [key]: value };
      }

      handleFormChange(form);
    },
    [handleFormChange, searchGlobalParams]
  );

  const groupByOptions = fields
    .filter(f => !UNSPORTED_GROUPBY_TYPES.includes(f.data_type as any))
    .map(f => {
      return {
        value: f.name,
        label: f.name,
      };
    });

  return (
    <>
      <CustomSelector
        options={TOP_K_OPTIONS}
        value={searchGlobalParams.topK}
        label={searchTrans('topK')}
        wrapperClass="selector"
        variant="filled"
        onChange={(e: { target: { value: unknown } }) => {
          const topK = e.target.value as number;
          handleInputChange('topK', topK);
        }}
      />
      <CustomSelector
        options={CONSISTENCY_LEVEL_OPTIONS}
        value={searchGlobalParams.consistency_level}
        label={searchTrans('consistency')}
        wrapperClass="selector"
        variant="filled"
        onChange={(e: { target: { value: unknown } }) => {
          const consistency = e.target.value as string;
          handleInputChange('consistency_level', consistency);
        }}
      />

      <CustomMultiSelector
        options={outputFields.map(f => {
          return { label: f.name, value: f.name };
        })}
        values={searchGlobalParams.output_fields}
        renderValue={selected => (
          <span>{`${(selected as string[]).length} ${
            gridTrans[(selected as string[]).length > 1 ? 'fields' : 'field']
          }`}</span>
        )}
        label={searchTrans('outputFields')}
        wrapperClass="selector"
        variant="filled"
        onChange={(e: { target: { value: unknown } }) => {
          console.log('on change', e.target.value);
          // add value to output fields if not exist, remove if exist
          const outputFields = [...searchGlobalParams.output_fields];
          const values = e.target.value as string[];
          const newFields = values.filter(
            v => !outputFields.includes(v as string)
          );
          const removeFields = outputFields.filter(
            v => !values.includes(v as string)
          );
          outputFields.push(...newFields);
          removeFields.forEach(f => {
            const index = outputFields.indexOf(f);
            outputFields.splice(index, 1);
          });

          console.log('xxx', outputFields);
          handleInputChange('output_fields', outputFields);
        }}
      />

      {!showReranker && (
        <CustomSelector
          options={[{ label: '--', value: '' }, ...groupByOptions]}
          value={searchGlobalParams.group_by_field || ''}
          label={searchTrans('groupBy')}
          wrapperClass="selector"
          variant="filled"
          onChange={(e: { target: { value: unknown } }) => {
            const groupBy = e.target.value as string;
            handleInputChange('group_by_field', groupBy);
          }}
        />
      )}

      {showReranker && (
        <>
          <CustomSelector
            options={RERANKER_OPTIONS}
            value={
              searchGlobalParams.rerank
                ? searchGlobalParams.rerank
                : RERANKER_OPTIONS[0].value
            }
            label={searchTrans('rerank')}
            wrapperClass="selector"
            variant="filled"
            onChange={(e: { target: { value: unknown } }) => {
              const rerankerStr = e.target.value as 'rrf' | 'weighted';

              handleInputChange('rerank', rerankerStr);
            }}
          />

          {searchGlobalParams.rerank == 'rrf' && (
            <CustomInput
              type="text"
              textConfig={{
                type: 'number',
                label: 'K',
                key: 'k',
                onChange: value => {
                  handleInputChange('rrfParams', { k: Number(value) });
                },
                variant: 'filled',
                placeholder: 'k',
                fullWidth: true,
                validations: [
                  {
                    rule: 'require',
                    errorText: warningTrans('required', {
                      name: 'k',
                    }),
                  },
                ],
                defaultValue: 60,
                value: searchGlobalParams.rrfParams!.k,
              }}
              checkValid={() => true}
            />
          )}

          {searchGlobalParams.rerank == 'weighted' &&
            searchParams.searchParams.map((s, index) => {
              if (s.selected) {
                return (
                  <Slider
                    key={s.anns_field}
                    color="secondary"
                    defaultValue={0.5}
                    value={searchGlobalParams.weightedParams!.weights[index]}
                    getAriaValueText={value => {
                      return `${s.anns_field}'s weight: ${value}`;
                    }}
                    onChange={(
                      e: ChangeEvent<{}>,
                      value: number | number[]
                    ) => {
                      // update the selected field
                      const weights = [
                        ...searchGlobalParams.weightedParams!.weights,
                      ];
                      weights[index] = Number(value);
                      handleInputChange('weightedParams', { weights: weights });
                      // fire on change event
                      onSlideChange(s.anns_field);
                    }}
                    onChangeCommitted={() => {
                      onSlideChangeCommitted();
                    }}
                    aria-labelledby="weight-slider"
                    valueLabelDisplay="auto"
                    step={0.1}
                    min={0}
                    max={1}
                  />
                );
              }
            })}
        </>
      )}
    </>
  );
};

export default SearchGlobalParams;
