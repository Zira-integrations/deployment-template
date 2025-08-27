async function buildIAMRoles({ resolveVariable }) {
  try {
    const config = await resolveVariable('self:custom.context')
    const stage = await resolveVariable('self:provider.stage')
    const resources = config.reduce((acc, configItem, index) => {
      if (!configItem.adapter || !configItem.sftp || !configItem.s3Prefix) return acc
      const newResource = {
        ['TransferUserRole']: {
          Type: 'AWS::IAM::Role',
          Properties: {
                "RoleName": { "Fn::Sub": "transfer-s3-access-${AWS::StackName}" },
                "AssumeRolePolicyDocument": {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": { "Service": "transfer.amazonaws.com" },
                        "Action": "sts:AssumeRole"
                    }
                ]
                },
                "Policies": [
                    {
                        "PolicyName": "transfer-user-s3-scoped",
                        "PolicyDocument": {
                            "Version": "2012-10-17",
                            "Statement": [
                                {
                                    "Sid": "AllowListBucketScoped",
                                    "Effect": "Allow",
                                    "Action": [
                                        "s3:ListBucket",
                                        "s3:GetBucketLocation"
                                    ],
                                    "Resource": { "Fn::Sub": "arn:aws:s3:::${S3BucketNamePrefix}-"+stage },
                                    "Condition": {
                                        "StringLike": {
                                        "s3:prefix": [
                                            { "Fn::Sub": configItem.s3Prefix + "/*" },
                                            { "Fn::Sub": configItem.s3Prefix }
                                        ]
                                        }
                                    }
                                },
                                {
                                    "Sid": "RWObjectsScoped",
                                    "Effect": "Allow",
                                    "Action": [
                                        "s3:PutObject",
                                        "s3:GetObject",
                                        "s3:GetObjectTagging",
                                        "s3:DeleteObject",
                                        "s3:GetObjectVersion",
                                        "s3:DeleteObjectVersion"
                                    ],
                                    "Resource": { "Fn::Sub": "arn:aws:s3:::${S3BucketNamePrefix}-"+stage+"/" + configItem.s3Prefix + "/*" }
                                }
                            ]
                        }
                    }
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

module.exports = buildIAMRoles