import { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { PartitionService } from '@/http';
import type { PartitionData } from '@server/types';
import CustomInput from '@/components/customInput/CustomInput';
import { useTranslation } from 'react-i18next';

interface PartitionsSelectorProps {
  collectionName: string;
  selected: PartitionData[];
  setSelected: (value: PartitionData[]) => void;
}

export default function PartitionsSelector(props: PartitionsSelectorProps) {
  // i18n
  const { t: searchTrans } = useTranslation('search');

  // props
  const { collectionName, selected, setSelected } = props;
  // state
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<readonly PartitionData[]>([]);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    setLoading(true);
    (async () => {
      try {
        const res = await PartitionService.getPartitions(collectionName);
        setOptions([...res]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Autocomplete
      open={open}
      multiple
      limitTags={2}
      color="primary"
      disableCloseOnSelect
      onOpen={handleOpen}
      onClose={handleClose}
      onChange={(_, value) => {
        setSelected(value);
      }}
      value={selected}
      isOptionEqualToValue={(option, value) =>
        option && value && option.name === value.name
      }
      getOptionLabel={option => (option && option.name) || ''}
      options={options}
      loading={loading}
      noOptionsText={
        loading ? searchTrans('loading') : searchTrans('noOptions')
      }
      renderInput={params => {
        return (
          <CustomInput
            textConfig={{
              ...params,
              label: searchTrans('partitionFilter'),
              key: 'partitionFilter',
              className: 'input',
              value: params.inputProps.value,
              disabled: loading, // 禁用输入
              variant: 'filled',
              required: false,
              InputLabelProps: { shrink: true },
            }}
            checkValid={() => true}
            type="text"
          />
        );
      }}
    />
  );
}
