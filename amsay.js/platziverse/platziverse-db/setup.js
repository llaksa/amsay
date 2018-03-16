'use strict'

const debug = require('debug')('platziverse:db:setup') // Para tener mensajes de error a colores con el strign "platziverse:db:setup"
const inquirer = require('inquirer') // Para añadir prompts
const chalk = require('chalk') // Para dar colores, aquí usado para darle colores a los errores
const db = require('./') // lo mismo que './index.js'
const configSetUp = require('../platziverse-common/defaultConfig')

const prompt = inquirer.createPromptModule() // creando un prompt
const config = configSetUp({logging: s => debug(s), setup: true}) // setup: true para borrar la informació histórica cada vez que llamamos a setup.js

async function setup () {
    // to receive flags from console (i. e. -- --yes)
  const yesFlag = process.argv.filter(flag => {
    return (flag.toLowerCase()) === '--y' || (flag.toLowerCase() === '--yes')
  })[0]

  if (!yesFlag) {
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
  }

    /*
    const config = {
        database: process.env.DB_NAME || 'platziverse',
        username: process.env.DB_USER || 'platzi',
        password: process.env.DB_PASS || 'platzi',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        loggin: s => debug(s),
        setup: true, // para borrar la informació histórica cada vez que llamamos a setup.js
        operatorsAliases: false // peratorsAliases: Sequelize.Op
    }
    */

    // await db(config).catch(handleFatalError)
  await db(config).catch(handleFatalError)

  console.log('Succes!')
  process.exit(0)
}

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

setup()

// este archivo:
// solo pregunta si se quiere crear/destruitycrear la base de datos según la config que se le pase y maneja errores, después todo lo hace index.js
