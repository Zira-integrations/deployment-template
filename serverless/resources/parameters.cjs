async function buildParameters({ resolveVariable }) {
  try {
        const config = await resolveVariable('self:custom.context')

        const parameters = config.reduce((acc, configItem, index) => {
            if (!configItem.parameters) return acc

            const newParameters = configItem.parameters
            return { ...acc, ...newParameters }
        }, {})

        return {
            Parameters: {
                ...parameters
            }
        }
    } catch(e){
        console.error(e)
    }
}

module.exports = buildParameters