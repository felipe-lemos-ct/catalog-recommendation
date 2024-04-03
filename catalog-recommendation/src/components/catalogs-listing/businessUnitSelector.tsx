/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import SelectInput from '@commercetools-uikit/select-input';
import useBusinessUnits from '../../hooks/useBusinessUnits';

interface BusinessUnitSelectorProps {
  setSelection: any;
  selection: any;
}

const BusinessUnitSelector: React.FC<BusinessUnitSelectorProps> = ({
  setSelection,
  selection,
}) => {
  const [businessUnits, setBusinessUnits] = useState<any>([]);

  const { getBusinessUnits } = useBusinessUnits();

  useEffect(() => {
    async function retrieveBusinessUnits() {
      try {
        const result = await getBusinessUnits();

        result.results.map((buResult: any) => {
          setBusinessUnits((businessUnits: any) => [
            ...businessUnits,
            { value: buResult, label: buResult.name },
          ]);
        });
      } catch (error) {
        //console.log(error);
      }
    }
    retrieveBusinessUnits();
  }, []);

  return (
    <>
      {businessUnits ? (
        <SelectInput
          value={selection}
          options={businessUnits}
          onChange={(event) => {
            setSelection(event?.target.value);
          }}
        ></SelectInput>
      ) : null}
    </>
  );
};

export default BusinessUnitSelector;
