const mongoose = require("mongoose")
const Database = "mongodb://localhost/Location"

//create connection with the Location database
mongoose.promise = global.promise
mongoose.connect(Database, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Database Location connected')

}).catch((err) => { 
    console.log('error') 
}) 

module.exports = {
    mongoose
}

