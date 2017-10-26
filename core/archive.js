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

const fileWrite = (file, str) => {
  fs.writeFile(file, str, (e) => {
    if (e === null) {
      fsSuccess(file, 'writing')
    } else {
      console.log(e)
      fsError(file, 'writing')
    }
  })
}

const folderWrite = (dir) => {
  fs.mkdir(dir, (e) => {
    if (e === null) {
      fsSuccess(dir, 'writing')
    } else {
      console.log(e)
      fsError(dir, 'writing')
    }
  })
}

const getJsonFile = (file) => {
  try {
    let jsonString = fs.readFileSync(file)
    return JSON.parse(jsonString)
  } catch (e) {
    fsError(file, 'reading')
  }
}

const buildArchive = (jsonArr, opts = {}) => {
  let settings = {}
  settings.type = opts.type || 'submissions'
  settings.ups = opts.ups || 1

  switch (settings.type) {
    case 'comments':
      settings.folder = 'comments'
      settings.dateFormat = 'YYYY-MM-DD_HH-mm'
      settings.body = 'body'
      settings.title = 'link_title'
      break
    default:
      settings.folder = 'submissions'
      settings.dateFormat = 'YYYY-MM-DD'
      settings.body = 'selftext'
      settings.title = 'title'
  }

  console.log('Building archive...', settings)

  let archive = []
  _.each(jsonArr, (item) => {
    if (item.ups >= settings.ups) {
      let post = {}
      let date = new Date(0)
      date.setUTCSeconds(item.created)
      post.date = moment(date).format(settings.dateFormat)
      post.body = item[settings.body]
      post.title = item[settings.title].replace('\n', ' ')
      archive.push(post)
    }
  })
  return archive
}

const writeArchive = (archive, opts = {}) => {
  console.log('Writing archive...')
  let folder = opts.type || 'submissions'
  folder = folder + (opts.ups || '')

  folderWrite(folder)
  _.each(archive, (doc) => {
    let kebab = _.kebabCase(doc.title)
    let truncate = _.trimEnd(_.truncate(kebab, {length: 24, omission: ''}), '-')
    let filename = `${doc.date}_${truncate}.md`
    fileWrite(`${folder}/${filename}`, doc.body)
  })
  console.log('Archive writing process complete.')
}

module.exports = {
  fsError,
  fileWrite,
  getJsonFile,
  buildArchive,
  writeArchive
}
