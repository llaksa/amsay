'use strict'

module.exports = function setupAgent (AgentModel) {
    async function createOrUpdate (agent) {
        const cond = {
            where: {
                uuid: agent.uuid
            }
        }

        const existingAgent = await AgentModel.findOne(cond)

        if (existingAgent) {
            const updated = await AgentModel.update(agent, cond)
            return updated ? AgentModel.findOne(cond) : existingAgent
        }

        const result = await AgentModel.create(agent)
        return result.toJSON()
    }

    function findById (id) {
        return AgentModel.findById(id) // esto es como un wrapper, para mostrar solo las funciones que quiera
    }

    function findByUuid (uuid) {
        return AgentModel.findOne({ // findOne es método de sequelize, por eso necesita el where: ...
            where: {
                uuid // uuid: uuid 
            }
        })
    }

    function findAll () {
        return AgentModel.findAll()
    }

    function findConnected () {
        return AgentModel.findAll({ // findAll es método de sequelize, por eso necesita el where: ...
            where: {
                connected: true
            }
        })
    }

    function findByUsername (username) {
        return AgentModel.findAll({
            where: {
                username, // username: username
                coennected: true
            }
        })
    }

    return {
        createOrUpdate,
        findById,
        findByUuid,
        findAll,
        findConnected,
        findByUsername
    }
}