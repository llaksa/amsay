'use strict'

const db = require('../') // index.js

async function run () {
    const config = {
        database: process.env.DB_NAME || 'platziverse',
        username: process.env.DB_USER || 'platzi',
        password: process.env.DB_PASS || 'platzi',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres'
    }

    const { Agent, Metric } = await db(config).catch(handleFatalError)

    const agent = await Agent.createOrUpdate({
        uuid: 'yyy',
        name: 'test',
        username: 'test',
        hostname: 'test',
        pid: 1,
        connected: true
    }).catch(handleFatalError)

    console.log('--agent--')
    console.log(agent)

    const agents = await Agent.findAll().catch(handleFatalError)
    console.log('--agents--')
    console.log(agents)

    const metricsAU = await Metric.findByAgentUuid(agent.uuid).catch(handleFatalError)
    console.log('--metricsAU--')
    console.log(metricsAU)

    const metric = await Metric.create(agent.uuid, {
        type: 'memory',
        value: '300'
    }).catch(handleFatalError)
    console.log('--metric--')
    console.log(metric)

    const metricsTAU = await Metric.findByTypeAgentUuid('memory', agent.uuid).catch(handleFatalError)
    console.log('--metricsTAU--')
    console.log(metricsTAU)
}

function handleFatalError (err) {
    console.error(err.message)
    console.error(err.stack)
    process.exit(1)
}

run()