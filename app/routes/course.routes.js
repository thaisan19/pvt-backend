const db = require("../models/index.js");

module.exports = app => {
    const course = require("../controllers/course.controller.js");
  
    var router = require("express").Router();
  
    // Create a new course
    router.post("/create", course.create);

    
    // Retrieve all course
    router.get("/all", course.findAll);

    router.get("/ispublished", course.findIspublished);

    // Retrieve all course with single Tutor
    router.get("/find-course/:id", course.findCourse)
  
    // Retrieve a single course with id
    router.get("/find-one/:id", course.findOne);
  
    // Update a course with id
    router.put("/update/:id", course.update);
      
    // Delete a course with id
    router.delete("/delete/:id", course.delete);
  
    // Delete all courses
    router.delete("/", course.deleteAll);
  
    app.use('/api/course', router);
  };
