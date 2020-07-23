import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { Modal, Form, Button, Input, TextArea, Radio, Icon, Dropdown } from 'semantic-ui-react'

import { updateTask as EDIT_TASK } from '../../Queries/tasks'
import { projectsList, getProject as GET_PROJECT, projectsQuery as GET_PROJECTS } from '../../Queries/projects'
import { IS_RUNNING } from '../../Queries/timestamps'
import { useAuth0 } from '../../react-auth0-spa'

export const EditTaskPopup = (props) => {
    const [isOpen, setIsOpen] = useState(false)

    const [id, setId] = useState(props.id)
    const [name, setName] = useState(props.name)
    const [description, setDescription] = useState(props.description)
    const [isPublic, setIsPublic] = useState(props.public)
    const [project, setProject] = useState(props.project)

    const {
        user,
        isAuthenticated,
        getIdTokenClaims,
      } = useAuth0();

    const open = (modal) => { setIsOpen(true); }
    const close = (modal) => { setIsOpen(false); }

    const [editTask, { projData }] = useMutation(EDIT_TASK, {
        refetchQueries: mutationResult => [{ query: GET_PROJECT, variables: { id: project } }, {query: GET_PROJECTS}, {query: IS_RUNNING, variables: { UserId: user.sub }}]
    })

    
    const { loading, error, data } = useQuery(projectsList)

    return (
        <React.Fragment>
            <Button icon labelPosition='left' color='twitter'
                onClick={() => open()}
            >
                Edit
                <Icon name='edit outline' />
            </Button>
            
            <Modal dimmer={'blurring'} open={isOpen} onClose={() => close()}>
                <Modal.Header>Edit task</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={e => {
                        e.preventDefault();
                        editTask({
                            variables: { id: id, Description: description, Name: name, Public: isPublic, Project: project }
                        })

                        close()
                    }}>
                        <Form.Field>
                            <label>Task name</label>
                            <Input placeholder='Task Name' value={name} onChange={e => setName(e.target.value)} />
                        </Form.Field>
                        <Form.Field>
                            <label>Select Parent Project</label>
                            <Dropdown
                                button
                                className='icon'
                                floating
                                labeled
                                icon='folder open'
                                value={project}
                                placeholder='Select Project'
                                options={
                                    data.Project.map(d => {
                                        return {
                                            key: d.id,
                                            text: d.Name,
                                            value: d.id
                                        }
                                    })
                                }
                                onChange={ ( e, data ) => setProject(data.value)}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Task description</label>
                            <TextArea rows={4} placeholder='Task Description' value={description} onChange={e => setDescription(e.target.value)} />
                        </Form.Field>
                        <Form.Field>
                            <label>Make task public?</label>
                            <Radio toggle checked={isPublic} onClick={e => { setIsPublic(e.target.checked = !isPublic); }} />
                        </Form.Field>
                        <Button
                            positive
                            type='submit'
                            icon='checkmark'
                            labelPosition='right'
                            content="Submit Changes"
                        />
                    </Form>
                </Modal.Content>
            </Modal>    
        </React.Fragment>
             
    )

}

