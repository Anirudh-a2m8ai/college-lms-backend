import _ from 'lodash';

export const OrderMapper = (query: any) => {
  const sortBy = query.sort_by || 'id';
  const sortOrder = query.sort_order === 'asc' ? 'asc' : 'desc';

  return sortBy.split(',').map((field: string) => {
    const obj: any = {};
    _.set(obj, field, sortOrder);
    return obj;
  });
};
