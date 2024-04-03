/* eslint-disable @typescript-eslint/no-explicit-any */
import SecondaryButton from '@commercetools-uikit/secondary-button';
import React, { useEffect, useMemo, useState } from 'react';
import Text from '@commercetools-uikit/text';
import CSVUploader from './csvUploader';
import PrimaryButton from '@commercetools-uikit/primary-button';
import useBusinessUnits from '../../hooks/useBusinessUnits';
import useShoppingLists from '../../hooks/useShoppingLists';
import exportErrors from '../../utils/exportErrors';

interface CSVData {
  sku: string;
  quantity: number;
}

const CatalogRecommendation: React.FC = () => {
  const [successfulCreations, setSuccessfulCreations] = useState<any[]>([]);
  const [failedCreations, setFailedCreations] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string>();
  const [csvData, setCSVData] = useState<CSVData[]>([]);
  const [buList, setBUList] = useState<any>([]);
  const [shoppingLists, setShoppingLists] = useState<any[]>([]);
  const [showFailedCreations, setShowFailedCreations] =
    useState<boolean>(false);

  const { createShoppingList } = useShoppingLists();

  async function execute(shoppingList: any) {
    try {
      const result = await createShoppingList(shoppingList.shoppingList);
      if (result.statusCode) {
        setFailedCreations((failedCreations) => [
          ...failedCreations,
          {
            businessUnit: shoppingList.businessUnit,
            store: shoppingList.store,
            result: result,
          },
        ]);
      } else {
        setSuccessfulCreations((successfulCreations) => [
          ...successfulCreations,
          {
            businessUnit: shoppingList.businessUnit,
            store: shoppingList.store,
            result: result,
          },
        ]);
      }
    } catch (error) {
      //console.log(error);
    }
  }

  const handleCSVDataChange = (data: CSVData[]) => {
    const parsedData = data.map((entry) => ({
      ...entry,
      quantity: Number(entry.quantity) || 1,
    }));
    setCSVData(parsedData);
  };

  let totalQty = 0;

  useMemo(() => {
    buList.map((bu: any) => {
      setShoppingLists((shoppingLists: any) => [
        ...shoppingLists,
        {
          businessUnit: bu.name,
          store: bu?.stores[0],
          shoppingList: {
            name: {
              fr: fileName + ' ' + bu?.key,
              en: fileName + ' ' + bu?.key,
              'fr-FR': fileName + ' ' + bu?.key,
              'en-US': fileName + ' ' + bu?.key,
            },
            customer: {
              typeId: 'customer',
              id: '6f05bc8c-b93b-4178-bd0d-7b0d680a1faa',
            },
            lineItems: csvData,
            store: bu?.stores[0],
          },
        },
      ]);
    });
  }, [csvData]);

  csvData.forEach((lineItem) => {
    totalQty += lineItem.quantity;
  });

  const bus = useBusinessUnits();

  useEffect(() => {
    async function retrieveBusinessUnits() {
      try {
        const result = await bus.getBusinessUnits();
        setBUList(result.results);
      } catch (error) {
        console.log(error);
      }
    }
    retrieveBusinessUnits();
  }, []);

  const { createErrorsJsonFile } = exportErrors();

  return (
    <>
      <div>
        <div>
          <CSVUploader
            setFileName={setFileName}
            setCSVData={handleCSVDataChange}
            csvData={csvData}
          />
        </div>

        {csvData.length > 0 ? (
          <div>
            <p className="pb-2">Total SKUs: {csvData.length}</p>
            <p className="pb-2">Total Quantity: {totalQty}</p>
            <p className="pb-2">
              Target Customers: <b>All</b>
            </p>
            <input
              id="default-checkbox"
              type="checkbox"
              value=""
              className="pb-5 mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            Clear existing lists
          </div>
        ) : null}
      </div>
      <PrimaryButton
        style={{ width: 250, textAlign: 'justify', marginTop: 10 }}
        label="Create Recommendation Lists"
        type="button"
        size="big"
        isDisabled={csvData.length < 1}
        onClick={() =>
          shoppingLists.map((shoppingList) => {
            execute(shoppingList);
          })
        }
      />

      {successfulCreations.length > 0 || failedCreations.length > 0 ? (
        <div className="pb-2 pt-5">
          <p className="pb-2">
            <Text.Headline as="h3">Execution Summary:</Text.Headline>
          </p>

          <p className="pb-2 ">
            Successfully created Shopping lists: {successfulCreations.length}
          </p>
          <p className="pb-2">
            Failed shopping list creations: {failedCreations.length}
          </p>
          {failedCreations.length > 0 ? (
            <div className="flex gap-5">
              <SecondaryButton
                style={{
                  padding: 10,
                  marginTop: 10,
                  marginBottom: 10,
                  minWidth: 100,
                  textAlign: 'justify',
                }}
                label={`${
                  showFailedCreations ? 'Hide' : 'Show'
                } Failed Creations`}
                onClick={() => setShowFailedCreations(!showFailedCreations)}
              />
              <SecondaryButton
                style={{
                  padding: 10,
                  marginTop: 10,
                  marginBottom: 10,
                  minWidth: 100,
                  textAlign: 'justify',
                }}
                label={'Download Errors JSON'}
                onClick={() => createErrorsJsonFile({ failedCreations })}
              />
            </div>
          ) : null}

          {showFailedCreations && (
            <div className="bg-gray-100 pt-3 pb-1">
              {failedCreations?.map((failedCreation) => {
                return (
                  <div className="pl-5" key={failedCreation.index}>
                    <p className="pb-3">
                      <b>Business Unit:</b> {failedCreation?.businessUnit}
                    </p>
                    <p className="pb-3">
                      <b>Store:</b> {failedCreation.store?.key}
                    </p>
                    <p>
                      <b>Errors:</b>
                    </p>
                    <ul>
                      {failedCreation?.result?.errors?.map((error: any) => {
                        return (
                          <pre key={error.index}>
                            <li className="px-10">{error.message}</li>
                          </pre>
                        );
                      })}
                    </ul>
                    <hr className="h-px my-8 bg-gray-400 border-0 dark:bg-gray-700 mr-10 " />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : null}
    </>
  );
};

export default CatalogRecommendation;
