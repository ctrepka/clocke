import React, { useState } from 'react'
import {
    Grid, Breadcrumb, Icon
} from 'semantic-ui-react'
import gql from 'graphql-tag'
import { projectsQuery as projectQuery } from '../Queries/projectsQuery'
import { useQuery, useSubscription, ApolloProvider } from '@apollo/react-hooks'


export const Home = () => {    
    return (
        <div>
            <Breadcrumb style={{ margin: '12px' }}>
                <p>Home / </p>
            </Breadcrumb>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={11}>
                        <h1>Welcome to Clocke</h1>
                    </Grid.Column>
                    <Grid.Column width={5}>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    );
}
