import React, { useEffect } from 'react'
import {
    Grid, List,
} from 'semantic-ui-react'

import TimeStampsListItem from './TimeStampsListItem'

const TimeStampsList = ({timestamps}) => {

    useEffect( () => {
        
    }, [timestamps])

    return (<List divided relaxed className={ 'panel padding-16' }>
        <h3>TimeStamps</h3>
        {
            timestamps.map((stamp, index) => (
                <TimeStampsListItem key={index} stamp={stamp} />
            ))
        }
    </List>)

}

export default TimeStampsList