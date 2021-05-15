const db = require("../models");
const Course = db.course;
const Tutor = db.tutor;
const createError = require('http-errors');

// Create and Save a new course
exports.create = async (req, res) => {
  
  try{
    if (!req.body.name) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
  //   if (!req.body.tutorCourses) {
  //     res.status(400).send({ message: "Content can not be empty!" });
  //     return;
  // }
      const course = new Course(req.body);
      await course.save()

      res.status(200).json({success:true, data:course})
  }catch(err){
      res.status(400).json({success:false, message:err.message})
  }
};

// Retrieve all course from the database.
exports.findAll = async(req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  Course.find(condition)
    .then(data => {
      // for( i = 0; i < data.length; i++ )
      // {
      //   var OwnerId = data[i].ownerId
      //   const Tutoruser = await Tutor.find({_id: OwnerId})
      //   var Ownerprofile = Tutoruser
      //   console.log(Ownerprofile[3])
      // }
      
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

// Find a single course with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Course.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Tutorial with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Tutorial with id=" + id });
    });
};

// Retrieve all course with single Tutor
exports.findCourse = async (req, res, next) =>{
  try{
    const id = req.params.id;
    const courseId = await Course.find({ownerId: id})
    if(!courseId) throw createError.Conflict("Wrong ID") 
    res.send(courseId)
  } 
  catch(err){
    next(err)
  }
}
// Update a course by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Course.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      } else res.send({ message: "Tutorial was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id
      });
    });
};

// Delete a course with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Course.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      } else {
        res.send({
          message: "Tutorial was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id
      });
    });
};

// Delete all course from the database.
exports.deleteAll = (req, res) => {
  Course.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Tutorials were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials."
      });
    });
};

