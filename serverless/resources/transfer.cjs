async function buildTransferUsers({ resolveVariable }) {
  try {
    const config = await resolveVariable('self:custom.context')
    const stage = await resolveVariable('self:provider.stage')
    const resources = config.reduce((acc, configItem, index) => {
      if (!configItem.adapter || !configItem.sftp || !configItem.s3Prefix) return acc
      const newResource = {
        ['TransferUser']: {
          Type: 'AWS::Transfer::User',
          Properties: {
            "ServerId": { "Fn::GetAtt": ["TransferServer", "ServerId"] },
            "UserName": { "Ref": "SiteName" },
            "Role": { "Fn::GetAtt": ["TransferUserRole", "Arn"] },
            "HomeDirectoryType": "LOGICAL",
            "HomeDirectoryMappings": [
            {
                "Entry": "/",
                "Target": { "Fn::Sub": "/${S3BucketNamePrefix}-"+stage+"/"+configItem.s3Prefix }
            }
            ],
            "SshPublicKeys": [
                { "Ref": "SFTPPublicKey" }
            ],
            "Tags": [
                { "Key": "Site", "Value": { "Ref": "SiteName" } }
            ]
          }
        }
    }
    return { ...acc, ...newResource }
    }, {})

    return {
      Resources: {
        ...resources
      }
    }
  } catch (err) {
    console.error(err)
  }
}

module.exports = buildTransferUsers