import gql from 'graphql-tag'

export { ADD_TIMESTAMP, UPDATE_TIMESTAMP, IS_RUNNING }

const ADD_TIMESTAMP = gql`
mutation insert_Timestamp($Project: uuid!, $Task: uuid!, $StartTime: timestamptz!, $Public: Boolean!, $UserId: String! ) {
    insert_TimeStamp(objects: { Project: $Project, Task: $Task, StartTime: $StartTime, Public: $Public, user_id: $UserId }){
      affected_rows
      returning {
          id
      }
    }
  }
`;

const UPDATE_TIMESTAMP = gql`
mutation update_Timestamp($id: uuid!, $Project: uuid!, $Task: uuid!, $EndTime: timestamptz!, $Public: Boolean!) {
    update_TimeStamp(where: {id: {_eq: $id}}, _set: {EndTime: $EndTime, Project: $Project, Public: $Public, Task: $Task}) {
      affected_rows
    }
  }
`;

const IS_RUNNING = gql`query Running( $UserId: String! ) {
    TimeStamp(where: {StartTime: {_is_null: false}, EndTime: {_is_null: true}, user_id: {_eq: $UserId}}) {
      id
      StartTime
      parentProject {
        id
        Name
      }
      parentTask {
        id
        Name
      }
    }
  }
`
