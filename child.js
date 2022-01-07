import axios from 'axios'
import fs from 'fs'
import path from 'path'
import { ACTIONS } from './configs/actions.js'

process.on('message', (message) => {
  if (message.action === ACTIONS.START_DOWNLOAD) {
    download(message.data.url, message.data.filename)
  }
})

function download(url, filename) {
  const writer = fs.createWriteStream(path.join('tmp', filename))
  return new Promise((resolve) => {
    axios.get(url, { responseType: 'stream' }).then((res) => {
      const stream = res.data

      return stream
    }).then((reader) => {
      reader.pipe(writer)

      writer.on('finish', () => {
        resolve()
        process.send({
          action: ACTIONS.FINISH_DOWNLOAD
        })
      })
    })
  })
}


