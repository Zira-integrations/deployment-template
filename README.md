# Zira Deployment Template

This example project contains the configuration and code examples to deploy email or SFTP integration




# How it works?

By cloning this repo and changing couple of variables, developers can safely deploy below resources:
- Mailbox with designated email address
- S3 bucket with specified data prefix
- Lambda function that run your custom parsing and data-manipulation code

# Data flow

[![](https://mermaid.ink/img/pako:eNoljrEOgzAMRH8l8lymbgyVShmpVJUxYXATAxEkQcEZKsS_N4WbrCfr7m2ggyEoYYi4jKJ5Ky9y7pIc2rkTRXETlWyvokp6Ij7BQzboPgZFn7xmG_yBa_kKK4tIaKwf1u7fpDxcwFHMZSaPbAcDHsmRgjKfBuOkQPk9_2Hi0H69hpJjogukxSBTbTG7OSh7nNdMyVgO8XlaH_L7DzECQF4?type=png)](https://mermaid.live/edit#pako:eNoljrEOgzAMRH8l8lymbgyVShmpVJUxYXATAxEkQcEZKsS_N4WbrCfr7m2ggyEoYYi4jKJ5Ky9y7pIc2rkTRXETlWyvokp6Ij7BQzboPgZFn7xmG_yBa_kKK4tIaKwf1u7fpDxcwFHMZSaPbAcDHsmRgjKfBuOkQPk9_2Hi0H69hpJjogukxSBTbTG7OSh7nNdMyVgO8XlaH_L7DzECQF4)

Emails sent to the designated email address will automatically saved under s3 with specified data prefix and then trigger custom lambda function

# Set up

## Step 1:  Create new repo based on this example
Clone this repo or click the "use this template" button. We recommend to use the company name as repository name as a best practice

## Step 2:  Change a package name a service name in `package.json` and change a service name in `serverless.json`
Go to `package.json` and change package name according to a repo name. <br />
Then go to `serverless.json` and change  a service name according to a repo name. <br />
They might be the same. <br />
Run `npm i` to install packages

## Step 3:  modify `config/context.json`


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
### Best Practices:
- s3Prefix: Site/UploadType (ex. CypressGrove/Emails)
- emailPrefix: Site (ex. cypressgrove)



| Option        | Required | Description                                                            |
|---------------|----------|------------------------------------------------------------------------|
| `s3Prefix`     | true     | Every file uploaded with this prefix will trigger the adapter function   |
| `adapter`     | true     | The name of the adapter function under `adapters` folder               |
| `emailPrefix`  | false    | Will create a mailbox with this prefix under @int.zira.us domain        |


You can define multiple adapters under the same project in order to serve multiple sites or multiple kinds of integrations


## Step 4:  Write your adapters

Adapters are the functions under `/adapters` folder.
Adapter functions responsible to transform the payload of incoming files or emails in order to post the data to zira data-source

Example:

``` javascript
import middy from '@middy/core'
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
    .use(parseEmail())

```

The above example will print the content of csv file attachment of any incoming email sent to the email specified on `context.json`

# Secrets file

Use `secrets.json` file for storing secret information.
`secrets.json` is your local  file that doesn't go to git repo next to other  code
It locates in config folder. Is is a  just JSON object with keys and values.
To get to your secret key use `process.env.YOUR_SECRET_KEY`

Example:

`secrets.json`
```
{
    "API_KEY": "207a93d6-1cef-5de9-af9a-aef35f6svdfsce",
    "DEVICE_ID": "1234"
}
```

`adapter.ts`
``` javascript
const readingData = [{
        meterId: process.env.DEVICE_ID,
        values: adaptedValues
    }]

await got.post('https://api.zira.us/public/reading/ids/', { json: readingData, headers: { 'x-api-key': process.env.API_KEY } }).json()
```

# Usage zira-public API

Use for api call a library called `got`(full spec is here https://github.com/sindresorhus/got)
Example:
``` javascript
import got from 'got'

 const response = await got.post('https://api.zira.us/public/reading/ids/', {
             json: readingData, headers: { 'x-api-key': process.env.API_KEY}
       }).json()
```

# Deployment

prerequisites:
1. Make sure that you have IM User with Admin Access
2. Set AWS Access key and secret:

```
$ aws configure
AWS Access Key ID [None]: <ACCESS_KEY>
AWS Secret Access Key [None]: <ACCESS_KEY_SECRET>
Default region name [None]: <REGION>
Default output format [None]: json
```

Deployment using CLI:
* dev stage: `npm run deploy`
