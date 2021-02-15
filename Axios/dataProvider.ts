import { stringify } from 'query-string';
import { axiosHttp, apiUrl } from './axiosHttp';

const httpClient = axiosHttp;

const dataProvider = {

  getList: (resource: any, params: any) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify(params.filter),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    return httpClient
      .get(url)
      .then(response => {
        return ({
          data: response.data,
          total: parseInt(response.headers["x-total-count"].split('/').pop(), 10),
        });
      })
  },

  getOne: (resource: any, params: any) => {
    return httpClient
      .get(`${apiUrl}/${resource}/${params.id}`)
      .then(response => ({
        data: response.data,
      }));
  },

  getMany: (resource: any, params: any) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    return httpClient
      .get(url)
      .then(response => ({ data: response.data }));
  },

  getManyReference: (resource: any, params: any) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify({
        ...params.filter,
        [params.target]: params.id,
      }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    return httpClient
      .get(url)
      .then(response => ({
        data: response.data,
        total: parseInt(response.headers["x-total-count"].split('/').pop(), 10),
      }));
  },

  update: (resource: any, params: any) => {
    return httpClient
      .put(
        `${apiUrl}/${resource}/${params.id}`,
        JSON.stringify(params.data)
      )
      .then(response => ({ data: response.data }));
  },

  updateMany: (resource: any, params: any) => {
    const query = { filter: JSON.stringify({ id: params.ids }) };
    return httpClient
      .put(
        `${apiUrl}/${resource}?${stringify(query)}`,
        JSON.stringify(params.data)
      )
      .then(response => ({ data: response.data }));
  },

  create: (resource: any, params: any) => {
    return httpClient
      .post(
        `${apiUrl}/${resource}`,
        JSON.stringify(params.data)
      )
      .then(response => ({
        data: { ...params.data, id: response.data.id },
      }));
  },

  delete: (resource: any, params: any) => {
    return httpClient
      .delete(`${apiUrl}/${resource}/${params.id}`)
      .then(response => ({ data: response.data }));
  },

  deleteMany: (resource: any, params: any) => {
    const query = { filter: JSON.stringify({ id: params.ids }) };
    return httpClient
      .post(
        `${apiUrl}/${resource}?${stringify(query)}`,
        JSON.stringify(params.data),
      )
      .then(response => ({ data: response.data }));
  },
};

export default dataProvider;