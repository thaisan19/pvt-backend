const { text } = require("body-parser");
const { query } = require("express");
const { Schema } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      createdBy: {type: String, required: true},
      courseLength: {type: String, required: false},
      courseDesc: {type: String, required: false},
      courseExpectation: {type: String, required: false},
      courseRequirement: {type: String, required: false},
      tutoringHours: {type: Array, require: false},
      tutoringDays: {type: Array, require: false},
      name: {type: String, required: true},
      price: {type: String, required: true},
      ownerId:{
          type: Schema.Types.ObjectId,
          ref: 'Tutor,AdminUser',
          require: false
      },
      ownerProfile:{
        type: Array,
        require: false
      }
      
    },
    { timestamps: true }
  );

  schema.plugin(mongoosePaginate);

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Course = mongoose.model("Course", schema);
  // Course.paginate(query, options)
  // .then(result => {})
  // .catch(error => {});

  return Course;
  
  
};


