const db = require("../models");
const Course = db.course;
const Tutor = db.tutor;
const createError = require('http-errors');
const dotenv = require('dotenv');
dotenv.config();


// Create and Save a new course
exports.create = async (req, res, next) => {
  
  try{
    if (!req.body.name) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
  
      const course = new Course(req.body);
      const OwnerId = course.ownerId
      const Tutoruser = await Tutor.findOne({_id: OwnerId})

      if(Tutoruser.ownedCourses.length >= 5) {
        throw createError.Conflict("Out of Owned Courses Limit! Allow Only 5 Courses 🙏")}
      // {
      //   next(res.status(400).send({ message: "Out of Owned Courses Limit! Allow Only 5 Courses 🙏" }))
      // }

      course.published = false
      console.log(course)

      course.ownerProfile= Tutoruser.profile
      await course.save()

      course.published = false
      await course.save()

      Tutoruser.ownedCourses.push(course)
      await Tutoruser.save()

      res.status(200).json({success:true, data:course})
  }catch(err){
      res.status(400).json({success:false, message:err.message})
  }
};

// Retrieve all course from the database.
exports.findAll = async(req, res) => {

  const totalCourse = await Course.find({})
  const totalCourseLength = await totalCourse.length

  const getPagination = (page, size) => {

  var limit = size ? +size : totalCourseLength;
  var offset = page ? page * limit : 0;

  return { limit, offset };
};

  const { page, size, title } = req.query;
  
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  const { limit, offset } = getPagination(page, size);

  Course.paginate(condition, { offset, limit })
    .then (data => {
  
      res.send(data.docs);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

// recieve all unpublished course 
exports.findIspublished = async(req, res) => {
  try{
    Course.find({published: true})
    .then(data => {
      res.send(data)
    })
  }catch(error){
    res.send(error)
  }
  
}

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
exports.update = async(req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Course.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(async data => {
      

      if (!data) {
        res.status(404).send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      } else{
        
        const TutorId = data.ownerId
        const tutorUser = await Tutor.findOne({ _id: TutorId })
        const tutorCourse = tutorUser.ownedCourses
        
        const newList = []
        
        for(i = 0; i < tutorUser.ownedCourses.length; i++){
          const check_course_id = await tutorCourse[i]._id
          if(check_course_id == data.id){
            
            tutorCourse[i] = req.body
            
            newList.push(tutorCourse[i])
          }else{
            newList.push(tutorCourse[i])
          }
        }

        tutorUser.ownedCourses = newList
        console.log(tutorUser.ownedCourses)
        await tutorUser.save()
        res.send({ message: "Tutorial was updated successfully." });}

    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id
      });
    });
};

// Delete a course with the specified id in the request
exports.delete = async(req, res) => {
      const id = req.params.id;


  Course.findByIdAndRemove(id)
    .then( async data => {
      
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      } else {
      const TutorId = data.ownerId
      const findCourseInTutor = await Tutor.findOne({ _id: TutorId})
      const lengthCourseTutor = findCourseInTutor.ownedCourses
      const newList = []

      for ( i = 0; i < lengthCourseTutor.length; i++) {
        const check_id = await lengthCourseTutor[i]._id
        if(check_id != data.id){
          const getCourse = await Course.findOne({ _id: check_id})
          if(getCourse) newList.push(lengthCourseTutor[i])
        }
        
      }
      findCourseInTutor.ownedCourses = newList
      await findCourseInTutor.save()
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

