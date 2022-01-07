import { fork } from 'child_process'
import { ACTIONS } from './configs/actions.js'

function createForkChildProcess() {
  return fork('child.js')
}

const download = (url, filename) => {
  const childProcess = createForkChildProcess(url, filename)
  function log(...msgs) {
    console.log('[CHILD_PROCESS]', childProcess.pid, ...msgs)
  }

  childProcess.on('error', (err) => {
    log('[ERROR]', err)
  })
  childProcess.on('spawn', () => {
    log('[SPAWN]')
    setTimeout(() => {
      const startDownloadProps = {
        action: ACTIONS.START_DOWNLOAD,
        data: { url, filename }
      }

      childProcess.send(startDownloadProps)
    }, 2000)
  })
  childProcess.on('message', (message) => {
    log('[MESSAGE]', message)
    if (message.action === ACTIONS.FINISH_DOWNLOAD) {
      childProcess.kill()
    }
  })
  childProcess.on('close', (code, signal) => {
    log('[CLOSE]', code, signal)
  })
}

download('https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_1920_18MG.mp4', 'github-page.mp4')
download('https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_1920_18MG.mp4', 'github-page-2.mp4')
download('https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_1920_18MG.mp4', 'github-page-3.mp4')
download('https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_1920_18MG.mp4', 'github-page-4.mp4')