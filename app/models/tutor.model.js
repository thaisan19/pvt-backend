const { text } = require("body-parser");
const { Schema } = require("mongoose");

module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      fullName: {type: String, required: true, unique: true, maxLength: 20, minLength: 3},
      password: {type: String, default: ""},
      phoneNumber: {type: String, required: true, max:999999999, min:10000000, unique: true},
      email: {type: String, required: true, unique: true},
      expertises: {type: Array , required: true },
      tutoringDays: {type: Array, required: true},
      tutoringHours: {type: Array, require: true},
      aboutMe: {type: String, required: true},
      monthlyRate: {type: String, required: true},
      eduBackground: {type: String, required: true},
      achievement: {type: String, required: true},
      profile: {type: Buffer, require: false },
      cv: {type: Buffer, require: false },
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
