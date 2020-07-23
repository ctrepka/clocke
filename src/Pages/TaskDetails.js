import React from 'react'
import { Grid, List, Icon, Breadcrumb } from 'semantic-ui-react'

import gql from 'graphql-tag'
import { useQuery, useSubscription } from '@apollo/react-hooks'
import { Link, useParams } from 'react-router-dom'

import { Timer } from '../Components/Timer'
import TimeStampsList from '../Components/TimeStampsList'

const GET_TASK = gql`
  query getTask($id: uuid!) {
    Task_by_pk(id: $id) {
      id
      Name
      Description
      TimeStamps(order_by: {StartTime: desc, EndTime: desc_nulls_first}){
            StartTime
            EndTime
            parentTask{ 
                id
                Name 
            }
            parentProject {
                id  
                Name
            }
      }
      parentProject {
            id  
            Name
      }
    }
  }
`
export const TaskDetails = () => {
    const {id} = useParams()

    const { loading, data } = useQuery(GET_TASK, { variables: {id} })
    if(loading) return <Icon name='cog' size='huge' loading ></Icon>

    return (
        <div>
            <Breadcrumb>
                <p><Link to='/'>Home</Link> > <Link to='/projects'>Projects</Link> > <Link to={`/project/${data.Task_by_pk.parentProject.id}`}>{data.Task_by_pk.parentProject.Name}</Link> > {data.Task_by_pk.Name}</p>
            </Breadcrumb>
            <h1>{data.Task_by_pk.Name}</h1>
            <p>{data.Task_by_pk.Description}</p>
            <Grid divided >
                <Grid.Row >
                    <Grid.Column width={10} >
                        {
                        data ?
                            <TimeStampsList timestamps={data.Task_by_pk.TimeStamps} /> : <p>Get workin'! No timestamps submitted yet...</p>
                        }
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <h3>Task Details</h3>
                        {
                            <div>
                                <p>{data.Task_by_pk.Description}</p>
                            </div>
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>    
        </div>
        
    );

}
