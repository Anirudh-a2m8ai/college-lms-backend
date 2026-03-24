export const PaginationMapper = (query: any) => {
  const page = parseInt(query.page) || 1;
  const take = parseInt(query.per_page) || 10;

  return {
    page,
    take,
    skip: page > 1 ? (page - 1) * take : 0,
  };
};
