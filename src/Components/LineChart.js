import React, { useState, useEffect } from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import {Line} from 'react-chartjs-2'
import { randColor } from '../Helpers/RandColor'
import { groupByDate } from '../Helpers/TimeStampReducers'

const GET_TIMESTAMPS = gql`
  query GET_TIMESTAMPS {
    TimeStamp(order_by: {StartTime: asc, EndTime: desc_nulls_first}, where: {EndTime: {_is_null: false}}){
        StartTime
        EndTime
        parentTask{ 
            id
            Name 
        }
        parentProject{
            id
            Name
        }
    }
  }
`;

export const LineChart = () => {
    const [chartData, setChartData] = useState()
    const { loading, data } = useQuery(GET_TIMESTAMPS)

    const chart = () => {
        const byDate = groupByDate( data.TimeStamp, 'StartTime' )
        const labels = Object.entries( byDate ).map(s => s[0] )
        const d = Object.entries( byDate ).map(s => s[1].totalTime / 1000 / 60 / 60  )
        
        setChartData({
            labels: labels,
            datasets: [
                {
                    label: 'All Projects', 
                    data: d, 
                    backgroundColor: ['rgb(0,0,0,0.0)'], 
                    borderColor: [randColor()],
                    borderWidth: 2
                }
            ]
        })   
    }

    useEffect(() => {
        if(data){ chart() }
    }, [data])

    return(
        <div>
            <Line data={chartData} />
        </div>
    )
}