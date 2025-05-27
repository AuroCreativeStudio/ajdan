import { fetchApartmentList } from './listService';
import { fetchBlogs } from './blogService'; 

export const getListingByIdentifier = async (identifier, locale = 'en') => {
  const list = await fetchApartmentList(locale);

  const normalizedId = identifier.normalize('NFD').replace(/[\u064B-\u065F]/g, '').toLowerCase();

  return list.find(item => {
    const slugNorm = item.slug?.normalize('NFD').replace(/[\u064B-\u065F]/g, '').toLowerCase();
    const titleNorm = item.title?.normalize('NFD').replace(/[\u064B-\u065F]/g, '').toLowerCase();
    return slugNorm === normalizedId || titleNorm === normalizedId;
  }) || null;
};


export const getListingBySlugOrTitle = async (identifier, locale = 'en') => {
  const blogsData = await fetchBlogs(locale);

  const list = blogsData.data || [];
  return list.find(item =>
    item.slug?.toLowerCase() === identifier.toLowerCase() ||
    item.title?.toLowerCase() === identifier.toLowerCase()
  );
};
