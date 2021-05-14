const db = require("../models");
const Request = db.request;
const nodemailer = require("nodemailer");

//create request
exports.course = async (req, res, next) => {
    try {
        const result = req.body
        const newRequest = new Request(result)
        const saveRequest = await newRequest.save()

        const sendMail = (email) => {
            var Transport = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: process.env.GMAIL,
                    pass: process.env.PASSWORD
                }
            });
            var mailOptions;
            let sender = "TheMentor";
            mailOptions = {
                from: sender,
                to: result.studentEmail,
                subject: `Greeting ${result.studentName} 🤗, your request has been arrived to the PRIVATE TUTORING team⚡`,
                html: `You have made a <b>${result.title}<b> of <b>${result.objName}<b>. <br>We will get back to you as soon as possible 💪🤘<br> Thank you for usong our services 🙏 <br>See you soon...`
            };
            Transport.sendMail(mailOptions, function(error, response){
                if(error) {
                    console.log(error);
                }else {
                  res.send("Request successed, please check your email 🙏")
                }
            })
        }
        sendMail(result.studentEmail)

        

    } catch (error) {
        next(error)
    }
}

// Retrieve all request from the database.
exports.findAllReqs = async (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  Request.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

// Find a single request with an id
exports.findOneReq = async(req, res) => {
  const id = req.params.id;

  try {
      const Requestdata = await Request.findOne({_id:id})
      res.status(200).json({success: true, Requestdata});
   } catch (err) {
      res.status(400).json({success: false, message:err.message});
   }
};

  // Find all unread request
exports.findAllUnread = (req, res) => {
    Request.find({ read: false })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Request."
        });
      });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Request.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
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

// Delete a request with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Request.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Request with id=${id}. Maybe the Request was not found!`
        });
      } else {
        res.send({
          message: "Request was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Request with id=" + id
      });
    });
};