const mongoose = require("mongoose")
require("express-async-errors")
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const app = express()
const blogRouter = require("./controllers/blog")
const logger = require("./utils/logger")
const config = require("./utils/config")
const middleware = require("./utils/middleware")

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => logger.info(`connected to mongoDB`))
  .catch(error => logger.error(`error connecting to mongoDB`, error.message))

app.use(cors())
app.use(bodyParser.json())
app.use(middleware.requestLogger)
app.use("/api/blogs", blogRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
module.exports = app
