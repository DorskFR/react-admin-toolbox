import axios from 'axios';
import rateLimit from 'axios-rate-limit';


// axios object and config
export const axiosHttp = rateLimit(axios.create(), { maxRequests: 2, perMilliseconds: 1000, maxRPS: 2 });
export const apiUrl = 'http://localhost:8001';
axiosHttp.defaults.withCredentials = true;
axiosHttp.defaults.baseURL = apiUrl;


export const refresh = () => {
  return axiosHttp
    .get('/auth/refresh',
      {
        transformRequest: [(data, headers) => {
          delete headers.common.Authorization;
          return data;
        }]
      })
    .then((response) => {
      if (response && response.status === 200) {
        const access_token = response.data['access_token'];
        axiosHttp.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        return { "access_token": access_token };
      }
      throw new Error();
    })
};

export const login = ({ username, password }: any) => {
  return axiosHttp
    .post('/auth/login', { username, password })
    .then((response) => {
      if (response && response.status === 200) {
        const access_token = response.data['access_token'];
        axiosHttp.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        return access_token;
      }
      return null;
    })
    .catch(error => { throw new Error(error); });
};

export const logout = () => {
  axiosHttp.defaults.headers.common['Authorization'] = '';
  return axiosHttp
    .delete('auth/logout');
};