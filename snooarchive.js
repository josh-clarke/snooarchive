'use strict'

const Snoowrap = require('snoowrap')
const argv = require('yargs').argv
const dotenv = require('dotenv')
const archive = require('./core/archive')
const rw = require('./core/readwrite.js')

// Load enviornment variables where credentials are kept
dotenv.load({path: '.env'})

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
const type = comments ? 'comments' : 'submissions'

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

  if (type === 'comments') {
    reddit.getMe().getComments().fetchAll().then(doArchive)
  } else {
    reddit.getMe().getSubmissions().fetchAll().then(doArchive)
  }
}

// Undocumented feature to save a copy of the JSON response
const saveJson = () => {
  console.log(`Getting ${type} as JSON...`)
  const user = reddit.getMe()
  const list = comments ? user.getComments().fetchAll() : user.getSubmissions.fetchAll()

  list.then((json) => {
    const jsonStr = JSON.stringify(json)
    const file = `${type}.json`
    rw.fileWrite(file, jsonStr)
      .then((success) => {
        console.log(`File ${file} written to disk.`)
      })
      .catch((e) => {
        console.log(`There was a problem writing ${file} to disk.`)
      })
  })
}

// Go to main process or save json to disk
if (!savejson) {
  archiveProcess()
} else {
  saveJson()
}
