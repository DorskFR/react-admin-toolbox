import { login, logout } from './axiosHttp';
import jwt_decode from 'jwt-decode';

const authProvider = {
  access_token: null,
  permissions: null,

  login: async ({ username, password }: any) => {
    const access_token = await login({ username, password });
    if (access_token) {
      const decoded: any = jwt_decode(access_token);
      if (!decoded.permissions.includes("staff")) {
      }
      authProvider.access_token = access_token;
      authProvider.permissions = decoded.permissions;
      return Promise.resolve();
    } else { return Promise.reject(); }
  },

  logout: () => {
    logout()
      .then(() => {
        authProvider.access_token = null;
        authProvider.permissions = null;
      });
    return Promise.resolve();
  },

  checkError: async (error: any) => {
    const status = error.response.status;
    if (status === 401 || status === 403) {
      authProvider.access_token = null;
      authProvider.permissions = null;
      return Promise.reject();
    }
    return Promise.resolve();
  },

  checkAuth: async () => {
    return authProvider.access_token ? Promise.resolve() : Promise.reject();
  },

  getPermissions: () => {
    const permissions = authProvider.permissions;
    return permissions ? Promise.resolve(permissions) : Promise.reject();
  },
};

export default authProvider;
