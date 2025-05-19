export function paginate(array, page = 1, pageSize = 10) {
  const start = (page - 1) * pageSize;
  return array.slice(start, start + pageSize);
}