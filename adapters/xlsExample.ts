import parseEmail from '@zira_integration/common/lib/parseEmail'
import middy from '@middy/core'
import readXls from '@zira_integration/common/lib/readXls'
import got from 'got'

export const xlsExample = async (event: any, context): Promise<void> => {
    const xlsFile = event.email?.attachments[0]
    console.log('contentType: ', xlsFile?.contentType)

    const parsedXls: any = readXls(xlsFile.content)
    console.log('parsedXls file', JSON.stringify(parsedXls))

    // some preparing to post

    const adaptedValues = parsedXls?.[0]?.data?.[0].map((metricId, i) => ({ metricId: String(metricId), value: parsedXls?.[0]?.data?.[1][i] }))
    const readingData = [{
        meterId: process.env.DEVICE_ID,
        values: adaptedValues
    }]

    // post reading
    try {
        const response = await got.post('https://api.zira.us/public/reading/ids/', {
             json: readingData, headers: { 'x-api-key': process.env.API_KEY 
        } }).json()
        console.log('response', JSON.stringify(response))

    } catch (error) {
        console.error(error)
    }
    
}

export const handler = middy(xlsExample)
    .use(parseEmail())
