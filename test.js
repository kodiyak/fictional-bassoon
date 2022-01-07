console.log('TESTING PROCESSES', process.pid)

process.on('message', (message) => {
  console.log(`MSG FROM PARENT: `, message)
})

let counter = 0

setInterval(() => {
  process.send({ counter: counter++ })
}, 1000)