# Zira Integration template

This example project contains the configuration and code examples to deploy email or SFTP integration





# How it works?

By cloning this repo and changing couple of variables changing configuration, developers can safely deploy below resources:
- Mailbox with designated email address
- S3 bucket with specified data prefix
- Lambda function that run your custom parsing and integration code  

# Data flow

[![](https://mermaid.ink/img/pako:eNoljrEOgzAMRH8l8lymbgyVShmpVJUxYXATAxEkQcEZKsS_N4WbrCfr7m2ggyEoYYi4jKJ5Ky9y7pIc2rkTRXETlWyvokp6Ij7BQzboPgZFn7xmG_yBa_kKK4tIaKwf1u7fpDxcwFHMZSaPbAcDHsmRgjKfBuOkQPk9_2Hi0H69hpJjogukxSBTbTG7OSh7nNdMyVgO8XlaH_L7DzECQF4?type=png)](https://mermaid.live/edit#pako:eNoljrEOgzAMRH8l8lymbgyVShmpVJUxYXATAxEkQcEZKsS_N4WbrCfr7m2ggyEoYYi4jKJ5Ky9y7pIc2rkTRXETlWyvokp6Ij7BQzboPgZFn7xmG_yBa_kKK4tIaKwf1u7fpDxcwFHMZSaPbAcDHsmRgjKfBuOkQPk9_2Hi0H69hpJjogukxSBTbTG7OSh7nNdMyVgO8XlaH_L7DzECQF4)

Emails sent to the designated email address will automatically saved under s3 with specified data prefix and then trigger custom lambda function

# Set up

## Step 1:  Create new repo based on this example 
clone this repo or by click the "use this template" button. We recommend to use the company name as repository name as a best practice

## Step 2:  modify `context.json` 
  

```
[
    {
        “s3Prefix”: "<S3_PREFIX>",
        “emailPrefix”: "<EMAIL_PREFIX>",
        “adapter”: "<ADAPTER_NAME>"
    },
        {
        “s3Prefix”: "<ANOTHER_S3_PREFIX>",
        “emailPrefix”: "<ANOTHER_EMAIL_PREFIX>",
        “adapter”: "<ANOTHER_ADAPTER_NAME>"
    },
    ...
]
```




| Option        | Required | Description                                                            |
|---------------|----------|------------------------------------------------------------------------|
| `prefix`      | true     | Every file uploaded with this prefix will trigger the adapter function |
| `adapter`     | true     | The name of the adapter function under `adapters` folder               |
| `emailPrefix` | false    | Will create a mailbox with this prefix @int.zira.us domain             |


You can define multiple adapters under the same project in order to serve multiple sites or multiple kinds of integrations 


## Step 3:  Write your adapters

Adapters are the functions under `/adapters` folder. 
adapter functions responsible to transform the payload of incoming files or emails in order to post the data to zira data-source

Example:

``` javascript
import middy from '@middy/core'
import httpHeaderNormalizer from '@middy/http-header-normalizer'
import parseEmail from '@lightapp-public/common/lib/parseEmail'
import readCsv from '@lightapp-public/common/lib/readCsv'

export const adapter = async (event: any): Promise<void> => {
    const csvFile = event.email?.attachments[0]
    if (csvFile?.contentType === 'text/csv') {
        const data = await readCsv(csvFile.content)
        console.log('Parsed : ',data)
        // your custom code here
    }
}

export const handler = middy(adapter)
    .use(httpHeaderNormalizer())
    .use(parseEmail())

```

the above example will print the content of csv file attachment of any incoming email sent to the email specified on `context.json`


# @lightapp-public/common

This npm package contains common functionality that can be used between repositories in order to be able to reuse functionality between companies and sites 

## `parseEmail`

This middleware will add email object to the adapter `event` argument

-   headers is an array of headers in the same order as found from the message (topmost headers first).
    -   headers[].key is lowercase key of the header line, eg. `"dkim-signature"`
    -   headers[].value is the unprocessed value of the header line
-   from, sender, replyTo includes a processed object for the corresponding headers
    -   from.name is decoded name (empty string if not set)
    -   from.address is the email address
-   deliveredTo, returnPath is the email address from the corresponding header
-   to, cc, bcc includes an array of processed objects for the corresponding headers
    -   to[].name is decoded name (empty string if not set)
    -   to[].address is the email address
-   subject is the email subject line
-   messageId, inReplyTo, references includes the value as found from the corresponding header without any processing
-   date is the email sending time formatted as an ISO date string (unless parsing failed and in this case the original value is used)
-   html is the HTML content of the message as a string
-   text is the plaintext content of the message as a string
-   attachments is an array that includes message attachments
    -   attachment[].filename is the file name if provided
    -   attachment[].mimeType is the MIME type of the attachment
    -   attachment[].disposition is either "attachment", "inline" or `null` if disposition was not provided
    -   attachment[].related is a boolean value that indicats if this attachment should be treated as embedded image
    -   attachment[].contentId is the ID from Content-ID header
    -   attachment[].content is an ArrayBuffer that contains the attachment file

## `readCsv`

This function returns the data of csv file 

## `readXls`

This function returns the data of xls file 


Deployment

`npx npm run deploy`


# Deployment 
* dev stage: `npx npm run deploy-dev`
* prod stage `npx npm run deploy-prod`


