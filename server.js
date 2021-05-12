const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const createError = require('http-errors');
const { verifyAccessToken } = require('./app/helpers/jwt_helper');

const app = express();

var corsOptions = {
  origin: "http://localhost:8080"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// db calling
const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });
// simple route
// app.get("/", verifyAccessToken,(req, res) => {
//   res.json({ message: "Welcome to bezkoder application." });
// });

require("./app/routes/tutor.routes")(app);
require("./app/routes/course.routes")(app);
require("./app/routes/admin.routes")(app);
require("./app/routes/request.routes")(app);

app.use(async (req, res, next) => {
  next(createError.NotFound())
})

app.use((err, req, res, next) => {
res.status(err.status || 500)
res.send({
    error:{
        status: err.status || 500,
        message: err.message
    }
})
})
// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
