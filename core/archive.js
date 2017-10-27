'use strict'

const _ = require('lodash')
const moment = require('moment')
const rw = require('./readwrite')

/**
 * Builds the archive JSON object in memory from the Reddit API result
 * @param {Array} file Name of the file to be written
 * @param {Object} [opts={}] Optional settings 'type'='submissions' and 'ups'=1
 * @returns {Object} Object package for use with writeArchive()
 */
const buildArchive = (jsonArr, opts = {}) => {
  let settings = {}
  settings.type = opts.type || 'submissions'
  settings.ups = opts.ups || 1

  switch (settings.type) {
    case 'comments':
      settings.folder = `comments${settings.ups === 1 ? '' : '-' + settings.ups}_${moment().unix()}`
      settings.dateFormat = 'YYYY-MM-DD_HH-mm'
      settings.body = 'body'
      settings.title = 'link_title'
      break
    default:
      settings.folder = `submissions${settings.ups === 1 ? '' : '-' + settings.ups}_${moment().unix()}`
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

/**
 * Builds the archive JSON object in memory from the Reddit API result
 * @param {Object} archive Object package of posts formatted by buildArchive()
 */
const writeArchive = (archive) => {
  console.log('Writing archive...')

  rw.folderWrite(archive.settings.folder)
    .then((response) => {
      _.each(archive.posts, (doc) => {
        let kebab = _.kebabCase(doc.title)
        let truncate = _.trimEnd(_.truncate(kebab, {length: 24, omission: ''}), '-')
        let filename = `${doc.date}_${truncate}.md`
        rw.fileWrite(`${archive.settings.folder}/${filename}`, doc.body).catch((error) => {
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
  buildArchive,
  writeArchive
}
