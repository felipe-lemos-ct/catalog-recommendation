/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from 'react';
import BusinessUnitSelector from './businessUnitSelector';
import useShoppingLists from '../../hooks/useShoppingLists';

const CatalogsListing: React.FC = () => {
  const [buSelection, setBuSelection] = useState<any>();
  const [shoppingLists, setShoppingLists] = useState<any[]>([]);

  let filteredShoppingLists;

  const { getShoppingLists } = useShoppingLists();

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

  useMemo(() => {
    filteredShoppingLists = shoppingLists.filter(
      (shoppingList) => shoppingList.name?.['fr-FR'] === 'commande-noel'
    );
  }, [buSelection]);
  return (
    <>
      <BusinessUnitSelector
        setSelection={setBuSelection}
        selection={buSelection}
      />
      <pre>{JSON.stringify(filteredShoppingLists, null, 4)}</pre>
    </>
  );
};

export default CatalogsListing;
