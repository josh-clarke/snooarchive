'use strict'

const Snoowrap = require('snoowrap')
const argv = require('yargs').argv
const dotenv = require('dotenv').config({path: '.env'})
const archive = require('./core/archive')
const rw = require('./core/readwrite.js')

// Configure reddit API
const reddit = new Snoowrap({
  'userAgent': process.env.USER_AGENT,
  'clientId': process.env.CLIENT_ID,
  'clientSecret': process.env.CLIENT_SECRET,
  'username': process.env.REDDIT_USERNAME,
  'password': process.env.REDDIT_PASSWORD
})

// Process command-line arguments
const comments = argv.c || argv.comments
const savejson = argv.savejson
const saved = argv.s || argv.saved
const type = comments ? 'comments' : (saved ? 'saved' : 'submissions')

// -u or --upvotes with no number returns true
// set it to false make it fail condition checks
let ups = argv.u || argv.upvotes
ups = ups === true ? false : ups

// Call reddit API and process
const archiveProcess = () => {
  console.log(`Getting ${type}...`)
  let processed = []
  const settings = archive.getSettings(type, ups)

  const doArchive = (json) => {
    processed = archive.buildArchive(json, settings)
    archive.writeArchive(processed)
  }

  switch (type) {
    case 'comments':
      reddit.getMe().getComments().fetchAll().then(doArchive)
      break
    case 'saved':
      reddit.getMe().getSavedContent().fetchAll().then(doArchive)
      break
    default:
      reddit.getMe().getSubmissions().fetchAll().then(doArchive)
  }
}

// Undocumented feature to save a copy of the JSON response
const saveJson = () => {
  console.log(`Getting ${type} as JSON...`)

  const doSaveJson = (json) => {
    const jsonStr = JSON.stringify(json)
    const file = `${type}.json`
    rw.fileWrite(file, jsonStr)
      .then((success) => {
        console.log(`File ${file} written to disk.`)
      })
      .catch((e) => {
        console.log(`There was a problem writing ${file} to disk.`)
      })
  }

  switch (type) {
    case 'comments':
      reddit.getMe().getComments().fetchAll().then(doSaveJson)
      break
    case 'saved':
      reddit.getMe().getSavedContent().fetchAll().then(doSaveJson)
      break
    default:
      reddit.getMe().getSubmissions().fetchAll().then(doSaveJson)
  }
}

// Go to main process or save json to disk
if (!savejson) {
  archiveProcess()
} else {
  saveJson()
}
