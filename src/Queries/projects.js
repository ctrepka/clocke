import gql from 'graphql-tag'

export const DELETE_PROJECT = gql`
mutation deleteProject($id: uuid!) {
    delete_Project(where: {id: {_eq: $id}}) {
      affected_rows
    }
  }
`
export const addProject = gql`
  mutation addProject($Name: String!, $Description: String!, $Public: Boolean!, $UserId: String! ){
    insert_Project(objects: {Description: $Description, Name: $Name, Public: $Public, user_id: $UserId }) {
      affected_rows
    }
  }
`;

export const updateProject = gql`
    mutation updateProject($id: uuid!, $Description: String!, $Name: String!, $Public: Boolean!) {
        update_Project(where: {id: {_eq: $id}}, _set: {Description: $Description, Name: $Name, Public: $Public}) {
        affected_rows
    }
}`;

export const projectsQuery = gql`
query getProjects {
  Project {
    id
    Name
    Description
    Tasks {
        id
        Name
        parentProject {
            id
        }
    }
    Public
  },
  TimeStamp(order_by: {StartTime: desc, EndTime: desc_nulls_first}){
    StartTime
          EndTime
          parentTask{ 
              id
              Name 
          }
          parentProject{
              id
              Name
          }
  }
}
`;

export const projectsList = gql`
        query getProjects {
            Project {
              id
              Name
            }
        }
    `

    export const getProject = gql`
    query getProject($id: uuid!) {
      Project_by_pk(id: $id) {
        id
        Name
        Description
        Tasks {
            id
            Name
            Description
            Public
            Project
        }
        TimeStamps(order_by: {StartTime: desc, EndTime: desc_nulls_first}){
              StartTime
              EndTime
              parentTask{ 
                  id
                  Name 
              }
              parentProject{ 
                  id
                  Name 
              }
        }
      }
    }
  `