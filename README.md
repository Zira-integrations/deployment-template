# Integration template
This example project contain the configuration and code-examples in order to deploy email or sftp integration (Muli will complete)

# Architecture and data flow (Muli add image)

# How to use?

1.  Create new repo based on Sandbox
* Create new repo in githab usinng as template https://github.com/Zira-integrations/sandbox
* Rename 

2. modify context.json 

```

```


This file is a collection of adapters. Each object configures a corresponding adapter. This object includes: 
* `prefix` (Required). Coming files with this prefix will trigger a corresponding adapter.
* `lambdaName` (Required). A file name of adapter funnction without extension (e.g. lambdaName for adapter.ts is adapter).
* `email` (Optional). An email address from which all emails will be sent to the appropriate folder (prefix) in S3. Must have doamin int.zira.us
* `apiKey` (Optional). An api key that will be passed into an adapter function


# Creation new adapters
* Create a new function in functions using adapter.ts as template
* Add a new config object into contextConfig.json file




# Deployment 
* dev stage: `npx npm run deploy-dev`
* prod stage `npx npm run deploy-prod`

# AWS services
* S3 bucket: integrations-data-zira-${stage}
