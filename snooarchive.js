'use strict'

// Imports
const snoowrap = require('snoowrap')
const argv = require('yargs').argv
const archive = require('./core/archive')

// Read credentials from config.json
const config = './config.json'
const creds = archive.getJsonFile(config)

// Get submissions
if(creds !== undefined) {
  const reddit = new snoowrap(creds)
  const comments = argv.c || argv.comments

  // Check if it's set to true,
  // which indicates a flag without a number.
  // Set it to false if so.

  let ups = argv.u || argv.upvotes
  ups = ups === true ? false : ups

  if(comments === undefined) {
    console.log('Getting submissions...')
    let processed = []
    reddit.getMe().getSubmissions().fetchAll().then((json) =>{
      processed = archive.buildArchive(json, {'ups': ups})
      archive.writeArchive(processed, {'ups': ups})
    })
  }
  else {
    console.log(`Getting comments...`)
    let processed = []
    reddit.getMe().getComments().fetchAll().then((json) =>{
      processed = archive.buildArchive(json, {'type':'comments','ups': ups})
      archive.writeArchive(processed, {'type': 'comments','ups':ups})
    })
  }
}else{
  console.log('There was an error loading the config.json file.')
  console.log('Did you create it?')
}
