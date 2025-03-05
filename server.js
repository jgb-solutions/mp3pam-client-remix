const path = require('path')
const express = require('express')
const morgan = require('morgan')
const { createRequestHandler } = require('@remix-run/express')

// const { createServer } = require('http') // add this require
// const { Server } = require('socket.io') // and also require the socket.io module

const BUILD_DIR = path.join(process.cwd(), 'build')

const app = express()


// create an httpServer from the Express app
// const httpServer = createServer(app)

// and create the socket.io server from the httpServer
// const io = new Server(httpServer)

// then list to the connection event and get a socket object
// io.on('connection', (socket) => {
//   console.log(socket.id, 'connected')
//   socket.emit('event', 'connected!')
//   socket.on('something', (data) => {
//     console.log(socket.id, data)
//     socket.emit('event', 'pong')
//   })

//   socket.on('disconnect', () => {
//     console.log(socket.id, 'disconnected')
//   })
// })

app.disable('x-powered-by')

app.use(
  '/build',
  express.static('public/build', { immutable: true, maxAge: '1y' })
)

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static('public', { maxAge: '1y' }))

app.use('/build', express.static('public/~partytown', { maxAge: '1w' }))

app.use(morgan('tiny'))

app.all(
  '*',
  process.env.NODE_ENV === 'development'
    ? (req, res, next) => {
        purgeRequireCache()

        return createRequestHandler({
          build: require(BUILD_DIR),
          mode: process.env.NODE_ENV,
          // return anything you want here to be available as `context` in your
          // loaders and actions. This is where you can bridge the gap between Remix
          // and your server
          getLoadContext(req, res) {
            return {}
          },
        })(req, res, next)
      }
    : createRequestHandler({
        build: require(BUILD_DIR),
        mode: process.env.NODE_ENV,
        getLoadContext(req, res) {
          return {}
        },
      })
)
const port = process.env.PORT || 3000

// instead of using `app.listen` we use `httpServer.listen`
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`)
})

function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, but then you'll have to reconnect to databases/etc on each
  // change. We prefer the DX of this, so we've included it for you by default
  for (let key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key]
    }
  }
}
