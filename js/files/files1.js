const fs = require('fs')

const head = '\n7777777777'

const myString = function (theString) {
  return theString
}

fs.appendFile('mynewfile1.txt', myString(head), function (err) {
  if (err) throw err;
  console.log('Saved!')
})
