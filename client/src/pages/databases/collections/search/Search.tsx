import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useContext,
  ChangeEvent,
  useCallback,
} from 'react';
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { rootContext, dataContext } from '@/context';
import { DataService } from '@/http';
import icons from '@/components/icons/Icons';
import AttuGrid from '@/components/grid/Grid';
import Filter from '@/components/advancedSearch';
import CustomToolBar from '@/components/grid/ToolBar';
import EmptyCard from '@/components/cards/EmptyCard';
import CustomButton from '@/components/customButton/CustomButton';
import { getLabelDisplayedRows } from '@/pages/search/Utils';
import { useSearchResult, usePaginationHook } from '@/hooks';
import { getQueryStyles } from './Styles';
import SearchGlobalParams from './SearchGlobalParams';
import VectorInputBox from './VectorInputBox';
import { CollectionObject, CollectionFullObject } from '@server/types';
import StatusIcon, { LoadingType } from '@/components/status/StatusIcon';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  formatFieldType,
  VectorStrToObject,
  cloneObj,
  generateVectorsByField,
} from '@/utils';
import SearchParams from '../../../search/SearchParams';
import {
  SearchParams as SearchParamsType,
  SearchSingleParams,
  SearchResultView,
} from '../../types';
import { DYNAMIC_FIELD } from '@/consts';
import { ColDefinitionsType } from '@/components/grid/Types';

export interface CollectionDataProps {
  collectionName: string;
  collections: CollectionObject[];
  searchParams: SearchParamsType;
  setSearchParams: (params: SearchParamsType) => void;
}

const Search = (props: CollectionDataProps) => {
  // props
  const { collections, collectionName, searchParams, setSearchParams } = props;
  const collection = collections.find(
    i => i.collection_name === collectionName
  ) as CollectionFullObject;

  const [tableLoading, setTableLoading] = useState<boolean>();

  // UI functions
  const { setDialog, handleCloseDialog, openSnackBar } =
    useContext(rootContext);

  // icons
  const ResetIcon = icons.refresh;
  const VectorSearchIcon = icons.vectorSearch;

  // translations
  const { t: dialogTrans } = useTranslation('dialog');
  const { t: successTrans } = useTranslation('success');
  const { t: warningTrans } = useTranslation('warning');
  const { t: searchTrans } = useTranslation('search');
  const { t: collectionTrans } = useTranslation('collection');
  const { t: btnTrans } = useTranslation('btn');
  const { t: commonTrans } = useTranslation();
  const gridTrans = commonTrans('grid');
  // classes
  const classes = getQueryStyles();

  // UI functions
  const handleExpand = useCallback(
    (panel: string) => (event: ChangeEvent<{}>, expanded: boolean) => {
      const s = cloneObj(searchParams);
      const target = s.searchParams.find((sp: SearchSingleParams) => {
        return sp.field.name === panel;
      });

      if (target) {
        target.expanded = expanded;
        setSearchParams({ ...s });
      }
    },
    [JSON.stringify(searchParams)]
  );

  const handleSelect = useCallback(
    (panel: string) => (event: ChangeEvent<{}>) => {
      const s = cloneObj(searchParams) as SearchParamsType;
      const target = s.searchParams.find(sp => {
        return sp.field.name === panel;
      });
      if (target) {
        target.selected = !target.selected;

        setSearchParams({ ...s });
      }
    },
    [JSON.stringify(searchParams)]
  );

  // update search params
  const updateSearchParamCallback = useCallback(
    (updates: SearchSingleParams, index: number) => {
      if (
        JSON.stringify(updates) !==
        JSON.stringify(searchParams.searchParams[index].params)
      ) {
        const s = cloneObj(searchParams);
        // update the searchParams
        s.searchParams[index].params = updates;
        setSearchParams({ ...s });
      }
    },
    [JSON.stringify(searchParams)]
  );

  // generate random vectors
  const executeGenerateVectors = useCallback(() => {
    const s = cloneObj(searchParams) as SearchParamsType;
    s.searchParams.forEach((sp: SearchSingleParams) => {
      sp.data = generateVectorsByField(sp.field) as any;
    });

    setSearchParams({ ...s });
  }, [JSON.stringify(searchParams)]);

  // on vector input change, update the search params
  const onVectorInputChange = useCallback(
    (anns_field: string, value: string) => {
      const s = cloneObj(searchParams) as SearchParamsType;
      const target = s.searchParams.find((sp: SearchSingleParams) => {
        return sp.anns_field === anns_field;
      });

      if (value !== target!.data) {
        target!.data = value;
        setSearchParams({ ...s });
      }
    },
    [JSON.stringify(searchParams)]
  );

  const setSearchResult = useCallback(
    (result: SearchResultView[]) => {
      const s = cloneObj(searchParams);
      s.searchResult = result;
      setSearchParams({ ...s });
    },
    [JSON.stringify(searchParams)]
  );

  // execute search
  const handleSearch = async () => {
    const clonedSearchParams = cloneObj(searchParams);
    delete clonedSearchParams.round_decimal;
    const data = searchParams.searchParams
      .filter(s => s.selected)
      .map(s => {
        const formatter =
          VectorStrToObject[
            s.field.data_type as keyof typeof VectorStrToObject
          ];
        return {
          anns_field: s.field.name,
          data: formatter(s.data),
          params: s.params,
        };
      });

    const params = {
      output_fields: outputFields,
      limit: searchParams.globalParams.topK,
      data: data,
      consistency_level: searchParams.globalParams.consistency_level,
    };

    console.log('search params', params);

    setTableLoading(true);
    try {
      const res = await DataService.vectorSearchData(
        searchParams.collection.collection_name,
        params
      );
      setTableLoading(false);
      setSearchResult(res.results);
      // setLatency(res.latency);
    } catch (err) {
      setTableLoading(false);
    }
  };

  const searchResultMemo = useSearchResult(
    (searchParams && (searchParams.searchResult as SearchResultView[])) || []
  );

  let primaryKeyField = 'id';

  const outputFields: string[] = useMemo(() => {
    if (!searchParams || !searchParams.collection) {
      return [];
    }

    const s = searchParams.collection;

    const fields = (s.schema && s.schema.fields) || [];

    // vector field can't be output fields
    const invalidTypes = [
      'BinaryVector',
      'FloatVector',
      'Float16Vector',
      'BFloat16Vector',
      'SparseFloatVector',
    ];
    const nonVectorFields = fields.filter(
      field => !invalidTypes.includes(field.data_type)
    );

    const _outputFields = nonVectorFields.map(f => f.name);
    if (s.schema?.enable_dynamic_field) {
      _outputFields.push(DYNAMIC_FIELD);
    }
    return _outputFields;
  }, [searchParams]);

  const {
    pageSize,
    handlePageSize,
    currentPage,
    handleCurrentPage,
    total,
    data: result,
    order,
    orderBy,
    handleGridSort,
  } = usePaginationHook(searchResultMemo || []);

  const colDefinitions: ColDefinitionsType[] = useMemo(() => {
    const orderArray = [primaryKeyField, 'id', 'score', ...outputFields];

    return searchParams &&
      searchParams.searchResult &&
      searchParams.searchResult.length > 0
      ? Object.keys(searchParams.searchResult[0])
          .sort((a, b) => {
            const indexA = orderArray.indexOf(a);
            const indexB = orderArray.indexOf(b);
            return indexA - indexB;
          })
          .filter(item => {
            // if primary key field name is id, don't filter it
            const invalidItems = primaryKeyField === 'id' ? [] : ['id'];
            return !invalidItems.includes(item);
          })
          .map(key => ({
            id: key,
            align: 'left',
            disablePadding: false,
            label: key === DYNAMIC_FIELD ? searchTrans('dynamicFields') : key,
            needCopy: key !== 'score',
          }))
      : [];
  }, [searchParams, primaryKeyField]);

  // methods
  const handlePageChange = (e: any, page: number) => {
    handleCurrentPage(page);
  };

  // collection is not found or collection full object is not ready
  if (
    !searchParams ||
    (searchParams && searchParams.searchParams.length === 0)
  ) {
    return <StatusIcon type={LoadingType.CREATING} />;
  }

  // disable search button
  const disableSearch = searchParams.searchParams.every(
    s => s.data === '' || !s.selected
  );

  // get search params

  return (
    <div className={classes.root}>
      {collection && (
        <div className={classes.inputArea}>
          <div className={classes.accordions}>
            {searchParams.searchParams.map((s, index: number) => {
              const field = s.field;
              // console.log('update', s.params, searchParams.globalParams);
              return (
                <Accordion
                  key={`${collection.collection_name}-${field.name}`}
                  expanded={s.expanded}
                  onChange={handleExpand(field.name)}
                  className={classes.accordion}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`${field.name}-content`}
                    id={`${field.name}-header`}
                  >
                    <div className={classes.checkbox}>
                      <Checkbox
                        size="small"
                        checked={s.selected}
                        onChange={handleSelect(field.name)}
                      />
                      <div className="label">
                        <Typography
                          className={`field-name ${
                            s.data.length > 0 ? 'bold' : ''
                          }`}
                        >
                          {field.name}
                        </Typography>
                        <Typography className="vector-type">
                          {formatFieldType(field)}
                          <i>{field.index.metricType}</i>
                        </Typography>
                      </div>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails className={classes.accordionDetail}>
                    <VectorInputBox
                      searchParams={s}
                      onChange={onVectorInputChange}
                    />
                    <Typography className="text">
                      {searchTrans('thirdTip')}
                    </Typography>

                    <SearchParams
                      wrapperClass="paramsWrapper"
                      consistency_level={'Strong'}
                      handleConsistencyChange={(level: string) => {}}
                      indexType={field.index.indexType}
                      indexParams={field.index_params}
                      searchParamsForm={s.params}
                      handleFormChange={(
                        updates: { [key in string]: number | string }
                      ) => {
                        updateSearchParamCallback(updates as any, index);
                      }}
                      topK={searchParams.globalParams.topK}
                      setParamsDisabled={() => {
                        return false;
                      }}
                    />
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </div>

          <div className={classes.searchControls}>
            <SearchGlobalParams
              searchParamsForm={searchParams.globalParams}
              handleFormChange={(params: any) => {
                searchParams.globalParams = params;
                setSearchParams({ ...searchParams });
              }}
            />

            <CustomButton
              onClick={executeGenerateVectors}
              size="small"
              disabled={false}
            >
              {btnTrans('example')}
            </CustomButton>

            <CustomButton
              variant="contained"
              size="small"
              disabled={disableSearch}
              onClick={handleSearch}
            >
              {btnTrans('search')}
            </CustomButton>
          </div>

          <div className={classes.searchResults}>
            {(searchParams.searchResult &&
              searchParams.searchResult.length > 0) ||
            tableLoading ? (
              <AttuGrid
                toolbarConfigs={[]}
                colDefinitions={colDefinitions}
                rows={result}
                rowCount={total}
                primaryKey="rank"
                page={currentPage}
                rowHeight={39}
                onPageChange={handlePageChange}
                rowsPerPage={pageSize}
                setRowsPerPage={handlePageSize}
                openCheckBox={false}
                isLoading={tableLoading}
                orderBy={orderBy}
                order={order}
                labelDisplayedRows={getLabelDisplayedRows(`(1 ms)`)} // TODO
                handleSort={handleGridSort}
              />
            ) : (
              <EmptyCard
                wrapperClass={`page-empty-card`}
                icon={<VectorSearchIcon />}
                text={
                  searchParams.searchResult !== null
                    ? searchTrans('empty')
                    : searchTrans('startTip')
                }
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
