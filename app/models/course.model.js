const { text } = require("body-parser");
const { Schema } = require("mongoose");

module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      createdBy: {type: String, required: false},
      courseLength: {type: String, required: false},
      courseDesc: {type: String, required: false},
      courseExpectation: {type: String, required: false},
      courseRequirement: {type: String, required: false},
      tutoringHours: {type: Array, require: false},
      tutoringDays: {type: Array, require: false},
      name: {type: String, required: true},
      Price: {type: String, required: true},
      ownerId:{
          type: Schema.Types.ObjectId,
          ref: 'Tutor, AdminUser',
          require: true
      },
      
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Course = mongoose.model("Course", schema);
  return Course;
};
