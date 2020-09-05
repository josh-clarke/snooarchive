'use strict'

import fs from 'fs'

/**
 * Prints a filesystem success message to the console.
 * @param {String} reference Name of the fole/folder in question
 * @param {String} action Verb for the sentence, i.e., 'writing'
 */
const fsError = (reference, action) => {
  console.log(`There was an error ${action} ${reference}`)
}

/**
 * Prints a filesystem failure message to the console.
 * @param {String} reference Name of the fole/folder in question
 * @param {String} action Verb for the sentence, i.e., 'writing'
 */
const fsSuccess = (reference, action) => {
  console.log(`Success in ${action} ${reference}`)
}

/**
 * Wrapper for async fs.writeFile with Promise
 * @param {String} file Name of the file to be written
 * @param {String} str Content of the file
 * @returns {Promise}
 */
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

/**
 * Wrapper for async fs.folderWrite with Promise
 * @param {string} dir Name of the directory written
 * @returns {Promise}
 */
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

export {
  fsError,
  fsSuccess,
  fileWrite,
  folderWrite
}
