import { fetchApartmentList } from './listService';

export const getListingByIdentifier = async (identifier) => {
  const list = await fetchApartmentList();
  const match = list.find(item =>
    item.slug?.toLowerCase() === identifier.toLowerCase() ||
    item.title?.toLowerCase() === identifier.toLowerCase()
  );
  return match;
};
