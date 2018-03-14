'use strict'

console.log(process.argv)


console.log(process.argv.filter(flag => {
    return (flag.toLowerCase()) === '--y' || '--yes'
}))