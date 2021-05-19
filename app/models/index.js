const dbConfig = require("../config/db.config.js");
const mongoosePaginate = require("mongoose-paginate-v2");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.tutor = require("./tutor.model.js")(mongoose);
db.course = require("./course.model.js")(mongoose, mongoosePaginate);
db.admin = require("./admin.model.js")(mongoose);
db.request = require("./request.model.js")(mongoose);

module.exports = db;