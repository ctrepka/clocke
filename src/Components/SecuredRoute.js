import React, { useEffect } from 'react';
import {Route} from 'react-router-dom';
import { useAuth0 } from "../react-auth0-spa";


function SecuredRoute(props) {
  const {component: Component, path} = props;
  const { loading, isAuthenticated,loginWithRedirect, getTokenSilently } = useAuth0();

    useEffect(() =>{
        if(loading || isAuthenticated){
            return;
        }
        getTokenSilently();
    })

  return (
    <Route path={path} render={() => {
        if (!isAuthenticated) {
          loginWithRedirect({});
          return <div></div>;
        }
        return <Component />
    }} />
  );
}

export default SecuredRoute;