import React, { useState } from 'react'
import {
    Grid, List,
    Modal, Button,
    Input, Card,
    Radio, Form,
    TextArea, Icon,
    Breadcrumb
} from 'semantic-ui-react'

import gql from 'graphql-tag'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { Link } from 'react-router-dom'

import TimeStampsList from '../Components/TimeStampsList'
import { LineChart } from '../Components/LineChart'
import { useAuth0 } from '../react-auth0-spa'

import { addProject as ADD_PROJECT, projectsQuery as GET_PROJECTS, DELETE_PROJECT } from '../Queries/projects'
import { SingleTimeline } from '../Components/D3/SingleTimeline'
import { EditProjectPopup } from '../Components/edit/EditProjectPopup'



export const Projects = () => {
    const { user } = useAuth0()
    const [isOpen, setIsOpen] = useState(false)

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [isPublic, setIsPublic] = useState(true)

    const [addProject, { projData }] = useMutation(ADD_PROJECT, {
        variables: { UserId: user.sub },
        refetchQueries: mutationResult => [{ query: GET_PROJECTS }]
    })
    const [deleteProject] = useMutation(DELETE_PROJECT, {
        refetchQueries: mutationResult => [{ query: GET_PROJECTS }]
    })

    const open = (modal) => { setIsOpen(true); }
    const close = (modal) => { setIsOpen(false); }

    const reducedTimeStamps = P => {
        const ts = []
        P.map(p => ts.push(...p.TimeStamps))
        return ts
    }

    const { loading, error, data } = useQuery(GET_PROJECTS)
    if (loading) return <Icon name='cog' size='huge' loading ></Icon>
    if (error || !data) return <div>ZOINKS! We made a boo boo. Please try back later</div>
    return (
        <div>

            <Breadcrumb style={{ margin: '12px' }}>
                <p><Link to='/'>Home</Link> / Projects</p>
            </Breadcrumb>

            <SingleTimeline data={data.TimeStamp} />

            <Grid>
                <Grid.Row>
                    <Grid.Column width={11}>
                        <h1>All Projects</h1>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

            <Grid stackable>
                <Grid.Row >
                    <Grid.Column width={10} >
                        <List divided relaxed className={'panel padding-16'}>
                            <h3>Projects</h3>
                            <List.Item key={'Create new projects key'}>
                                <List.Content>
                                    <Grid>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <button className={'ui twitter icon button'}
                                                onClick={() => open()}
                                                >
                                                    <i aria-hidden='true' className='add icon'></i>
                                                        Create Project
                                                </button>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </List.Content>
                            </List.Item>
                            {
                                data.Project.map((project, index) => (
                                    <List.Item key={project.id}>
                                        <List.Content>
                                            <Grid>
                                                <Grid.Row>
                                                    <Grid.Column width={12}>
                                                        <List.Header><Link to={`/project/${project.id}`}>{project.Name}</Link></List.Header>
                                                        {project.Description}
                                                    </Grid.Column>
                                                    <Grid.Column width={4}>
                                                        <EditProjectPopup 
                                                            id={project.id} name={project.Name} description={project.Description} isPublic={project.Public}
                                                        />
                                                        <span floated='right'>
                                                            <Icon
                                                                size='large' color='red'
                                                                onClick={() => { deleteProject({ variables: { id: project.id } }); setIsPublic(false); setName(''); setDescription('') }}
                                                                floated='right' name='trash alternate outline' />
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

                        <TimeStampsList timestamps={data.TimeStamp} />

                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Modal dimmer={'blurring'} open={isOpen} onClose={() => close()}>
                <Modal.Header>Create a new project</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={e => {
                        e.preventDefault();
                        addProject({
                            variables: { Description: description, Name: name, Public: isPublic }
                        })

                        close()
                    }}>
                        <Form.Field>
                            <label>Project name</label>
                            <Input placeholder='Project Name' value={name} onChange={e => setName(e.target.value)} />
                        </Form.Field>
                        <Form.Field>
                            <label>Project description</label>
                            <TextArea rows={4} placeholder='Project Description' value={description} onChange={e => setDescription(e.target.value)} />
                        </Form.Field>
                        <Form.Field>
                            <label>Make project public?</label>
                            <Radio toggle checked={isPublic} onClick={e => { setIsPublic(e.target.checked = !isPublic); }} />
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
            </Modal>
        </div>
    );

}
