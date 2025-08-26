// index.js
require("dotenv").config()
const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
const logger = require("morgan")
require("./models/connection")
const helmet = require("helmet")
const cors = require("cors")
const rateLimit = require("express-rate-limit")

const indexRouter = require("./routes/index")
const usersRouter = require("./routes/users")

const app = express()

app.use(helmet())
app.use(cors({ origin: ["http://localhost:4000", "https://quizzfr.vercel.app"], credentials: false }))
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))
app.use(rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
}))

app.use("/", indexRouter)
app.use("/users", usersRouter)

module.exports = app
