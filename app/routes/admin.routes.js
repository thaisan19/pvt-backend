module.exports = app => {
    const admin = require("../controllers/admin.controller.js");

    const { upload } = require("../helpers/multer")
  
    var router = require("express").Router();

    // Create a new Admin
    router.post("/register", admin.createAdmin);

    // Create a new Tutor
    router.post("/register-tutor",upload.array("files", 2), admin.createTutor);

    // Retrieve all Tutor
    router.get("/all", admin.findAll);

    router.post('/login', admin.adminLogin);

    // Retrieve all published Tutor
    router.get("/published", admin.findAllPublished);

    // Retrieve all unread Tutor
    router.get("/not-read", admin.findAllUnread);

    //update read to true
    router.put('/read-to-true/:id', admin.readToTrue)

    // Retrieve a single Tutor with id
    router.get("/find-tutor/:id", admin.findOne);

    // SendEmail
    router.put("/send-email", admin.sendEmail)

    // Update a Tutor with id
    router.put("/update/:id", admin.update);

    // Delete all Tutor
    router.delete("/delete-all", admin.deleteAll);

     // Delete a Tutor with id
     router.delete("/delete/:id", admin.delete);

    app.use('/api/admin', router);
}