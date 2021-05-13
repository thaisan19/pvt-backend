const { text } = require("body-parser");
const { Schema } = require("mongoose");
const shortid = require('shortid');

module.exports = mongoose => {
  var schema = mongoose.Schema(
    { 
      fullName: {type: String, required: false, unique: true, maxLength: 20, minLength: 3},
      password: {type: String, default: ""},
      phoneNumber: {type: String, required: false, max:999999999, min:10000000, unique: false},
      email: {type: String, required: false, unique: true},
      gender: {type: String, required: false, unique: false},
      dateOfBirth: {type: String, required: false, unique: false},
      expertises: {type: Array , required: false },
      tutoringDays: {type: Array, required: false},
      tutoringHours: {type: Array, require: false},
      aboutMe: {type: String, required: false},
      monthlyRate: {type: String, required: false},
      eduBackground: {type: String, required: false},
      achievement: {type: String, required: false},
      profile: {
        type: Array,
        required: false
      },
      cv: {
        type: Array,
        required: false
      },
      // profile: {type: Buffer, require: false },
      // cv: {type: Buffer, require: false },
      published: Boolean,
      role: {
        type: String,
        require: true
      },
      read: {type: Boolean, require: true}
    },
    { timestamps: true }
  );

//Virtual schema

  schema.virtual("coursePublished", {
    ref: 'Course', //The Model to use
    localField: '_id', //Find in Model, where localField 
    foreignField: 'ownerId', // is equal to foreignField
  });
  schema.set('toObject', {virutals: true});
  schema.set('toJSON', {virtuals: true});

  const Tutor = mongoose.model("Tutor", schema);
  return Tutor;
};
