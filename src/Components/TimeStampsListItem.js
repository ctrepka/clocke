import React from 'react'
import {
    Grid, List,
    Input, Card,
    Icon,
} from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { toHMS } from '../Helpers/TimeStampReducers'

const TimeStampsListItem = (props) => {


    return (
        <List.Item key={props.stamp.id}>
            <List.Content>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <h4><Link to={`/task/${props.stamp.parentTask.id}`}>{props.stamp.parentTask.Name}</Link></h4>
                            <Link style={{fontWeight: '500'}} to={`/project/${props.stamp.parentProject.id}`}>for {props.stamp.parentProject.Name}</Link>
                        </Grid.Column>
                        <Grid.Column style={{ textAlign: 'right' }} width={8}>
                            <div >
                                <h4>{ props.stamp.EndTime ? toHMS((new Date(props.stamp.EndTime) - new Date(props.stamp.StartTime)) / 1000) : 'Clock Running'}</h4>
                                <strong>  {new Date(props.stamp.StartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}  </strong>  
                                - 
                                <strong>  {new Date(props.stamp.EndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                            </div>
                            <div style={{ fontStyle: 'italic', }}>
                                <strong>{new Date(props.stamp.StartTime).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}</strong>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </List.Content>
        </List.Item>
    )

}

export default TimeStampsListItem