
export const toHMS = (s) => {
    const h = Math.floor(s / 60 / 60)
    const m = Math.floor(s / 60 % 60)
    const S = Math.floor(s % 60 % 60)
    const leadingZero = (t) => t < 10 ? `0${t}` : `${t}`

    return `${leadingZero(h)}h  ${leadingZero(m)}m  ${leadingZero(S)}s`
}

export const groupByDate = (array, key) => {

    const g = {}
    
    array.forEach( t => {
        if( g[new Date(t[key]).toDateString()] ){
            g[new Date(t[key]).toDateString()].data.push(t)
            g[new Date(t[key]).toDateString()].totalTime += (new Date(t.EndTime) - new Date(t.StartTime))
        }
        else{
            g[new Date(t[key]).toDateString()] = {
                data: [t],
                totalTime: new Date(t.EndTime) - new Date(t.StartTime)
            }
        }
    })

    return g
} 

export const groupByYear = (array, key) => {

    const g = {}
    
    array.forEach( t => {
    
        if( g[new Date(t[key]).getFullYear()] ){
            g[new Date(t[key]).getFullYear()].data.push(t)
            g[new Date(t[key]).getFullYear()].totalTime += (new Date(t.EndTime) - new Date(t.StartTime))
        }
        else{
        
            g[new Date(t[key]).getFullYear()] = {
                data: [t],
                totalTime: new Date(t.EndTime) - new Date(t.StartTime)
            }
        
        }
    })

    return g
}

export const groupByMonth = (array, key) => {

    const g = {}
    
    array.forEach( t => {
    
        if( g[new Date(t[key]).getMonth()] ){
            g[new Date(t[key]).getMonth()].data.push(t)
            g[new Date(t[key]).getMonth()].totalTime += (new Date(t.EndTime) - new Date(t.StartTime))
        }
        else{
        
            g[new Date(t[key]).getMonth()] = {
                data: [t],
                totalTime: new Date(t.EndTime) - new Date(t.StartTime)
            }
        
        }
    })

    return g
} 


export const combineProjectsTimeStamps = P => {
    const ts = []
    P.map( p => ts.push(...p.TimeStamps) )
    return ts
}