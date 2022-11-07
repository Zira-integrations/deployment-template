
function mergeObjs(){
    const cwd = process.cwd()
    let localEnvs = {}, globalEnvs = {}, vaultEnvs = {}

    try{
        localEnvs = require('./environment.json')
    } catch(err){
        console.info('no local roles file')
    }
    try{
        globalEnvs = require('./environment.json')
    } catch(err){
        console.info('no global roles file')
    }
    try{
        vaultEnvs = require('./secrets.json')
    } catch(err){
        console.info('no vault roles file')
    }
    if(vaultEnvs.SECRETS_JSON){
        vaultEnvs.SECRETS_JSON = JSON.stringify(vaultEnvs.SECRETS_JSON)
    }
	 
    if(globalEnvs && localEnvs && vaultEnvs){
        return { ...globalEnvs, ...localEnvs, ...vaultEnvs }
    } else{
        return []
    }
}

module.exports = mergeObjs