import React, { useState, useEffect } from 'react'
import {
    Grid, List,
    Modal, Button,
    Input, Breadcrumb,
    Radio, Form,
    TextArea,
    Icon
} from 'semantic-ui-react'

import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Link, useParams } from 'react-router-dom'
import TimeStampsList from '../Components/TimeStampsList'
import { useAuth0 } from '../react-auth0-spa'
import { EditTaskPopup } from '../Components/edit/EditTaskPopup'

import { getProject as GET_PROJECT } from '../Queries/projects'

const ADD_TASK = gql`
  mutation addTask( $Name: String!, $Description: String!, $Public: Boolean!, $Project: uuid!, $UserId: String! ){
    insert_Task(objects: { Description: $Description, Name: $Name, Public: $Public, Project: $Project, user_id: $UserId }) {
      affected_rows
    }
  }
`;
const DELETE_TASK = gql`
mutation deleteTask($id: uuid!) {
    delete_Task(where: {id: {_eq: $id}}) {
      affected_rows
    }
  }
`
export const ProjectDetails = () => {
    const { id } = useParams()
    const { user } = useAuth0()

    const [isOpen, setIsOpen] = useState(false)

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [isPublic, setIsPublic] = useState(true)

    const [addTask, { projData }] = useMutation(ADD_TASK, {
        variables: { UserId: user.sub },
        refetchQueries: mutationResult => [{ query: GET_PROJECT, variables: { id: id } }]
    })
    const [deleteTask] = useMutation(DELETE_TASK, {
        refetchQueries: mutationResult => [{ query: GET_PROJECT, variables: { id: id } }]
    })

    const open = () => { setIsOpen(true); }
    const close = () => setIsOpen(false)

    const { loading, data } = useQuery(GET_PROJECT, { variables: { id } })

    useEffect(() => {

    }, [data])
    if (loading) return <Icon name='cog' size='huge' loading ></Icon>
    return (
        <div>
            <Breadcrumb>
                <p><Link to='/'>Home</Link> > <Link to='/projects'>Projects</Link> > {data.Project_by_pk.Name}</p>
            </Breadcrumb>

            <Grid>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <h1>{data.Project_by_pk.Name}</h1>
                        <p>{data.Project_by_pk.Description}</p>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

            <Grid divided >
                <Grid.Row >
                    <Grid.Column width={10} >
                        <List divided relaxed>
                            <h3>Tasks</h3>
                            <List.Item key={'Create new tasks key'}>
                                <List.Content>
                                    <Grid>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <button className={'ui twitter icon button'}
                                                onClick={() => open()}
                                                >
                                                    <i aria-hidden='true' className='add icon'></i>
                                                        Create Task
                                                </button>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </List.Content>
                            </List.Item>
                            {
                                data.Project_by_pk.Tasks.map((task, index) => (
                                    <List.Item key={task.id}>
                                        <List.Content>
                                            <Grid>
                                                <Grid.Row>
                                                    <Grid.Column width={12}>
                                                        <List.Header>
                                                            <Link to={`/task/${task.id}`}>{task.Name}</Link>
                                                        </List.Header>
                                                        {task.Description}
                                                    </Grid.Column>
                                                    <Grid.Column width={4}>
                                                        <EditTaskPopup
                                                            id={task.id}
                                                            name={task.Name}
                                                            description={task.Description}
                                                            project={task.Project}
                                                            public={task.Public}
                                                        />
                                                        <span floated='right'>
                                                            <Icon
                                                                size='large' color='red'
                                                                onClick={() => { deleteTask({ variables: { id: task.id } }); }}
                                                                floated='right' name='trash alternate outline' 
                                                            />
                                                        </span>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </List.Content>
                                    </List.Item>
                                ))
                            }
                        </List>
                    </Grid.Column>
                    <Grid.Column width={6}>
                        {
                            data.Project_by_pk.TimeStamps ?
                                <TimeStampsList timestamps={data.Project_by_pk.TimeStamps} /> : <p>Get workin'! No timestamps submitted yet...</p>
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Modal dimmer={'blurring'} open={isOpen} onClose={() => close()}>
                <Modal.Header>Create a new task for {data.Project_by_pk.Name}</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={e => {
                        e.preventDefault();
                        addTask({
                            variables: { Description: description, Name: name, Public: isPublic, Project: id }
                        })

                        close()
                    }}>
                        <Form.Field>
                            <label>Task name</label>
                            <Input placeholder='Task Name' value={name} onChange={e => setName(e.target.value)} />
                        </Form.Field>
                        <Form.Field>
                            <label>Task description</label>
                            <TextArea rows={4} placeholder='Task Description' value={description} onChange={e => setDescription(e.target.value)} />
                        </Form.Field>
                        <Form.Field>
                            <label>Make task public?</label>
                            <Radio toggle checked={isPublic} onClick={e => { setIsPublic(e.target.checked = !isPublic) }} />
                        </Form.Field>
                        <Button
                            positive
                            type='submit'
                            icon='checkmark'
                            labelPosition='right'
                            content="Create Project"
                        />
                    </Form>

                </Modal.Content>
                <Modal.Actions>

                </Modal.Actions>
            </Modal>
        </div>

    );

}
