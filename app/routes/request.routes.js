module.exports = app => {
    const request = require("../controllers/request.controller");
  
    var router = require("express").Router();
  
    // request course
    router.post("/make", request.makeRequest);

    // retrieve all request
    router.get("/get-reqs", request.findAllReqs);

    // retrieve a single request
    router.get("/get-req/:id", request.findOneReq);

    //find all unread request
    router.get("/unread", request.findAllUnread);

    //delete a single
    router.delete("/delete/:id", request.delete);

     //update by id
    router.put("/update/:id", request.update);

  
    app.use('/api/request', router);
  };