import React, { useState } from "react";
import { useAuth0 } from "../react-auth0-spa";
import { Button, Icon, Dropdown, Menu, MenuItem } from "semantic-ui-react";

import { Timer } from './Timer'
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Link } from "react-router-dom";


const GET_PROJECTS = gql`
  query getProjects {
    Project {
      id
      Name
      Description
      TimeStamps{
            StartTime
            EndTime
            parentTask{ 
                id
                Name 
            }
      }
      Tasks {
          id
          Name
          parentProject {
              id
          }
      }
    }
  }
`;

const NavBar = (props) => {
  const { isAuthenticated, loginWithRedirect, user, logout } = useAuth0();

  const { data, loading } = useQuery(GET_PROJECTS)

  const [isOpen, setIsOpen] = useState(false)

  const toggleIsOpen = () => {
    setIsOpen(!isOpen)
  }


  return (
    <React.Fragment>
      <Menu>
        <Menu.Item position='right'>
          {!isAuthenticated && (
            <Button positive onClick={() => loginWithRedirect()}>Log in</Button>
          )}
          {isAuthenticated && <Button positive onClick={() => logout()}>Log out</Button>}
        </Menu.Item>
      </Menu>
      {console.log(user)}
      {isAuthenticated && data && (

        <Timer projects={data.Project} user={user} ></Timer>

      )}
    </React.Fragment>

  );
};

export default NavBar;