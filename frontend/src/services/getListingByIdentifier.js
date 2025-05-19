import { fetchApartmentList } from './listService';
import { fetchBlogs } from './blogService'; // Corrected import

export const getListingByIdentifier = async (identifier) => {
  const list = await fetchApartmentList();
  const match = list.find(item =>
    item.slug?.toLowerCase() === identifier.toLowerCase() ||
    item.title?.toLowerCase() === identifier.toLowerCase()
  );
  return match;
};

export const getListingBySlugOrTitle = async (identifier, locale = 'en') => {
  const blogsData = await fetchBlogs(locale);
  // If your API returns { data: [...] }, extract the array:
  const list = blogsData.data || [];
  return list.find(item =>
    item.attributes?.slug?.toLowerCase() === identifier.toLowerCase() ||
    item.attributes?.title?.toLowerCase() === identifier.toLowerCase()
  );
};
