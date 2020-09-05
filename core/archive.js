'use strict'

import _ from 'lodash'
import moment from 'moment'
import { fsSuccess, fsError, fileWrite, folderWrite } from './readwrite.js'

const rw = { fsSuccess, fsError, fileWrite, folderWrite }

/**
 * Returns an object of settings for use with buildArchive()
 * @param {String} type Type of archive to create
 * @param {number} ups Minimum upvote to filter by
 * @returns {Object} Object of archive settings
 */
const getSettings = (type, ups) => {
  const settings = {}
  settings.type = type || 'submissions'
  settings.ups = ups || 1
  settings.folder = `${type}${settings.ups === 1 ? '' : '-' + settings.ups}_${moment().unix()}`
  settings.dateFormat = 'YYYY-MM-DD'
  settings.timeFormat = 'HH-mm'
  return settings
}

/**
 * Builds the archive JSON object in memory from the Reddit API result
 * @param {Array} file Name of the file to be written
 * @param {Object} settings Settings for the processed archive
 * @returns {Object} Archive package for use with writeArchive()
 */
const buildArchive = (jsonArr, settings) => {
  console.log('Building archive...')

  let archive = {}
  archive.posts = []
  archive.settings = settings

  jsonArr.forEach((item) => {
    if (item.ups >= settings.ups) {
      const body = _bodyBuilder(item, settings)
      if (!body.empty) {
        const post = {}
        const date = new Date(0)
        date.setUTCSeconds(item.created)
        post.date = moment(date).format(settings.dateFormat)
        post.time = moment(date).format(settings.timeFormat)
        post.title = body.titleStr
        post.body = body.bodyStr
        archive.posts.push(post)
      }
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
      archive.posts.forEach((doc) => {
        const kebab = _.kebabCase(doc.title)
        const truncate = _.trimEnd(_.truncate(kebab, {length: 24, omission: ''}), '-')
        const filenameTmp = `${doc.date}_${truncate}`
        const filename = archive.settings.type === 'submissions' ? filenameTmp + '.md' : `${filenameTmp}_${doc.time}.md`
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

/**
 * Comments and self.posts in Reddit store the title and content body in
 * different keys. This method determines the location of the title
 * and body from the entry object passed to it.
 * @private
 * @param {Object} item Item object from the JSON array
 * @param {Object} settings Settings for the processed archive
 * @returns {Object} Body and title locations and formatted strings
 */
const _bodyBuilder = (item) => {
  const body = {}
  body.bodySrc = item.body ? 'body' : 'selftext'
  body.titleSrc = item.link_title ? 'link_title' : 'title'
  body.empty = false

  if (item[body.bodySrc] !== '') {
    const date = new Date(0)
    date.setUTCSeconds(item.created)
    body.titleStr = item[body.titleSrc].replace('\n', '')
    switch (body.bodySrc) {
      case 'selftext':
        body.bodyStr = `# ${body.titleStr}\n\n${item[body.bodySrc]}`
        break
      case 'body':
        body.bodyStr = `# Comment on "${body.titleStr}" on ${moment(date).format('DD MMM YYYY')} at ${moment(date).format('HH:MM')}\n\n${item[body.bodySrc]}`
        break
    }
  } else {
    body.empty = true
  }

  return body
}

export {
  getSettings,
  buildArchive,
  writeArchive
}
