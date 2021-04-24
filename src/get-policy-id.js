const cardano = require("./cardano")
const mintScript = require("./mint-policy.json")

module.exports = () => {

    const policyId = cardano.transactionPolicyid(mintScript)

    return {
        policyId,
        mintScript
    }
}