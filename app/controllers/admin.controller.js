const db = require("../models");
const AdminUser = db.admin;
const Tutor = db.tutor;
const Request = db.request;
const dotenv = require('dotenv');
const createError = require('http-errors');
const bcrypt = require("bcrypt");
const generator = require('generate-password');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken } = require('../helpers/jwt_helper');
dotenv.config();
const nodemailer = require('nodemailer');
const { request } = require("../models");
exports.createAdmin = async (req, res, next) => {
  try {
    const result = req.body
    const doesExist = await AdminUser.findOne({ email: result.email });
    if (doesExist) throw createError.Conflict(`Your email ${result.email} is already been registered`)
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(result.password, salt);
    result.password = hashPassword;
    const role = "admin"
    result.role = role
    const newAdmin = new AdminUser(result)
    const savedAdmin = await newAdmin.save()
    const accessToken = await signAccessToken(savedAdmin.id)
    const refreshToken = await signRefreshToken(savedAdmin.id)
    res.send({ accessToken, refreshToken });
  } catch (error) {
    next(error)
  }
};
// Create and Save a new Tutor
exports.createTutor = async (req, res, next) => {
  try {
    // Create a Tutor
    const tutor = await new Tutor({
      fullName: req.body.fullName,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
      expertises: req.body.expertises,
      tutoringDays: req.body.tutoringDays,
      tutoringHours: req.body.tutoringHours,
      aboutMe: req.body.aboutMe,
      monthlyRate: req.body.monthlyRate,
      eduBackground: req.body.eduBackground,
      achievement: req.body.achievement,
      profile: req.files.profile,
      cv: req.files.cv
    })

    const profileUrl = req.protocol + "://" + req.get('host')
    for (var i = 0; i < req.files.length; i++) {
      tutor.profile.push(profileUrl + '/uploads/' + req.files[i].filename)
    }

    const cvUrl = req.protocol + "://" + req.get('host')
    for (var i = 0; i < req.files.length; i++) {
      tutor.cv.push(cvUrl + '/uploads/' + req.files[i].filename)
    }


    const role = "tutor"
    const read = false
    const published = false
    tutor.read = read
    tutor.published = published
    tutor.role = role
    // Save Tutor in the database
    const newTutor = new Tutor(tutor)
    const savedTutor = await newTutor.save()
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
        to: tutor.email,
        subject: "Register noted",
        html: `We will contact for interview soon.`
      };
      Transport.sendMail(mailOptions, function (error, response) {
        if (error) {
          console.log(error);
        } else {
          res.send(tutor);
        }
      })
    }
    sendMail(tutor.email)
  } catch (error) {
    next(error)
  }
};
// Retrieve all tutor from the database.
exports.findAll = async (req, res) => {
  try {
    const Tutoruser = await Tutor.find().populate({ path: 'coursePublished', select: 'title' });
    let Data = Tutoruser
    res.status(200).json({ success: true, Data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
// Find all published Tutor
exports.findAllPublished = (req, res) => {
  Tutor.find({ published: true })
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
// Find all unread Tutor
exports.findAllUnread = (req, res) => {
  Tutor.find({ read: false })
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
// Find a single Tutor with an id
exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.id;
    const Tutoruser = await Tutor.findById(id).populate({ path: 'coursePublished' })
    let Data = Tutoruser
    Data.password = "#"
    if (!Data)
      res.status(404).send({ message: "Not found Tutorial with id " + id });
    else res.send(Data);
  }
  catch (err) {
    next(err)
  };
};

//Update read to true
exports.readToTrue = async (req, res, next) => {
  try {
    const ID = req.params.id;
    const tutor = await Tutor.findOne({ _id: ID })
    tutor.read = true
    await tutor.save()
    res.send("Update read successfully")
  } catch (error) {
    next(error)
  }
}

exports.adminLogin = async (req, res, next) => {
  try {
    const result = req.body
    const Adminuser = await AdminUser.findOne({ email: result.email })
    if (!Adminuser) return next(createError.NotFound('Email is not registered'))

    const validPassword = await bcrypt.compare(result.password, Adminuser.password)
    if (!validPassword) return next(createError.Unfound('Email/Password not valid'))

    const expiresIn = "3600"
    const role = "admin"
    const userId = Adminuser.id
    const accessToken = await signAccessToken(Adminuser.id)
    // const refreshToken = await signRefreshToken(Adminuser.id)

    res.send({ accessToken, userId, expiresIn, role });

  } catch (error) {
    next(error)
  }
};

//SendEmail
exports.sendEmail = async (req, res, next) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
  try {
    var Newpassword = generator.generate({ length: 20, numbers: true, uppercase: true });
    const result = req.body
    const Tutoruser = await Tutor.findOne({ email: result.email })
    if (!Tutoruser) return next(createError.NotFound('Email is not registered'))
    Tutoruser.password = Newpassword
    Tutoruser.published = true
    await Tutoruser.save()
    if (!result) {
      res.status(404).send({
        message: `Please enter your gmail`
      });
    } else {
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
          to: result.email,
          subject: "Email confirmation",
          html: `This is your account email: ${result.email} <br> This your your account password: ${Tutoruser.password}<br> Press <a href=www.google.com> here </a> to verify your email.`
        };
        Transport.sendMail(mailOptions, function (error, response) {
          if (error) {
            console.log(error);
          } else {
            const encryptPassword = async (req, res, next) => {
              const salt = await bcrypt.genSalt(10);
              const hashPassword = await bcrypt.hash(Tutoruser.password, salt);
              Tutoruser.password = hashPassword;
              await Tutoruser.save()
            }
            encryptPassword()
          }
        })
      }
      sendMail(result.email)
      res.json({ message: "check to verify your Email!" })
    }
  }
  catch (err) {
    next(err)
  };
};

//Update single tutor password
exports.updatePassword = async (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      })
    }
    const ID = req.params.id;
    const result = await {
      password: req.body.password
    }
    const Tutoruser = await Tutor.findOne({ _id: ID })
    if (result.password) {
      Tutoruser.password = result.password

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(Tutoruser.password, salt);
      Tutoruser.password = hashPassword;

      await Tutoruser.save()
    }
   res.send("Your update is successfully!")
  } catch (error) {
    next(error)
  }
  
}

// Update a Tutor by the id in the request
exports.update = async (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
    const ID = req.params.id;
    const result = await {
      fullName: req.body.fullName,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
      expertises: req.body.expertises,
      tutoringDays: req.body.tutoringDays,
      tutoringHours: req.body.tutoringHours,
      aboutMe: req.body.aboutMe,
      monthlyRate: req.body.monthlyRate,
      eduBackground: req.body.eduBackground,
      achievement: req.body.achievement,
      profile: req.files.profile,
      cv: req.files.cv
    }

    const Tutoruser = await Tutor.findOne({ _id: ID })
    if (result.fullName) {
      Tutoruser.fullName = result.fullName
      await Tutoruser.save()
    }
    if (result.email) {
      Tutoruser.email = result.email
      await Tutoruser.save()
    }
    if (result.phoneNumber) {
      Tutoruser.phoneNumber = result.phoneNumber
      await Tutoruser.save()
    }
    if (result.expertises) {
      Tutoruser.expertises = result.expertises
      await Tutoruser.save()
    }
    if (result.tutoringDays) {
      Tutoruser.tutoringDays = result.tutoringDays
      await Tutoruser.save()
    }
    if (result.tutoringHours) {
      Tutoruser.tutoringHours = result.tutoringHours
      await Tutoruser.save()
    }
    if (result.aboutMe) {
      Tutoruser.aboutMe = result.aboutMe
      await Tutoruser.save()
    }
    if (result.gender) {
      Tutoruser.gender = result.gender
      await Tutoruser.save()
    }
    if (result.dateOfBirth) {
      Tutoruser.dateOfBirth = result.dateOfBirth
      await Tutoruser.save()
    }
    if (result.monthlyRate) {
      Tutoruser.monthlyRate = result.monthlyRate
      await Tutoruser.save()
    }
    if (result.achievement) {
      Tutoruser.achievement = result.achievement
      await Tutoruser.save()
    }
    if (result.eduBackground) {
      Tutoruser.eduBackground = result.eduBackground
      await Tutoruser.save()
    }
    if (result.profile) {
      Tutoruser.profile = result.profile

      const profileUrl = req.protocol + "://" + req.get('host')
      for (var i = 0; i < req.files.length; i++) {
        Tutoruser.profile.push(profileUrl + '/uploads/' + req.files[i].filename)
      }

      await Tutoruser.save()
    }
    if (result.cv) {
      Tutoruser.cv = result.cv

      const cvUrl = req.protocol + "://" + req.get('host')
      for (var i = 0; i < req.files.length; i++) {
        Tutoruser.cv.push(cvUrl + '/uploads/' + req.files[i].filename)
      }

      await Tutoruser.save()
    }
    res.send("Your update is successfully!")
  } catch (error) {
    next(error)
  }
};
// Delete all Tutor from the database.
exports.deleteAll = (req, res) => {
  Tutor.deleteMany({})
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
// Delete a Tutor with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Tutor.findByIdAndRemove(id)
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
// Send email to student
exports.post = async (req, res, next) => {
  try {
    const ID = req.params.id;
    const requestByStudent = await Request.findOne({ _id: ID })
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
        to: requestByStudent.email,
        subject: requestByStudent.reqTitle,
        html: `Hello ${requestByStudent.name}, your request had been approved. Your tutor will contact you soon.`
      };
      Transport.sendMail(mailOptions, function (error, response) {
        if (error) {
          console.log(error);
        } else {
          res.json({ message: "Email sent" })
        }
      })
    }
    sendMail(requestByStudent.email)
  }
  catch (error) {
    next(error)
  }
};