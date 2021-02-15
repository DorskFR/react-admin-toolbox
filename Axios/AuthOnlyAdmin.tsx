// AuthOnlyAdmin.js
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import { AdminContext, AdminUI, AdminUIProps } from 'react-admin';
import authProvider from './authProvider';

const AuthOnlyAdminUI = (props: any) => {
  // const authProvider = useAuthProvider();
  const location = useLocation();
  const history = useHistory();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!authChecked) {
      authProvider.checkAuth()
        .catch((err) => {
          if (location.pathname !== '/login') {
            history.push('/login');
          }
          return err;
        })
        .finally(() => {
          setAuthChecked(true);
        });
    }
  }, [authProvider, location, history]);

  return authChecked ? <AdminUI {...props} /> : null;
};

const AuthOnlyAdmin = (props: any) => {
  const {
    authProvider,
    dataProvider,
    i18nProvider,
    history,
    customReducers,
    customSagas,
    initialState,
    logoutButton,
    children,
    ...restProps
  } = props;
  return (
    <AdminContext
      authProvider={authProvider}
      dataProvider={dataProvider}
      i18nProvider={i18nProvider}
      history={history}
      customReducers={customReducers}
      customSagas={customSagas}
      initialState={initialState}
    >
      <AuthOnlyAdminUI
        {...restProps}
        logout={authProvider ? logoutButton : undefined}
      >
        {children}
      </AuthOnlyAdminUI>
    </AdminContext>
  );
};

export default AuthOnlyAdmin;