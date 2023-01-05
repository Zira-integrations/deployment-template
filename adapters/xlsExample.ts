import parseEmail from '@zira_integration/common/lib/parseEmail'
import middy from '@middy/core'
import readXls from '@zira_integration/common/lib/readXls'

export const xlsExample = async (event: any, context): Promise<void> => {
    const xlsFile = event.email?.attachments[0]
    console.log('contentType: ', xlsFile?.contentType)

    const parsedXls: any = readXls(xlsFile.content)
    console.log('parsedXls file', JSON.stringify(parsedXls))
    
}

export const handler = middy(xlsExample)
    .use(parseEmail())
