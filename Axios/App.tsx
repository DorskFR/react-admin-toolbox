// React stuff
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Redirect } from "react-router-dom";

// React-Admin stuff
import { Login, Resource, resolveBrowserLocale } from 'react-admin';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import simpleRestProvider from 'ra-data-simple-rest';

// Custom React-Admin stuff
import { UserList, UserEdit, UserCreate } from './Users';
import { ProductList, ProductEdit, ProductCreate } from './Products';
import { italianMessages } from './i18n/italianMessages';
import AuthOnlyAdmin from "./AuthOnlyAdmin";
// import dataProvider from './dataProvider';
import authProvider from './authProvider';

// Token refresh
import { refresh } from './axiosHttp';
import jwt_decode from 'jwt-decode';


// import { createMuiTheme } from '@material-ui/core/styles';

// const theme = createMuiTheme({
//   palette: {
//     type: 'dark', // Switching the dark mode on is a single property value change.
//   },
// });


const messages: any = {
  it: { ...italianMessages },
  en: { ...englishMessages }
};

const i18nProvider = polyglotI18nProvider(
  locale => messages[locale],
  resolveBrowserLocale(),
  { allowMissing: true }
);
// const i18nProvider = polyglotI18nProvider(() => italianMessages);


const dataProvider = simpleRestProvider("http://localhost:8001", "x-control-"


const MyLoginPage = () => (
  <Login
    // A random image that changes everyday
    backgroundImage="https://source.unsplash.com/random/1600x900/daily"
  />
);


const App = () => {

  const [loading, setLoading] = useState(true);

  const refreshToken = () => {
    refresh()
      .then(response => {
        if (response.access_token) {
          const decoded: any = jwt_decode(response.access_token);
          if (!decoded.permissions.includes("staff")) {
            throw new Error("Forbidden");
          }
          authProvider.access_token = response.access_token;
          authProvider.permissions = decoded.permissions;
        }
      })
      .catch(error => {
        return <Redirect to="/login" />;
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          // console.log(`[${new Date().toISOString()}] Calling Timeout, access_token is ${authProvider.access_token}`)
          refreshToken();
        }, (600 * 1000) - 500);
      });
  };

  useEffect(() => {
    refreshToken();
  }, []);


  return (
    <>
      {
        loading ? "Loading..."
          :
          <AuthOnlyAdmin
            // theme={theme}
            loginPage={MyLoginPage}
            dataProvider={dataProvider}
            authProvider={authProvider}
            i18nProvider={i18nProvider}
            disableTelemetry
          >
            <Resource
              name="users"
              list={UserList}
              edit={UserEdit}
              create={UserCreate}
            />
            <Resource
              name="products"
              list={ProductList}
              edit={ProductEdit}
              create={ProductCreate}
            />
          </AuthOnlyAdmin>
      }
    </>
  );
};


export default App;
