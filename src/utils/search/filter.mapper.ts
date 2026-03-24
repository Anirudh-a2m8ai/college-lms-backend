import _ from 'lodash';

export const FilterMapper = (filterInput: any, query: any) => {
  let { search, search_by } = query;

  const rest = { ...filterInput };

  if (filterInput?.search) {
    search = filterInput.search;
    delete rest.search;
  }

  if (filterInput?.search_by) {
    search_by = filterInput.search_by;
    delete rest.search_by;
  }

  const baseFilter: any = { ...rest };

  const searchFields = (search_by || 'name').split(',');

  if (search) {
    const OR = searchFields.map((field: string) => {
      const condition: any = {};
      _.set(condition, field, {
        contains: search,
        mode: 'insensitive',
      });
      return condition;
    });

    return {
      AND: [baseFilter, { OR }],
    };
  }

  return baseFilter;
};
