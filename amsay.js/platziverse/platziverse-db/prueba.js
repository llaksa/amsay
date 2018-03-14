'use strict'

const defaultConfig = {
    database: process.env.DB_NAME || 'platziverse',
    username: process.env.DB_USER || 'platzi',
    password: process.env.DB_PASS || 'platzi',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    loggin: s => debug(s),
    setup: true, // para borrar la informació histórica cada vez que llamamos a setup.js
    operatorsAliases: false // peratorsAliases: Sequelize.Op 
}

function config (diffObj) {
    const auxObj = diffObj
    return Object.assign(defaultConfig, auxObj)
}

module.exports = config