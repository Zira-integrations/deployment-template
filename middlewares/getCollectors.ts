import middy, { MiddlewareObj } from '@middy/core'
import got, { HTTPError, OptionsOfTextResponseBody } from 'got'

let collectionEndpoints: any
let config: any = {
    destinations: [
        {
            apiKey: '2f6ace0c-e460-45d2-a417-e9fc1e5ff677',
            baseURL: `https://${process.env.ENV_NAME}.api.lightapp.com`,
            dataSourcesURL: `/public/data-sources`,
            collectors: {
                id: 15,
                url: "/collectors/15"
            },
            endpointsIds: []
        }
    ]
}

const getCollectors = (): MiddlewareObj=> {
    return ({
        before: async (handler: any): Promise<void> => {
            if(!collectionEndpoints){
                for(let ind in config.destinations){
                    const options: OptionsOfTextResponseBody | undefined = {
                        headers: {
                            'x-api-key': config.destinations[ind].apiKey
                        },
                        searchParams: {}
                    }
                    // Getting endpoints for current collector (although its ID is the same 15 - custom collector, the difference is the API key that represent a different collector each time)
                    const endpointsRes: any = await got.get(config.destinations[ind].baseURL + config.destinations[ind].collectors.url, options).json()
                    for(const endpoint of endpointsRes.data.endpoints) {
                        // Data sources composition (for each endpoint there are data sources)
                        let dataSources: any[] = []
                        collectionEndpoints[String(endpoint.id)] = endpoint
                        config.destinations[ind].endpointsIds.push(endpoint.id)
                        let searchParams = { endpointDeviceIds: endpointsRes.data.endpoints }
                        while (endpointsRes && endpointsRes?.data && searchParams['lastValue'] != null) {
                            let dataSourcesRes: any
                            try{
                                dataSourcesRes = await got.get(config.destinations[ind].baseURL + config.destinations[ind].dataSourcesURL, {...options, searchParams}).json()
                                if(dataSourcesRes && dataSourcesRes.data){
                                    searchParams['lastValue'] = dataSourcesRes?.lastValue ? dataSourcesRes.lastValue : null
                                    const enabledDataSources: any[] =  dataSourcesRes.data.filter((meter: any)=> meter.collectionEnabled)
                                    dataSources.push(...enabledDataSources)
                                }
                                else {
                                    throw dataSourcesRes
                                }
                            }
                            catch (error: any) {
                                const httpError: HTTPError = error
                                if (httpError?.code && httpError?.message) {
                                    console.error(httpError)
                                }
                                else{
                                    console.error(error)
                                    break;
                                }
                            }
                        }
                        collectionEndpoints[String(endpoint.id)].dataSources = dataSources
                    }
                }
            }
        }
    })
}