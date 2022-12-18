const path = require("path")

const express = require("express")
const cookieParser = require('cookie-parser')
const compression = require('compression')
const cors = require('cors')
const helmet = require("helmet")
const morgan = require("morgan")

const api = require("./api")
const convertErrors = require('./middleware/convertErrors')
const handleErrors = require('./middleware/handleErrors')
const app = express()


// parsing cookies for auth
app.use(cookieParser())

// setting up logger
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://ornateapp.netlify.app/"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



// setting security HTTP headers
app.use(helmet({
    crossOriginResourcePolicy: false,
}))

// parsing incoming requests with JSON body payloads
app.use(express.json())

// parsing incoming requests with urlencoded body payloads
app.use(express.urlencoded({ extended: true }))

// serving the static files
app.use(express.static(path.join(__dirname, "../", "client/", "build")))
app.use(express.static(path.join(__dirname, "images")))

// handling gzip compression
app.use(compression())

// redirecting incoming requests to api.js
app.use(`/api/${process.env.API_VERSION}`, api)

// returning the main index.html, so react-router render the route in the client
app.get("*", (req, res) => {
    res.send('404 not found')
})

// setting up a 404 error handler
app.all("*", (req, res, next) => {
    res.status(404).end()
})

// convert&handle errors
app.use(convertErrors)
app.use(handleErrors)

module.exports = app