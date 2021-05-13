const dotenv = require('dotenv');
const createError = require('http-errors');
const { 
        signAccessToken,
        signRefreshToken,
        verifyRefreshToken } = require('../helpers/jwt_helper');
dotenv.config();
const db = require("../models");
const Tutor = db.tutor;
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
// Create and Save a new Tutor
exports.create = async(req, res, next) => {
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
      for (var i = 0; i < req.files.length; i++){
       tutor.profile.push(profileUrl + '/uploads/' + req.files[i].filename)
      }

      const cvUrl = req.protocol + "://" + req.get('host')
      for (var i = 0; i < req.files.length; i++){
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
      Transport.sendMail(mailOptions, function(error, response){
          if(error) {
              console.log(error);
          }else {
            res.send(tutor);
          }
      })
  }
  sendMail(tutor.email)    
  }catch (error) {
        next(error)
  }
};
// Find one tutor with courses
/*exports.findOne = (req, res) => {
  Tutor.findOne({_id: req.params.id})
  .populate("courses")
  .then(function(dbTutor){
    res.json(dbTutor);
  })
  .catch(function(err){
    res.json(err);
  });
};*/
// Find a single Tutor with an id
exports.findOne = async (req, res, next) => {
  try{
  const id = req.params.id;
  const Tutoruser = await Tutor.findById(id).populate({path: 'coursePublished'})
  let Data = Tutoruser
  Data.password = "#"
      if (!Data)
        res.status(404).send({ message: "Not found Tutorial with id " + id });
      else res.send(Data);
  }
  catch(err) {
      next(err)
    };
};
// Update a Tutor by the id in the request
exports.update = async(req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
    const ID = req.params.id;
    const result = await req.body
    const Tutoruser = await Tutor.findOne({ _id: ID})
    if(result.email) 
    {
      if(result.email == Tutoruser.email) return next(createError.NotFound('Email is already exist'))
      Tutoruser.email = result.email
      await Tutoruser.save()
    }
    if(result.fullName)
    {
      if(result.fullName == Tutoruser.fullName) return next(createError.NotFound('This name is already exist'))
      Tutoruser.fullName = result.fullName
      await Tutoruser.save() 
    }
    if(result.phoneNumber)
    {
      if(result.phoneNumber == Tutoruser.phoneNumber) return next(createError.NotFound('Phonenumber is already exist'))
      Tutoruser.phoneNumber = result.phoneNumber
      await Tutoruser.save()
    }
    if(result.password)
    {
      Tutoruser.password = result.password
      await Tutoruser.save()
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(Tutoruser.password, salt);
      Tutoruser.password = hashPassword;
      await Tutoruser.save()
    }
    if(result.expertises)
    {
      Tutoruser.expertises = result.expertises
      await Tutoruser.save()
    }
    if(result.tutoringDays)
    {
      Tutoruser.tutoringDays = result.tutoringDays
      await Tutoruser.save()
    }
    if(result.tutoringHours)
    {
      Tutoruser.tutoringHours = result.tutoringHours
      await Tutoruser.save()
    }
    if(result.aboutMe)
    {
      Tutoruser.aboutMe = result.aboutMe
      await Tutoruser.save()
    }
    if(result.gender)
    {
      Tutoruser.gender = result.gender
      await Tutoruser.save()
    }
    if(result.dateOfBirth)
    {
      Tutoruser.dateOfBirth = result.dateOfBirth
      await Tutoruser.save()
    }
    if(result.monthlyRate)
    {
      Tutoruser.monthlyRate = result.monthlyRate
      await Tutoruser.save()
    }
    if(result.achievement)
    {
      Tutoruser.achievement = result.achievement
      await Tutoruser.save()
    }
    if(result.profile)
    {
      Tutoruser.profile = result.profile
      await Tutoruser.save()
    }
    if(result.cv)
    {
      Tutoruser.cv = result.cv
      await Tutoruser.save()
    }
    res.send("Your update is successfully!")
  } catch (error) {
    next(error)
  }
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
// tutor Login Route
exports.TutorLogin = async(req, res, next) => {
  try{
      const result = req.body
      const Tutoruser = await Tutor.findOne({ email: result.email})
      if(!Tutoruser) return next(createError.NotFound('Email is not registered'))
      const validPassword = await bcrypt.compare(result.password, Tutoruser.password)
      if(!validPassword) return next(createError.Unauthorized('Email/Password not valid'))
      const role = "tutor"
      const userId = Tutoruser.id
      const expiresIn = "3600"
      const accessToken = await signAccessToken(Tutoruser.id)
        // const refreshToken = await signRefreshToken(Tutoruser.id)
        
      res.send({ accessToken, userId, expiresIn, role });
  }catch(error){
      next(error)
  }
};
// Tutor Refresh Token Route
exports.tutorRefreshToken = async(req, res, next) => {
  try{
      const{ refreshToken } = req.body
      if(!refreshToken) next(createError.BadRequest())
      const tutorId = await verifyRefreshToken(refreshToken)
      const accessToken = await signAccessToken(tutorId)
      const refToken = await signRefreshToken(tutorId)
      res.send({ accessToken: accessToken, refreshToken: refToken })
  }catch(error){
      next(error)
  }
};
