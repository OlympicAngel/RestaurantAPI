//load env arguments
require('dotenv').config();
//connect to mongo DB
require("./db/mongo")()

//initialize server
const express = require('express');
const app = express();

//allow json body parsing
app.use(express.json())

//parse cookies into body
app.use(require("cookie-parser")("someKEyForCookieEncrypt"))

app.use("/dishes", require("./routes/dishes"));
app.use("/clients", require("./routes/users"));
app.use("/workers", require("./routes/workers"));
app.use("/events", require("./routes/events"));

app.use(express.static("./client/public"))


//start listening on port
app.listen(process.env.PORT, () => { console.log("Server is running on port:", process.env.PORT) })