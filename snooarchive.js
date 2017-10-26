'use strict'

// Imports
const snoowrap = require('snoowrap')
const argv = require('yargs').argv
const archive = require('./archive')

// Read credentials from config.json
const config = './config.json'
const creds = archive.getCreds(config)

// Get submissions
if(creds !== undefined) {
  const reddit = new snoowrap(creds)
  const comments = argv.c ? argv.c : ( argv.comments ? argv.comments : undefined )
  
  if(comments === undefined) {
    console.log('Getting submissions...')
    let processed = []
    reddit.getMe().getSubmissions().fetchAll().then((json) =>{
      processed = archive.buildArchive(json)
      archive.writeArchive(processed)
    })
  }
  else {
    console.log(`Getting comments...`)
    let processed = []
    reddit.getMe().getComments().fetchAll().then((json) =>{
      processed = archive.buildArchiveComments(json)
      archive.writeArchive(processed,'comments-10')
    })
  }
}