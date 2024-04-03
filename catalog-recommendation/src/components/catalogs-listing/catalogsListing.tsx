/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from 'react';
import BusinessUnitSelector from './businessUnitSelector';
import useShoppingLists from '../../hooks/useShoppingLists';
import Text from '@commercetools-uikit/text';
import { PageContentNarrow } from '@commercetools-frontend/application-components';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  DOMAINS,
  NOTIFICATION_KINDS_SIDE,
  NOTIFICATION_KINDS_PAGE,
} from '@commercetools-frontend/constants';

const CatalogsListing: React.FC = () => {
  const [buSelection, setBuSelection] = useState<any>();
  const [shoppingLists, setShoppingLists] = useState<any[]>([]);

  const showNotification = useShowNotification();
  const { getShoppingLists, deleteShoppingListById } = useShoppingLists();

  useEffect(() => {
    async function retrieveShoppingLists() {
      try {
        const shoppingLists = await getShoppingLists();
        setShoppingLists(shoppingLists.results);
      } catch (error) {
        //console.log(error);
      }
    }
    retrieveShoppingLists();
  }, []);

  const [buLists, setBuLists] = useState<any>();
  const [benoitsShoppingLists, setBenoitsShoppingLists] = useState<any[]>([]);

  useMemo(() => {
    setBuLists(
      shoppingLists.filter((shoppingList) =>
        shoppingList.name['fr-FR'].includes(buSelection.key)
      )
    );
  }, [buSelection]);

  useMemo(() => {
    setBenoitsShoppingLists(
      shoppingLists.filter(
        (shoppingList) =>
          shoppingList.customer.id === '6f05bc8c-b93b-4178-bd0d-7b0d680a1faa'
      )
    );
  }, [shoppingLists]);

  return (
    <>
      <PageContentNarrow>
        <div className="pb-5">
          <Text.Headline as="h1">
            Catalog Recommendations Management
          </Text.Headline>
        </div>
        <BusinessUnitSelector
          setSelection={setBuSelection}
          selection={buSelection}
        />
        <div className="pt-5 pb-2">
          <Text.Headline as="h2">Recommendation Lists:</Text.Headline>
        </div>

        <ul>
          {buLists?.map((shoppingList: any) => {
            return (
              <li className="pl-5 pb-1" key={shoppingList.index}>
                {shoppingList?.name['fr-FR']}
              </li>
            );
          })}
        </ul>
        <PrimaryButton
          style={{ width: 370, textAlign: 'justify', marginTop: 10 }}
          label="Delete Recommendation Lists for the selected BU"
          type="button"
          size="big"
          isDisabled={buLists?.length < 1}
          onClick={() => {
            buLists.forEach((buList: any) => {
              deleteShoppingListById(buList.id, buList.version).then(
                (response: any) => {
                  if (response.statusCode) {
                    showNotification({
                      kind: NOTIFICATION_KINDS_PAGE.error,
                      domain: DOMAINS.PAGE,
                      text: response.message,
                    });
                  } else {
                    showNotification({
                      kind: NOTIFICATION_KINDS_SIDE.success,
                      domain: DOMAINS.SIDE,
                      text: `Recommendation List ${buList.name['fr-FR']} deleted!`,
                    });
                  }
                }
              );
            });
            setBuLists([]);
            setBuSelection('');
          }}
        />
        <div>
          <hr className="mt-10 mb-5" />
          <Text.Headline as="h2">
            <p className="text-red-600">Danger zone</p>
          </Text.Headline>
          <PrimaryButton
            style={{ width: 280, textAlign: 'justify', marginTop: 10 }}
            label="Delete All Catalog Recommendations"
            type="button"
            size="big"
            isDisabled={benoitsShoppingLists?.length < 1}
            onClick={() => {
              benoitsShoppingLists.forEach((shoppingList: any) => {
                deleteShoppingListById(
                  shoppingList.id,
                  shoppingList.version
                ).then((response: any) => {
                  if (response.statusCode) {
                    showNotification({
                      kind: NOTIFICATION_KINDS_PAGE.error,
                      domain: DOMAINS.PAGE,
                      text: response.message,
                    });
                  } else {
                    showNotification({
                      kind: NOTIFICATION_KINDS_SIDE.success,
                      domain: DOMAINS.SIDE,
                      text: `Recommendation List ${shoppingList.name['fr-FR']} deleted!`,
                    });
                  }
                });
              });
              setBenoitsShoppingLists([]);
              setBuLists([]);
              setBuSelection('');
            }}
          />
        </div>
      </PageContentNarrow>
    </>
  );
};

export default CatalogsListing;
