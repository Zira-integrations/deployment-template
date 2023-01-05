import middy from '@middy/core'
import parseEmail from '@zira_integration/common/lib/parseEmail'
import readCsv from '@zira_integration/common/lib/readCsv'

export const csvExample = async (event: any): Promise<void> => {
    console.log('event', JSON.stringify(event))

    const csvFile = event.email?.attachments[0]
    console.log('contentType is: ', csvFile?.contentType)
    console.log('readCsv: ',readCsv?.toString())

    if (csvFile?.contentType === 'text/csv') {
        const data = await readCsv(csvFile.content)
        console.log('Parsed : ',data)
    }
}

export const handler = middy(csvExample)
    .use(parseEmail())
