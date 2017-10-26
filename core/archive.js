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
      settings.folder = 'comments_' + moment().unix()
      settings.dateFormat = 'YYYY-MM-DD_HH-mm'
      settings.body = 'body'
      settings.title = 'link_title'
      break
    default:
      settings.folder = 'submissions_' + moment().unix()
      settings.dateFormat = 'YYYY-MM-DD'
      settings.body = 'selftext'
      settings.title = 'title'
  }

  console.log('Building archive...')

  let archive = {}
  archive.posts = []
  archive.settings = settings

  _.each(jsonArr, (item) => {
    if (item.ups >= settings.ups && item[settings.body] !== '') {
      let post = {}
      let date = new Date(0)
      date.setUTCSeconds(item.created)
      post.date = moment(date).format(settings.dateFormat)
      post.title = item[settings.title].replace('\n', ' ')
      if (settings.type === 'submissions') {
        post.body = `# ${post.title}\n\n${item[settings.body]}`
      } else {
        post.body = item[settings.body]
      }
      archive.posts.push(post)
    }
  })

  return archive
}

const writeArchive = (archive, opts = {}) => {
  console.log('Writing archive...')

  folderWrite(archive.settings.folder)
    .then((response) => {
      _.each(archive.posts, (doc) => {
        let kebab = _.kebabCase(doc.title)
        let truncate = _.trimEnd(_.truncate(kebab, {length: 24, omission: ''}), '-')
        let filename = `${doc.date}_${truncate}.md`
        fileWrite(`${archive.settings.folder}/${filename}`, doc.body).catch((error) => {
          console.log(`Problem writing file: ${error.message}`)
          process.exit(1)
        })
      })
      console.log('Archive writing process complete.')
    })
    .catch((err) => {
      console.log(err.message)
    })
}

module.exports = {
  fsError,
  fileWrite,
  getJsonFile,
  buildArchive,
  writeArchive
}
