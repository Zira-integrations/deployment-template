

async function buildEvents({ resolveVariable }) {
    try {
        const methods = {}
        const config = await resolveVariable('self:custom.context')
        const stage = await resolveVariable('self:provider.stage');
        const region = await resolveVariable('self:provider.region');
        const service = await resolveVariable('self:service');
        const accountId = await resolveVariable('self:custom.accountId');
        const resources = config.reduce((acc, configItem, index) => {
            if (!configItem.adapter || !configItem.apiPrefix) return acc
            
            const newResource = {
              [configItem.adapter]: {
                "Type": "AWS::ApiGateway::Resource",
                "DependsOn": ["ApiGatewayRestApi"],
                "Properties": {
                  "RestApiId": {
                    "Ref": "ApiGatewayRestApi"
                  },
                  "ParentId": {
                    "Fn::GetAtt": ["ApiGatewayRestApi", "RootResourceId"]
                  },
                  "PathPart": `${configItem.adapter}`
                }
              }
            }
            
            for(const i in configItem.methods){
              methods[configItem.adapter+configItem.methods[i]+'Method'] =
              {
                "Type": "AWS::ApiGateway::Method",
                "DependsOn": ["ApiGatewayRestApi", configItem.adapter],
                "Properties": {
                  "ApiKeyRequired": true,
                  "AuthorizationType": "NONE",
                  "HttpMethod": configItem.methods[i],
                  "ResourceId": {
                    "Ref": configItem.adapter
                  },
                  "RestApiId": {
                    "Ref": "ApiGatewayRestApi"
                  },
                  "Integration": {
                    "Type": "AWS_PROXY",
                    "IntegrationHttpMethod": configItem.methods[i],
                    "Uri": {
                      "Fn::Sub": [
                        `arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/arn:aws:lambda:${region}:${accountId}:function:${configItem.adapter}/invocations`,
                        {
                          "REGION": region,
                          "FUNCTION": `${service}-${stage}-${configItem.adapter}`
                        }
                      ]
                    }
                  }
                }
              }
            }
            const newApiKey = {
              [configItem.adapter+"ApiKey"]: {
                "Type": "AWS::ApiGateway::ApiKey",
                "DependsOn": [
                  "ApiGatewayDeployment"
                ],
                "Properties": {
                  "Name": `${service}-${configItem.adapter}`,
                  "Description": `${service} - ${configItem.adapter} adapter`,
                  "Enabled": true,
                  "StageKeys": [
                    {
                      "RestApiId": {
                          "Ref": "ApiGatewayRestApi"
                      },
                      "StageName": {
                        "Ref": "ApiGatewayStage"
                      }
                    }
                  ]
                }
              }
            }
            const newUsagePlanKey = {
              [configItem.adapter+"UsagePlanKey"]: {
                "DependsOn": ["ApiGatewayUsagePlan"],
                "Type": "AWS::ApiGateway::UsagePlanKey",
                "Properties": {
                  "KeyId": {
                    "Ref": `${configItem.adapter}ApiKey`
                  },
                  "KeyType": "API_KEY",
                  "UsagePlanId": {
                    "Ref": "ApiGatewayUsagePlan"
                  }
                }
              }
            }

            return { ...acc, ...newResource, ...methods, ...newApiKey, ...newUsagePlanKey}
        }, {})
        const extraResources = {
          "ApiGatewayRestApi" : {
            "Type": "AWS::ApiGateway::RestApi",
            "Properties": {
              "Name": `${stage}-${service}`,
              "ApiKeySourceType": "HEADER"
            }
          },
          "ApiGatewayBasePath": {
            "Type": "AWS::ApiGateway::BasePathMapping",
            "DependsOn": ["ApiGatewayRestApi"],
            "Properties": {
              "BasePath": service,
              "DomainName": `${stage == 'dev' ? 'dev.' : ''}int.zira.us`,
              "RestApiId": {
                "Ref": "ApiGatewayRestApi"
              },
              "Stage": {
                "Ref": "ApiGatewayStage"
              }
            }
          },
          "ApiGatewayDeployment": {
            "Type": "AWS::ApiGateway::Deployment",
            "Properties": {
              "RestApiId": {
                "Ref": "ApiGatewayRestApi"
              }
            },
            "DependsOn": Object.keys(methods)
          },
          "ApiGatewayStage": {
            "Type": "AWS::ApiGateway::Stage",
            "DependsOn": [
              "ApiGatewayRestApi",
              "ApiGatewayDeployment"
            ],
            "Properties": {
              "StageName": stage,
              "RestApiId": {
                "Ref": "ApiGatewayRestApi"
              },
              "DeploymentId": {
                "Ref": "ApiGatewayDeployment"
              }
            }
          },
          "ApiGatewayUsagePlan": {
            "Type": "AWS::ApiGateway::UsagePlan",
            "Properties": {
              "ApiStages": [
                  {
                    "ApiId": {
                      "Ref": "ApiGatewayRestApi"
                    },
                    "Stage": {
                      "Ref": "ApiGatewayStage"
                    }
                  }
              ],
              "Description": `${service} ${stage} usage plan`,
              "Quota": {
                  "Limit": 10000,
                  "Period": "MONTH"
              },
              "Throttle": {
                  "BurstLimit": 200,
                  "RateLimit": 100
              },
              "UsagePlanName": `${service}-${stage}`
            }
          }
        }
      
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
