import React, { useRef, useEffect, useState } from 'react';
import { select, min, max, scaleTime, line, bar, scaleLinear, axisBottom, axisRight, curveCardinal, curveLinear, brushX, timeDay, timeHour, event, timeMonth } from 'd3';
import { useResizeObserver } from '../../Helpers/UseResizeObserver';
import { Input } from 'semantic-ui-react'
import styles from './SingleTimeline.module.css'

export const SingleTimeline = ({ data }) => {
    const svgRef = useRef()
    const wrapperRef = useRef()
    const dimensions = useResizeObserver(wrapperRef)

    const [datesFilter, setDatesFilter] = useState([
        new Date(Date.now() - (1000 * 60 * 60 * 24 * 7)).toLocaleDateString('en-CA'),
        new Date(Date.now() + (1000 * 60 * 60 * 24 * 1)).toLocaleDateString('en-CA')
    ])

    const [highlight, setHighlight] = useState();
    const unique = (value, index, self) => {
      return self.indexOf(value) === index
    }
    
    const uniqueProjects = data.map( ts => ts.parentProject.Name ).filter(unique);

    useEffect(() => {
        data.sort((a, b) => new Date(a.StartTime) - new Date(b.StartTime))
        data = data.filter( d => new Date(d.StartTime) > new Date(datesFilter[0]) && new Date(d.StartTime) < new Date(datesFilter[1]) )

        const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect();

        const svg = select(svgRef.current)
        if (!dimensions) return;

        const minDate = min(data, stamp => new Date(stamp.StartTime))
        const maxDate = max(data, stamp => new Date(stamp.StartTime))

        const xScale = scaleTime()
            .domain([minDate, maxDate])
            .range([0, dimensions.width - 24])

        const minTime = min(data, stamp => ((new Date(stamp.EndTime) - new Date(stamp.StartTime)) / 1000 / 60))
        const maxTime = max(data, stamp => ((new Date(stamp.EndTime) - new Date(stamp.StartTime)) / 1000 / 60))

        const yScale = scaleLinear()
            .domain([maxTime, 0])
            .range([0, dimensions.height - 88])

        svg.selectAll('.dots')
            .data(data)
            .join('circle')
            .attr('class', 'dots')
            .attr('stroke', '#145b71')
            .attr('fill', 'blue')
            .attr('r', '.1em')
            .attr('cx', p => xScale(new Date(p.StartTime)))
            .attr('cy', p => yScale((new Date(p.EndTime) - new Date(p.StartTime)) / 1000 / 60))
            

        svg.selectAll('.project').data(data)
            .join('line')
            .attr('class', 'project')
            .attr('stroke', '#145b71')
            .attr('x1', p => xScale(new Date(p.StartTime)))
            .attr('y1', dimensions.height - 88 )
            .attr('x2', p => xScale(new Date(p.StartTime)))
            .attr('y2', p => yScale((new Date(p.EndTime) - new Date(p.StartTime)) / 1000 / 60))
            .attr('stroke-width', '1px')


        const xAxis = axisBottom(xScale)
            .ticks(timeMonth.every(1))

        svg.select(".x-axis")
            .style('transform', `translateY(${dimensions.height - 88 }px)`)
            .call(xAxis)

        const yAxis = axisRight(yScale)
        svg.select('.y-axis')
            .style('transform', `translateX(${dimensions.width - 24}px)`)
            .call(yAxis)


    }, [ data, dimensions, highlight, datesFilter ]);

    return (
        <React.Fragment>
            
            {
                datesFilter[0] >= datesFilter[1] ? 
                <div style={{ color: 'red', borderRadius: '8px', background: 'white', padding: '8px', marginTop: '8px', marginBottom: '8px' }}>
                    <span>End date must be greater than begin date.</span>
                </div> : null
            }

            {
              data == [] ? 
              <div style={{ color: 'red', borderRadius: '8px', background: 'white', padding: '8px', marginTop: '8px', marginBottom: '8px' }}>
                  <span>No projects data for this time period.</span>
              </div> : null  
            }
            
            <div ref={wrapperRef} style={{ paddingBottom: "4em" }} className={ 'inset margin-v-16 padding-16 ui ten wide' }>
                <div style={{ paddingBottom: '24px' }}>
                    <span>From </span><Input type="date" id="startDate" name="startDate" value={datesFilter[0]} onChange={e => setDatesFilter( [ e.target.value, datesFilter[1] ] )} />
                    <span> to </span><Input type="date" id="endDate" name="endDate" value={datesFilter[1]} onChange={e => {setDatesFilter( [ datesFilter[0], e.target.value ] ); console.log(data)}}/>     
                </div>
                <div>
                    <svg ref={svgRef} style={{ paddingBottom: '4em' }} className={ styles['overflow-visible'] }>
                        { data == [] ? <h1>No Data</h1> : null }
                        <g className="x-axis"></g>
                        <g className='y-axis'></g>
                        <g className='brush'></g>
                    </svg>    
                </div>
                
            </div>
        </React.Fragment>
        
    )
}

export default SingleTimeline;