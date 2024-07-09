const extraResources = {}

async function buildEvents({ resolveVariable }) {
  try {
    const config = await resolveVariable('self:custom.context')
    const stage = await resolveVariable('self:provider.stage')

    const resources = config.reduce((acc, configItem, index) => {
      if (configItem.adapter && configItem.s3Prefix) {
        const capitalizedLambdaName =
          configItem.adapter.charAt(0).toUpperCase() +
          configItem.adapter.slice(1)
        const lambdaResource = `${capitalizedLambdaName}LambdaFunction`
        const newResource = {
          [capitalizedLambdaName + 'EventRule']: {
            Type: 'AWS::Events::Rule',
            Properties: {
              Description: 'Catches S3 ObjectCreated events',
              State: 'ENABLED',
              EventPattern: {
                'detail-type': ['Object Created'],
                source: ['aws.s3'],
                detail: {
                  bucket: {
                    name: [`integrations-data-zira-${stage}`]
                  },
                  object: {
                    key: [
                      {
                        prefix: configItem.s3Prefix
                      }
                    ]
                  }
                }
              },
              Targets: [
                {
                  Id: lambdaResource + 'Target',
                  Arn: {
                    'Fn::GetAtt': [lambdaResource, 'Arn']
                  }
                }
              ]
            }
          }
        }
        return { ...acc, ...newResource }
      } else if (configItem.adapter && configItem.schedulerPrefix) {
        const capitalizedLambdaName =
          configItem.adapter.charAt(0).toUpperCase() +
          configItem.adapter.slice(1)
        const lambdaResource = `${capitalizedLambdaName}LambdaFunction`
        const newResource = {
          [capitalizedLambdaName + 'EventRule']: {
            Type: 'AWS::Events::Rule',
            Properties: {
              Name: `${configItem.schedulerPrefix}`,
              Description: 'Cron Scheduler',
              ScheduleExpression: configItem.schedule,
              State: 'ENABLED',
              EventPattern: {
                source: ['aws.events'],
                'detail-type': ['Scheduled Event'],
                detail: {
                  name: [`${configItem.schedulerPrefix}`]
                }
              },
              Targets: [
                {
                  Id: lambdaResource + 'Target',
                  Arn: {
                    'Fn::GetAtt': [lambdaResource, 'Arn']
                  }
                }
              ]
            }
          }
        }
        return { ...acc, ...newResource }
      } else return acc
    }, {})

    return {
      Resources: {
        ...resources,
        ...extraResources
      }
    }
  } catch (err) {
    console.error(err)
  }
}

module.exports = buildEvents
