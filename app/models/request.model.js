const { boolean } = require("@hapi/joi");
const { text } = require("body-parser");
const { Schema } = require("mongoose");

module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
    title: {
        type: String, 
        required: true
        },
    objId: {
        type: String, 
        required: true
        },
    objName:{
        type: String,
        require: true
        },
    studentName:{
        type: String,
        require: true
    },
    studentEmail:{
        type: String,
        require: true
    },
    studentPhoneNumber: {
         type: String,
         require: true
    },
    reqAdd: {
         type: String,
         require: true
    },
    pickedTutoringDays: {
        type: Array,
        require: true
    },
    pickedTutoringHours: {
        type: Array,
        require: true
    },
    read:{ 
        type: Boolean,
        require: true
    },
    },
    { timestamps: true }
  );
  const Request = mongoose.model("request", schema);
  return Request;
};