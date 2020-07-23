import React, { useState, useEffect } from 'react'
import { Card, Icon, Grid, Form, Dropdown, Menu } from 'semantic-ui-react'
import useTimer from '../Helpers/UseTimer'
import useInterval from '../Helpers/UseTimer'
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { ADD_TIMESTAMP, UPDATE_TIMESTAMP, IS_RUNNING } from '../Queries/timestamps'
import { projectsQuery as GET_PROJECTS } from '../Queries/projects' 

export const Timer = (props) => {

    const filterProjectOptions = () => {
        const projOptions = [];
        props.projects.map((p) => {
            projOptions.push({
                key: p.id,
                value: p.id,
                text: p.Name,
            })
        })
        return projOptions
    }
    const filterTaskOptions = (projectIDFilter) => {
        const tasks = [];
        let taskOptions = [];
        props.projects.forEach((p) => tasks.push(...p.Tasks))
        tasks.map((t) => {
            taskOptions.push({
                key: t.id,
                value: t.id,
                text: t.Name,
                parent_project: t.parentProject.id
            })
        })

        if (projectIDFilter) {
            taskOptions = taskOptions.filter(t => t.parent_project == projectIDFilter)
        }
        return taskOptions
    }

    const [projectOptions, setProjectOptions] = useState(filterProjectOptions())
    const [taskOptions, setTaskOptions] = useState(filterTaskOptions())

    const [selectedProject, setSelectedProject] = useState()
    const [selectedTask, setSelectedTask] = useState()
    const [currentTimestamp, setCurrentTimestamp] = useState()

    //mutations and subscriptions
    const [addTimestamp] = useMutation(ADD_TIMESTAMP, {
        update: (proxy, tsResult) => setCurrentTimestamp(tsResult.data.insert_TimeStamp.returning[0].id),
        refetchQueries: mutationResult => [{ query: GET_PROJECTS }]
    })
    const [updateTimestamp] = useMutation(UPDATE_TIMESTAMP, {
        refetchQueries: mutationResult => [{ query: GET_PROJECTS }]
    })
    const { loading, data } = useQuery(IS_RUNNING, { variables: { UserId: props.user.sub } })

    const [timer, setTimer] = useState(0)
    const [isRunning, setIsRunning] = useState(false);
    const [isOpen, setIsOpen] = useState(false)

    useInterval(() => {
        setTimer(timer + 1)
    }, isRunning ? 1000 : null)


    const formatTime = (s) => {
        const h = Math.floor(s / 60 / 60)
        const m = Math.floor(s / 60 % 60)
        const S = Math.floor(s % 60 % 60)
        const leadingZero = (t) => t < 10 ? `0${t}` : `${t}`

        return `${leadingZero(h)}h  ${leadingZero(m)}m  ${leadingZero(S)}s`
    }

    const startTime = async () => {
        setIsRunning(true)
        addTimestamp({ variables: { Project: selectedProject, Task: selectedTask, StartTime: new Date().toUTCString(), Public: true, UserId: props.user.sub } })
    }

    const endTime = () => {
        setIsRunning(false)
        setTimer(0)
        updateTimestamp({ variables: { id: currentTimestamp, Project: selectedProject, Task: selectedTask, EndTime: new Date().toUTCString(), Public: true } })
    }

    useEffect(() => {
        if (data && data.TimeStamp.length > 0) {
            setTimer((new Date() - new Date(data.TimeStamp[0].StartTime)) / 1000);
            setCurrentTimestamp(data.TimeStamp[0].id);
            setIsRunning(true);
            setSelectedProject(data.TimeStamp[0].parentProject.id);
            setSelectedTask(data.TimeStamp[0].parentTask.id)
        }
        if (data && data.TimeStamp.length <= 0) {
            setIsRunning(false)
            setCurrentTimestamp(null)
            setSelectedProject('')
            setSelectedTask('')
            setTimer(null)
        }
    }, [data, props])


    if (loading) return <Icon name='cog' size='huge' loading ></Icon>

    return (
        <Menu>
            {props.projects || props.tasks ? (
                <React.Fragment>
                    {props.projects ? (
                        <Dropdown
                            placeholder='Select Project'
                            search
                            selection
                            value={selectedProject}
                            options={projectOptions}
                            onChange={(e, data) => { setSelectedProject(data.value); setSelectedTask(); setTaskOptions(filterTaskOptions(data.value)) }}
                        />
                    ) : null}
                    <Dropdown
                        
                        disabled={selectedProject ? false : true}
                        placeholder='Select Task'
                        search
                        selection
                        value={selectedTask}
                        options={taskOptions}
                        onChange={(e, data) => { setSelectedTask(data.value); }}
                    />
                </React.Fragment>) : null}
            
                <Grid floated={'right'}>
                    <Grid.Row verticalAlign={'middle'} >
                        <Grid.Column center width={12}>
                            <h4> {timer ? formatTime(timer) : formatTime(0)} </h4>
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Icon disabled={!selectedProject || !selectedTask} size='large' name={isRunning ? 'stop circle' : 'play circle'}
                                color={isRunning ? 'red' : 'green'}
                                onClick={() => isRunning ? endTime() : startTime()}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
        </Menu>
    )

}

