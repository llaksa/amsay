'use strict'

const debug = require('debug')('platziverse:db:setup') // Para tener mensajes de error a colores con el strign "platziverse:db:setup"
const inquirer = require('inquirer') // Para añadir prompts
const chalk = require('chalk') // Para dar colores, aquí usado para darle colores a los errores
const db = require('./') // lo mismo que './index.js'

const prompt = inquirer.createPromptModule() // creando un prompt

async function setup () {
    const answer = await prompt([
        {
            type: 'confirm',
            name: 'setup',
            message: 'This will destroy your database, are you sure?'
        }
    ])

    if (!answer.setup) {
        return console.log('Nothing happened :)')
    }

    const config = {
        database: process.env.DB_NAME || 'platziverse',
        username: process.env.DB_USER || 'platzi',
        password: process.env.DB_PASS || 'platzi',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        loggin: s => debug(s),
        setup: true,
        operatorsAliases:false // peratorsAliases: Sequelize.Op 
    }

    // await db(config).catch(handleFatalError)
    await db(config).catch(handleFatalError)

    console.log('Succes!')
    process.exit(0)
}

function handleFatalError (err) {
    console.error(err.message)
    console.error(err.stack)
    process.exit(1)
}

setup()
