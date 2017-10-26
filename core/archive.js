'use strict'

const fs = require('fs')
const _ = require('lodash')
const moment = require('moment')

const fsError = (reference, action) => {
  console.log(`There was an error ${action} ${reference}`)
}

const fsSuccess = (reference, action) => {
  console.log(`Success in ${action} ${reference}`)
}


const fileWrite = (file,str) => {
  fs.writeFile(file,str,(e) => {
    if(e === null ) {
      fsSuccess(file,'writing')
    }
    else{
      console.log(e)
      fsError(file,'writing')
    }
  })
}

const folderWrite = (dir) => {
  fs.mkdir(dir,(e) => {
    if(e === null ) {
      fsSuccess(dir,'writing')
    }
    else{
      console.log(e)
      fsError(dir,'writing')
    }
  })
}

const getCreds = (config) => {
  try {
    let credString = fs.readFileSync(config)
    return JSON.parse(credString)
  }
  catch(e){
    fsError(config,'reading')
  }
}

const buildArchive = (jsonArr) => {
  console.log('Building archive...')
  let archive = []
  _.each(jsonArr, (obj) => {
    let post = {}
    let date = new Date(0)
    date.setUTCSeconds(obj.created)    
    post.date = moment(date).format('YYYY-MM-DD')
    post.body = obj.selftext
    post.title = obj.title.replace('\n', ' ')
    archive.push(post)
  })
  return archive
}

const writeArchive = (archive, folder = 'submissions') => {
  console.log('Writing archive...')
  folderWrite(folder)  
  _.each(archive, (doc) => {
    let kebab = _.kebabCase(doc.title)
    let truncate = _.truncate(kebab, {length:24,omission:''})
    let filename = doc.date + '_' + _.trimEnd(truncate,'-') + '.md'
    fileWrite(`${folder}/${filename}`,doc.body)
  })
  console.log('Archive writing process complete.')
}

const buildArchiveComments = (jsonArr, ups = 10) => {
  console.log('Building comments archive...')
  let archive = []
  _.each(jsonArr, (obj) => {
    if( obj.ups >= ups) {
      let post = {}
      let date = new Date(0)
      date.setUTCSeconds(obj.created)    
      post.date = moment(date).format('YYYY-MM-DD_HH:mm_')
      post.body = obj.body
      post.title = obj.link_title.replace('\n', ' ')
      archive.push(post)
    }
  })
  return archive
}

module.exports = {
  fsError,
  fileWrite,
  getCreds,
  buildArchive,
  buildArchiveComments,
  writeArchive
}