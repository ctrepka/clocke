import gql from 'graphql-tag'

export const deleteTask = gql`
mutation deleteTask($id: uuid!) {
    delete_Task(where: {id: {_eq: $id}}) {
      affected_rows
    }
  }
`
export const updateTask = gql
    `mutation UpdateTask($id: uuid!, $Description: String, $Name: String, $Public: Boolean, $Project: uuid) {
        update_Task(where: {id: {_eq: $id}}, _set: {Description: $Description, Name: $Name, Public: $Public, Project: $Project}) {
            affected_rows
        }
    }`;