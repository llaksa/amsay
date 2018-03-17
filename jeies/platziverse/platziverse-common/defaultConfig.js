'use strict'

const defaultConfig = { 
    db: {
        database: process.env.DB_NAME || 'platziverse',
        username: process.env.DB_USER || 'platzi',
        password: process.env.DB_PASS || 'platzi',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        operatorsAliases: false // operatorsAliases: Sequelize.Op 
    },
    auth: {
        secret: process.env.SECRET
    }
}

function configSetup (diffObj) {
    const auxObj = defaultConfig
    Object.assign(auxObj.db, diffObj)
    return auxObj
}

module.exports = configSetup