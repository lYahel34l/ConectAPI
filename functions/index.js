

const functions = require("firebase-functions");

const express = require("express");


const app = express();

app.get("/hello-world", (req, res)=>{
  return res.status(200).json({message: "Hello world"});
});

app.use(require("./routes/tecs.routes"));
app.use(require("./routes/event.routes"));
app.use(require("./routes/proyects.routes"));
app.use(require("./routes/user.routes"));
app.use(require("./routes/winners.routes"));


exports.app = functions.https.onRequest(app);


