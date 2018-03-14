'use strict'

const test = require('ava') // Un test runner: para crear pruebas unitarias
const sinon = require('sinon')
const proxyquire = require('proxyquire') // nos permite sobrescribir las funciones obtenidas con require('some-library'), es decir, sobreescribir los modelos para poder hacer las pruebas

const metricFixture = require('./fixtures/metric')
const agentFixture = require('./fixtures/agent') // solo lo usaremos para obtener los datos del agent con el valor de "agentId"

// definiendo un archivo de configuración por defecto
// el cuál no quiero que haga una conexión real a la base de datos
// por lo que se va a utilizar una base de datos de prueba, almacenada en memoria como sqlite
let config = {
    logging: sinon.spy() // deshabilitando loggin porque para la prueba no queremos ni siquiera usar logging
}

let AgentStub = {
    hasMany: sinon.spy()
}

let id = 2
let type = 'typeb'
let agentId = 2
let uuid = agentFixture.byId(agentId).uuid
let MetricStub = null // inicializar objeto fake para proxyquire. Como estamos provando varios métodos del agente vamos a querer tener un valor fresco, por lo que el objeto fake Agent se debe crear dentro del beforeEach()
let db = null // dándole un scope global a la variable db
let sandbox = null

let single = Object.assign({}, metricFixture.single) // Para tener una instancia "single", distinta o aparte de la que proporciona agentFixture

let oneArgs = {
    where: {
        uuid
    }
}

let typeAgentUuidArgs = {
    attributes: [ 'id', 'type', 'value', 'createdAt' ],
    where: {
        type
    },
    limit: 20,
    order: [[ 'createdAt', 'DESC' ]],
    include: [{
        attributes: [],
        model: AgentStub,
        where: {
            uuid
        }
    }],
    raw: true
}

let agentUuidArgs = {
    attributes: [ 'type' ],
    group: [ 'type' ],
    include: [{
        attributes: [],
        model: AgentStub,
        where: {
            uuid
        }
    }],
    raw: true
}

let newMetric = {
    type: 'CPU',
    value: '18%',
    agentId: 2
}

test.beforeEach(async () => {
    // con proxyquire:
    sandbox = sinon.sandbox.create()
    
    MetricStub = {
        belongsTo: sandbox.spy()
    }   

    // Model findAll Stub
    MetricStub.findAll = sandbox.stub()
    MetricStub.findAll.withArgs().returns(Promise.resolve(metricFixture.all))
    MetricStub.findAll.withArgs(agentUuidArgs).returns(Promise.resolve(metricFixture.byAgentUuid(uuid)))
    MetricStub.findAll.withArgs(typeAgentUuidArgs).returns(Promise.resolve(metricFixture.byTypeAgentUuid(type, uuid)))
    
    // Model create Stub
    AgentStub.findOne = sandbox.stub()
    AgentStub.findOne.withArgs(oneArgs).returns(Promise.resolve(agentFixture.byUuid(uuid)))

    MetricStub.create = sandbox.stub()
    MetricStub.create.withArgs(newMetric).returns(Promise.resolve({
        toJSON () { return newMetric }
    }))
    
    const setupDatabase = proxyquire('../', { // cuando se llame a '../index.js' , jala la función "db", etc, se envía una variable "config", además:
        './models/agent': () => AgentStub, // en lugar de devolver la función exportada de agent.js, devuelve el objeto AgentStub
        './models/metric': () => MetricStub // en lugar de devolver la función exportada de metric.js, devuelve el objeto MetricStub
    })

    db = await setupDatabase(config)
})

test.afterEach(t => {
    sandbox && sinon.sandbox.restore()
})

test('Metric', t => {
    t.truthy(db.Metric, 'Metric service should exists') // que lo de dentro del paréntesis resuelve a verdadero
})

test.serial('Setup', t => {
    t.true(AgentStub.hasMany.called, 'AgentModel.hasMany was executed')
    t.true(AgentStub.hasMany.calledWith(MetricStub), 'Argument shoudl be the MetricModel')
    t.true(MetricStub.belongsTo.called, 'MetricModel.belongsTo was executed')
    t.true(MetricStub.belongsTo.calledWith(AgentStub), 'Argument should be the AgentModel')
})

test.serial('Metric#findByAgentUuid', async t => {
    let metric = await db.Metric.findByAgentUuid(uuid)

    t.true(MetricStub.findAll.called, 'findAll should be called on model')
    t.true(MetricStub.findAll.calledOnce, 'findAll should be called once')
    t.true(MetricStub.findAll.calledWith(agentUuidArgs), 'findAll should be called with specified id')

    t.deepEqual(metric, metricFixture.byAgentUuid(uuid), 'metric should be the same')
})

test.serial('Metric#findByTypeAgentUuid', async t => {
    let metric = await db.Metric.findByTypeAgentUuid(type, uuid)

    t.true(MetricStub.findAll.called, 'findAll should be called on model')
    t.true(MetricStub.findAll.calledOnce, 'findAll should be called once')
    t.true(MetricStub.findAll.calledWith(typeAgentUuidArgs), 'findAll should be called with specified single')

    t.deepEqual(metric, metricFixture.byTypeAgentUuid(type, uuid), 'metric should be the same')
})

test.serial('Metric#create', async t => {
    let metric = await db.Metric.create(uuid, newMetric)

    t.true(AgentStub.findOne.called, 'findOne should be called on model')
    t.true(AgentStub.findOne.calledOnce, 'findOne should be called once')
    t.true(AgentStub.findOne.calledWith(oneArgs), 'findOne should be called with specified single')

    t.true(MetricStub.create.called, 'create should be called on model')
    t.true(MetricStub.create.calledOnce, 'create should be called once')
    t.true(MetricStub.create.calledWith(newMetric), 'create should be called with specified single')

    t.deepEqual(metric, newMetric, 'metric should be the same')
})