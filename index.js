// Import modules and libraries
require("dotenv").config()
const express = require("express")
const Op = require("sequelize").Op
const app = express()
const cors = require("cors")
const http = require("http").createServer(app)
const { sequelize } = require("./models")

app.use(cors());
// To enable json for POST requests
app.use(express.json({ limit: "128mb" }))
app.use(express.urlencoded({ limit: "128mb", extended: true }))

// Import routing module
const routing = require("./routing");
app.use("/api/v1/", routing);


// Database connection and server start
http.listen(process.env.PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.", process.pid)
    console.log(`Server is now running on port ${process.env.PORT}.`)
  } catch (error) {
    console.error("Failed to connect to the database:", error)
  }
})
