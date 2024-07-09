const extraResources = {}

async function buildLambdas({ resolveVariable }) {
  try {
    const config = await resolveVariable('self:custom.context')
    const region = await resolveVariable('self:provider.region')
    const stage = await resolveVariable('self:provider.stage')
    const service = await resolveVariable('self:service')
    const accountId = await resolveVariable('self:custom.accountId')

    const resources = config.reduce((acc, configItem, index) => {
      if (!configItem.adapter) return acc
      const capitalizedLambdaName =
        configItem.adapter.charAt(0).toUpperCase() + configItem.adapter.slice(1)
      const lambdaResource = `${capitalizedLambdaName}LambdaFunction`
      const permissions = {
        [capitalizedLambdaName + 'EventsLambdaPermission']: {
          Type: 'AWS::Lambda::Permission',
          DependsOn: [lambdaResource],
          Properties: {
            Principal: 'events.amazonaws.com',
            FunctionName: {
              'Fn::Sub': [
                'arn:aws:lambda:${REGION}:${ACCOUNT}:function:${FUNCTION}',
                {
                  ACCOUNT: accountId,
                  REGION: region,
                  FUNCTION: `${service}-${stage}-${configItem.adapter}`,
                },
              ],
            },
            Action: 'lambda:InvokeFunction',
          },
        },
      }
      if (configItem.apiPrefix) {
        permissions[capitalizedLambdaName + 'ApiGatewayLambdaPermission'] = {
          Type: 'AWS::Lambda::Permission',
          DependsOn: [lambdaResource],
          Properties: {
            Principal: 'apigateway.amazonaws.com',
            FunctionName: {
              'Fn::Sub': [
                'arn:aws:lambda:${REGION}:${ACCOUNT}:function:${FUNCTION}',
                {
                  ACCOUNT: accountId,
                  REGION: region,
                  FUNCTION: `${service}-${stage}-${configItem.adapter}`,
                },
              ],
            },
            Action: 'lambda:InvokeFunction',
          },
        }
      }
      return { ...acc, ...permissions }
    }, {})

    return {
      Resources: {
        ...resources,
        ...extraResources,
      },
    }
  } catch (err) {
    console.error(err)
  }
}

module.exports = buildLambdas
