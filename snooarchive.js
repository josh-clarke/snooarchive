'use strict'

const Snoowrap = require('snoowrap')
const argv = require('yargs').argv
const dotenv = require('dotenv')
const archive = require('./core/archive')

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

/**
 * Process command-line arguments
 */
const comments = argv.c || argv.comments
let ups = argv.u || argv.upvotes
// -u or --upvotes with no number returns true
// set it to false make it fail condition checks
ups = ups === true ? false : ups

/**
 * Execute steps
 */
if (comments === undefined) {
  console.log('Getting submissions...')
  let processed = []
  reddit.getMe().getSubmissions().fetchAll().then((json) => {
    processed = archive.buildArchive(json, {'ups': ups})
    archive.writeArchive(processed, {'ups': ups})
  })
} else {
  console.log(`Getting comments...`)
  let processed = []
  reddit.getMe().getComments().fetchAll().then((json) => {
    processed = archive.buildArchive(json, {'type': 'comments', 'ups': ups})
    archive.writeArchive(processed)
  })
}
