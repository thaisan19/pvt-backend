module.exports = app => {
    const tutor = require("../controllers/tutor.controller.js");
    const { upload } = require("../helpers/multer")
  
    var router = require("express").Router();
  
    // Create a new Tutor
    router.post("/",upload.array("files", 2), tutor.create);

    // Retrieve a single Tutor with id
    router.get("/find-tutor/:id", tutor.findOne);
  
    // Update a Tutor with id
    router.put("/update/:id", tutor.update);
      
    // Delete a Tutor with id
    router.delete("/delete/:id", tutor.delete);

    //login route
    router.post('/login-tutor', tutor.TutorLogin);

    //refresh-token route
    router.post('/refresh-token', tutor.tutorRefreshToken);
  
    app.use('/api/tutor', router);

  };