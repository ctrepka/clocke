import React, { useEffect, useState } from 'react';
import './App.css';
import './Override.css';
import { Switch, Route, Link, Router as BrowserRouter } from 'react-router-dom';
import { Icon, Menu, Dropdown } from 'semantic-ui-react'

import NavBar from "./Components/NavBar";
import { useAuth0, isLoggedIn } from "./react-auth0-spa";

import { ApolloProvider, useQuery } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { setContext } from "apollo-link-context";

import SecuredRoute from './Components/SecuredRoute'
import { Projects } from './Pages/Projects'
import { ProjectDetails } from './Pages/ProjectDetails'
import { TaskDetails } from './Pages/TaskDetails'
import { Timer } from './Components/Timer'
import history from './utils/history';


function App() {
  const [isOpen, setIsOpen] = useState(false)
  const {
    user,
    isAuthenticated,
    getIdTokenClaims,
  } = useAuth0();

  const [accessToken, setAccessToken] = useState("");
  const { getTokenSilently, loading } = useAuth0();

  // get access token
  const getAccessToken = async () => {
    // getTokenSilently() returns a promise
    try {
      const token = await getIdTokenClaims();
      setAccessToken(token);
      // console.log(token);
    } catch (e) {
      console.log('error');
    }
  };
  getAccessToken();


  const httpLink = new HttpLink({
    uri: "https://time-track-application.herokuapp.com/v1/graphql"
  });
  const authLink = setContext((_, { headers }) => {
    const token = accessToken;
    if (token) {
      return {
        headers: {
          ...headers,
          Authorization: `Bearer ${token.__raw}`
        }
      };
    } else {
      return {
        headers: {
          ...headers,
        }
      };
    }
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });

  const toggleIsOpen = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    getAccessToken();
  }, [loading, user, getIdTokenClaims, getTokenSilently, isAuthenticated])

  if (loading) {
    return <Icon name='cog' size='huge' loading ></Icon>;
  }

  return (
    <BrowserRouter history={history}>
      <ApolloProvider client={client}>
        <NavBar />

        <Switch>
          <SecuredRoute path="/" component={Projects} exact />
          <SecuredRoute path="/projects" component={Projects} exact />
          <SecuredRoute path="/project/:id" component={ProjectDetails} exact />
          <SecuredRoute path="/task/:id" component={TaskDetails} exact />
          <SecuredRoute path="/timer" component={Timer} />
        </Switch>
      </ApolloProvider>
    </BrowserRouter>
  );
}

export default App;
