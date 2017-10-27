'use strict'

const fs = require('fs')

const fsError = (reference, action) => {
  console.log(`There was an error ${action} ${reference}`)
}

const fsSuccess = (reference, action) => {
  console.log(`Success in ${action} ${reference}`)
}

const fileWrite = (file, str) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, str, (e) => {
      if (e === null) {
        fsSuccess(file, 'writing')
        resolve()
      } else {
        fsError(file, 'writing')
        reject(e)
      }
    })
  })
}

const folderWrite = (dir) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, (e) => {
      if (e === null) {
        fsSuccess(dir, 'writing')
        resolve()
      } else {
        reject(e)
      }
    })
  })
}

module.exports = {
  fsError,
  fsSuccess,
  fileWrite,
  folderWrite
}
