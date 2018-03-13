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

let id = 1
let agentId = 2
let uuid = agentFixture.byId(agentId).uuid
let MetricStub = null // inicializar objeto fake para proxyquire. Como estamos provando varios métodos del agente vamos a querer tener un valor fresco, por lo que el objeto fake Agent se debe crear dentro del beforeEach()
let db = null // dándole un scope global a la variable db
let sandbox = null

let single = Object.assign({}, metricFixture.single) // Para tener una instancia "single", distinta o aparte de la que proporciona agentFixture

let typeArgs = {
    where: {
        type: 'findtype' 
    }
}

let valueArgs = {
    where: {
       value: '753'
    }
}

let newMetric = {
    type: 'worsttype',
    value: '789',
    AgentId: 1
}

test.beforeEach(async () => {
    // con proxyquire:
    sandbox = sinon.sandbox.create()
    
    MetricStub = {
        belongsTo: sandbox.spy()
    }   
   
    // Model create Stub
    AgentStub.findOne = sandbox.stub()
    AgentStub.findOne.withArgs(uuidArgs).returns(Promise.resolve(agentFixtures.byUuid(uuid)))

    MetricStub.create = sandbox.stub()
    MetricStub.create.withArgs(newMetric).returns(Promise.resolve({
        toJSON () { return newMetric }
    }))
    
    // Model findById Stub
    MetricStub.findById = sandbox.stub()
    MetricStub.findById.withArgs(id).returns(Promise.resolve(agentFixture.byId(id))) // sinon nos permite que someFunction.withArgs(X).returns(Y), si someFunction(X) devuelva Y 

    const setupDatabase = proxyquire('../', { // cuando se llame a '../index.js' , jala la función "db", etc, se envía una variable "config", además:
        './models/agent': () => AgentStub, // en lugar de devolver la función exportada de agent.js, devuelve el objeto AgentStub
        './models/metric': () => MetricStub // en lugar de devolver la función exportada de metric.js, devuelve el objeto MetricStub
    })

    db = await setupDatabase(config)
})

test.afterEach(t => {
    sandbox && sinon.sandbox.restore()
})

test('Agent', t => {
    t.truthy(db.Agent, 'Agent service should exists') // que lo de dentro del paréntesis resuelve a verdadero
})

test.serial('Setup', t => {
    t.true(AgentStub.hasMany.called, 'AgentModel.hasMany was executed')
    t.true(AgentStub.hasMany.calledWith(MetricStub), 'Argument shoudl be the MetricModel')
    t.true(MetricStub.belongsTo.called, 'MetricModel.belongsTo was executed')
    t.true(MetricStub.belongsTo.calledWith(AgentStub), 'Argument should be the AgentModel')
})

test.serial('Agent#findById', async t => {
    let agent = await db.Agent.findById(id)

    t.true(AgentStub.findById.called, 'findById should be called on model')
    t.true(AgentStub.findById.calledOnce, 'findById should be called once')
    t.true(AgentStub.findById.calledWith(id), 'findById should be called with specified id')

    t.deepEqual(agent, agentFixture.byId(id), 'should be the same')
})

test.serial('Agent#createOrUpdate - exists', async t => {
    let agent = await db.Agent.createOrUpdate(single)
    
    t.true(AgentStub.findOne.called, 'findOne should be called on model')
    t.true(AgentStub.findOne.calledTwice, 'findOne should be called twice')
    t.true(AgentStub.update.calledOnce, 'update should be called once')

    t.deepEqual(agent, single, 'agent should be the same')
})