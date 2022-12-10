var express = require('express');
const db = require('./models/index')

var app = express();
const port = process.env.PORT || 3001

app.use(express.json())
app.use(express.static('public'))

app.use(function(req, res, next) {
    console.log("A request was made") //TODO: replace with Winston logging once setup
    next()
})

// this is our global exception handler function. If an error is thrown, it lands here if not caught elsewhere
// we can create different logging functions in an external file, import that file, then call our log of choice depending on the scenario
app.use(function (err, req, res, next) {
    console.log("  - err:", err) //TODO: replace with Winston logging once setup
    res.status(500).send()
})

app.use('*', function(req, res) {
    res.status(404).send({
        error: "The requested resource does not exist"
    })
})

db.sequelize.sync().then(function () { //sync will automatically create the table, but it will never alter a table (migrations must be run for alterations)
    app.listen(port, function () {
        console.log("== Server is listening on port:", port)
    })
  })