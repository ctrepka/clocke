import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { Modal, Form, Button, Input, TextArea, Radio, Icon } from 'semantic-ui-react'

import { updateProject as EDIT_PROJECT, projectsQuery as GET_PROJECTS } from '../../Queries/projects'

export const EditProjectPopup = (props) => {
    const [isOpen, setIsOpen] = useState(false)

    const [id, setId] = useState(props.id)
    const [name, setName] = useState(props.name)
    const [description, setDescription] = useState(props.description)
    const [isPublic, setIsPublic] = useState(props.isPublic)

    const open = (modal) => { setIsOpen(true); }
    const close = (modal) => { setIsOpen(false); }

    const [editProject, { projData }] = useMutation(EDIT_PROJECT, {
        refetchQueries: mutationResult => [{ query: GET_PROJECTS }]
    })

    return (
        <React.Fragment>
            <Button icon labelPosition='left' color='twitter'
                onClick={() => open()}
            >
                Edit
                <Icon name='edit outline' />
            </Button>

            <Modal dimmer={'blurring'} open={isOpen} onClose={() => close()}>
                <Modal.Header>Edit project</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={e => {
                        e.preventDefault();
                        editProject({
                            variables: { id: id, Description: description, Name: name, Public: isPublic }
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
                            content="Submit Changes"
                        />
                    </Form>
                </Modal.Content>
            </Modal>
        </React.Fragment>

    )

}

