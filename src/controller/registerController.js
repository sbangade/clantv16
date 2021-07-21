import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from '../config/keys';
import moment from 'moment';
import fs from 'fs';
import mime from 'mime';
import nodemailer from 'nodemailer';
//var nodemailer = require('nodemailer');
//import upload from '../middleware/upload';
//import requireLogin from '../middleware/requireLogin';
// const jwt = require('jsonwebtoken')
// const {JWT_SECRET} = require('../config/keys')
// const requireLogin = require('../middleware/requireLogin')
import { RegistersSchema, PilotSchema, passengerSchema } from '../models/registerModel';
import fcm from 'fcm-notification';
import { admin } from '../firebase/firebase-config';
import serviceAccount from '../firebase/clanit-e903d-firebase-adminsdk-wnrln-95e51dd8ee.json'; 

import express from 'express';
import bodyParser, { json } from 'body-parser';
//const express = require('express');
const app = express();
//const bodyParser = require('body-parser');
//const fs = require('fs');
//const mime = require('mime');
app.use(bodyParser.urlencoded({ extended: false }));
 app.use(bodyParser.json());

import { Console } from 'console';
import { Long } from 'mongodb';
const FcM = new fcm(serviceAccount);


const Register = mongoose.model('Register', RegistersSchema);
const Passenger = mongoose.model('Passenger', passengerSchema);
const Pilot = mongoose.model('Pilot', PilotSchema);

//var Token = "abc";
export const uploadImage = async (req, res, next) => {
  // to declare some path to store your converted image
  var matches = req.body.base64image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/),
  response = {};
   
  if (matches.length !== 3) {
  return new Error('Invalid input string');
  }
   
  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');
  let decodedImg = response;
  let imageBuffer = decodedImg.data;
  let type = decodedImg.type;
  let extension = mime.extension(type);
  let fileName = "image." + extension;
  try {
  fs.writeFileSync("./images/" + fileName, imageBuffer, 'utf8');
  return res.send({"status":"success"});
  } catch (e) {
  next(e);
  }
  }


export const addnewRegister = (req, res, next) => {
  


    let newRegister = new Register(req.body);
    const mail = req.body.email;
    const fname = req.body.first_name;
    const lname = req.body.last_name;
    const birth = req.body.dob;
    const driver_pass = req.body.is_driver_or_passenger;
    const mbile = req.body.mobile;
    const pass = req.body.password;

    //console.log('mail',mail)
    if(mail == '' || mail == undefined){
      return res.status(401).json({
        message: "Please Enter Your Email Address"
      });
    }if(pass == '' || pass == undefined){
      return res.status(401).json({
        message: "Please Enter Your Password"
      });
    }
    if(fname == '' || fname == undefined){
      return res.status(401).json({
        message: "Please Enter Your First Name"
      });
    }
    if(lname == '' || lname == undefined){
      return res.status(401).json({
        message: "Please Enter Your Last Name"
      });
    }
    if(birth == '' || birth == undefined){
      return res.status(401).json({
        message: "Please Enter Your Birth Date"
      });
    }
    if(driver_pass == '' || driver_pass == undefined){
      return res.status(401).json({
        message: "Please decide driver or passenger"
      });
    }
    if(mbile == '' || mbile == undefined){
      return res.status(401).json({
        message: "Please Enter Your Mobile number"
      });
    }
    else{
   // if(req.body.Email.length > 1){
    Register.find({ email: mail })
    .exec()
    .then(user => {
      if (user.length < 1) {
        // to declare some path to store your converted image

          // if(req.file){
          //   newRegister.Image = req.file.path
          // }
        newRegister.save();
        return res.status(201).json({
          message: "Registered Seccessfully"
        });
      
      
        
       // return res.status(200).json({
         // message: "Registered successfully!"
        //});
        // var matches = req.body.image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/),
        // response = {};
         
        // if (matches.length !== 3) {
        // return new Error('Invalid input string');
        // }
         
        // response.type = matches[1];
        // response.data = new Buffer(matches[2], 'base64');
        // let decodedImg = response;
        // let imageBuffer = decodedImg.data;
        // let type = decodedImg.type;
        // let extension = mime.extension(type);
        // let fileName = "image." + extension;
        // try {
        // fs.writeFileSync("./images/" + fileName, imageBuffer, 'utf8');
        // // return res.status(200).json({
        // //   message: "Registered successfully!"
        // // });
        // } 
        // catch (e) {
        // next(e);
        // }
      }else{
        return res.status(401).json({
          message: "Email already exist."
        });
      }
    });
  } 

  
}

// Edit User Profile
export const updateUserProfile = async (req, res) => {
 
    const fname = req.body.first_name;
    const lname = req.body.last_name;
    const birth = req.body.dob;
    const dr_ps = req.body.is_driver_or_passenger;
    const pic = req.body.image;
    const cell = req.body.mobile;
    const sex = req.body.gender;
    const car_desc = req.body.car_details;
    Register.findOneAndUpdate( { token: req.body.token},  {
      $set: {
            first_name : fname,
            last_name: lname,
            dob : birth,
            is_driver_or_passenger: dr_ps,
            image : pic, 
            mobile : cell, 
            gender : sex, 
            car_details : car_desc
      },
    }, { new: true }, (err, product) => {
          if (err) {
              res.send(err);
          }
             return res.status(201).json({
            message: "Profile Updated Successfully!"
        });
      });
  
}  
// Resend email
export const emailResend = async (req, res) => { 
  let mail = req.query.email 
  let password = Math.random() * (1000000 - 100000) + 100000;
  password = Math.ceil(password);
  console.log('password - ', password)

  //password = password.toString();
//   Register.findOneAndUpdate({email: mail }, { $set:
//     {
//       everification: password
      
//     }
//  })
// const data = Register.findOne( mail )
// console.log('data ', data)
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'c0773230project@gmail.com',
      pass: 'C0773230@'
    }
  });
  
  var mailOptions = {
    from: 'c0773230project@gmail.com',
    to: mail,
    subject: 'Try',
    text: 'Your email verification code: '+password
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      Register.findOneAndUpdate( { email: mail},  {
        $set: {
          everification : password
        },
      }, { new: true }, (err, product) => {
            if (err) {
                res.send(err);
            }
               return res.status(201).json({
              message: "Email Sent Successfully!"
          });
        });
      //console.log('Email sent: ' + info.response);
      // return res.status(201).json({
      //   message: "Email Sent Successfully!"
      // });
    }
  });


}
  //password = password.toString();
//   Register.findOneAndUpdate({email: mail }, { $set:
//     {
//       everification: password
      
//     }
//  })
// const data = Register.findOne( mail )
// console.log('data ', data)
 
  

/// Email verification
export const emailVeriication = async (req, res) => { 
  let mail = req.query.email
  let code = req.query.code
  const tkn = await Register.findOne({ email: req.query.email })
  if(code == tkn.everification){
    // return res.status(201).json({
    //   message: "Email verified successfully"
    // });
    Register.findOneAndUpdate( { email: mail},  {
      $set: {
        emailverified : true
      },
    }, { new: true }, (err, product) => {
          if (err) {
              res.send(err);
          }
          return res.status(201).json({
            message: "Email verified successfully"
          });
        //      return res.status(201).json({
        //     message: "Email Sent Successfully!"
        // });
      });
  }else{
    return res.status(201).json({
      message: "Email verification failed"
    });
  }
  
}
  

export const getRegister = async (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    const rlist = await Register.find().limit(limit * 1).skip((page - 1) * limit)
    res.send(rlist); 
     //=> {
    //     if (err) {
    //         res.send(err);
    //     }
    //     //requireLogin(req, res);
    //     res.send(register);
    //     //res.json(register);
    // });
}
//tokenGenerator
export const tokenGenerator = (req, res, next) => {
  //const data = Register.find({ Email: req.body.Email })
  Register.find({ email: req.body.email })
  .exec()
  .then(user => {
    if (user.length < 1) {
      return res.status(401).json({
        message: "Wrong Username"
      });
    }else{
      Register.find({ password: req.body.password })
      .exec()
      .then(user => {
          if (user.length < 1) {
            return res.status(401).json({
              message: "Wrong Password"
            });
          }else{
            const token = jwt.sign({_id:user._id},JWT_SECRET)
            const ftoken = req.body.ftoken;
        
            //console.log(Token);
            
             Register.findOneAndUpdate({email: req.body.email }, { $set:
              {
                token: token,
                fcm_token: ftoken
              }
           },
          null, function (err, docs, next) {
    if (err){
        console.log(err)
    }
    else{
      ///////////
      res.status(200).json({
        message: "FCMtoken: ",ftoken
      });
      const tokken = docs.token;
    }
  });
}
  });
}
      });  
}
export const userLogin = (req, res, next) => {
    //const data = Register.find({ Email: req.body.Email })
    Register.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Wrong Username"
        });
      }else{
        Register.find({ password: req.body.password })
        .exec()
        .then(user => {
            if (user.length < 1) {
              return res.status(401).json({
                message: "Wrong Password"
              });
            }else{
            const token = jwt.sign({_id:user._id},JWT_SECRET)
            const f_token = req.body.ftoken;
        
            //console.log(Token);
            
             Register.findOneAndUpdate({email: req.body.email }, { $set:
              {
                token: token,
                fcm_token: f_token 
              }
           },
          null, function (err, docs, next) {
    if (err){
        console.log(err)
    }
    else{
      ///////////
      const tokken = docs.token;
      //console.log(tokken);
      const is_driver = docs.is_driver_or_passenger;
      const { page = 1, limit = 5 } = req.query;
      if(is_driver == true){
        var jsonToSend = [];

 Register
   .findOne({ email: req.body.email })
   .populate("history",{ token: 0 }) // key to populate
   .then(user => {
     const user_history = user.history;
     //console.log('user_history',user_history);
     var myname;
     if(user_history == ''){
      res.status(200).json(
        {
            token,
            is_driver
        }
    )
     }else{
      fun_for_loop(user_history)


      async function fun_for_loop(user_history) {
    
          var index = 0
          for (var element of user_history){
            index++
    
            let temp = element.poster;
            
            var value = await Register
            .findOne(temp)
            .select('first_name last_name image mobile')
            
            var jsonObject = JSON.parse("{}")
            jsonObject.is_trip_completed = element.is_trip_completed
            jsonObject.got_driver = element.got_driver
            jsonObject.trip_cancel = element.trip_cancel
            jsonObject.post_id = element._id
            jsonObject.pick_up = element.pick_up
            jsonObject.drop_off = element.drop_off
            jsonObject.time = element.time
            jsonObject.description = element.description
            
            jsonObject.first_name_passenger = value.first_name
            jsonObject.last_name_passenger = value.last_name
            jsonObject.image_passenger = value.image
            jsonObject.mobile_passenger = value.mobile
    
          
    
          jsonToSend.push(jsonObject) 
    
               if (index == user_history.length) { 
                funName(jsonToSend, token, is_driver); 
      
        // res.status(200).json(
        //   jsonToSend);
               }
               function funName(list, token, is_driver) {

                  res.status(200).json({
                    list,
                    token,
                    is_driver   
                  });}
          }
       }

// user_history.forEach(async (element, index, array) => {

//       let temp = element.poster;
//       var value = await Register.findOne(temp).select('FirstName LastName Image Mobile')

//       var jsonObject = JSON.parse("{}")


//       jsonObject.is_trip_completed = element.is_trip_completed
//       jsonObject.post_id = element._id
//       jsonObject.pick_up = element.pick_up
//       jsonObject.drop_off = element.drop_off
//       jsonObject.time = element.time
//       jsonObject.description = element.description
//       jsonObject.first_name_passenger = value.first_name
//       jsonObject.last_name_Passenger = value.last_name
//       jsonObject.image_passenger = value.image
//       jsonObject.mobile_passenger = value.mobile
//       //jsonObject.Token = Token
//       //jsonObject.is_driver = is_driver

//       jsonToSend.push(jsonObject)

//          if (index == array.length - 1) {
          
//              funName(jsonToSend, token, is_driver);
//          }
// });
// function funName(list, token, is_driver) {

//   res.status(200).json({
//     list,
//     token,
//     is_driver   
//   });
//  }
}
    });
  //       Register
  //  .findOne({_id: docs._id })
  //  .populate("plist",{ Token: 0, poster: 0 }).limit(limit * 1).skip((page - 1) * limit) // key to populate
  //  .then(user => {
  //    const list = user.plist;
  //   res.status(200).json(
  //     {
  //       list,
  //       Token,
  //       is_driver
  //     }
  // )
  //  });
  }
   else{
    Register
    .findOne({_id: docs._id })
    .populate("plist",{ token: 0, poster: 0}).limit(limit * 1).skip((page - 1) * limit) // key to populate
    .then(user => {
      const list = user.plist;
     res.status(200).json(
       {
           list,
           token,
           is_driver
       }
   )
    });
   }
      
      ///////////
      }      
      
    
});
    
            }
   
      });
      }
    });
}
export const driverHistory = async (req, res) => { 
  const tkn = await Register.findOne({ token: req.body.token })
  console.log(tkn._id);
  const checker = tkn.is_driver_or_passenger;
  console.log(checker);
  const { page = 1, limit = 5 } = req.query;
    Register
   .findOne({_id: tkn._id })
   .populate("favlist",{ token: 0, myfavorite: 0, _id: 0 }).limit(limit * 1).skip((page - 1) * limit) // key to populate
   .then(user => {
     const driver_list = user.favlist;
    res.status(200).json(
        driver_list  
  )
   });
}
//{ "find_passenger": { $eq: true }
export const liveDriver = async (req, res) => { 
  var jsonToSend = [];
  await Pilot.find({  $and: [
    // { $text: { $search: "sarnia" } }
   {find_passenger: true},
   {locality: /sarnia/i}
 
 ] },(err, login) => {
         if (err) {
             res.send(err);
         }
         //res.json(login);
         fun_for_loop(login)
         async function fun_for_loop(login) {
       
             var index = 0
             for (var element of login){
               index++
       
               let temp = element.token;

               console.log('Token', temp)
            //    var myobj = JSON.parse(JSON.stringify({
            //     temp
            // }));
            // console.log('object',...myobj);
               
               var value = await Register
               .findOne({token: temp})
               .select('first_name last_name image mobile')
              //  let arr = [];
              //  arr.push(value); 
               console.log('Value - ',value)
               //var index;
              //  for(let a = 0; a < arr.length; a++){
              //    //index++;
              //    if( arr[a] == null){
              //      console.log('Null value')
              //    }else{
                  var jsonObject = JSON.parse("{}")
               
                  jsonObject.is_trip_completed = element.is_trip_completed
                  jsonObject.trip_cancel = element.trip_cancel
                  jsonObject.post_id = element._id
                  jsonObject.locality = element.locality
                  jsonObject.ride_type = element.ride_type
                  
                  jsonObject.first_name_passenger = value.first_name
                  jsonObject.last_name_passenger = value.last_name
                  jsonObject.image_passenger = value.image
                  jsonObject.mobile_passenger = value.mobile
                  
          
                
          
                jsonToSend.push(jsonObject) 
          
                     if (index == login.length) {  
            
              res.status(200).json(
                jsonToSend);
                     }
                    //  res.status(200).json(
                    //   jsonToSend);

                 //}
                //}
               
               
         
             }
          }
     });
}

// Get Passengers History
export const passengerHistory = async (req, res) => { 
  
  const tkn = await Register.findOne({ token: req.query.token })
  
  var jsonToSend = [];
  
    Register
   .findOne({_id: tkn._id })
   .populate({ 
    path: 'plist', 
    options: { sort: { time : -1 } } 
  }) // key to populate
   .then(user => {
     const passenger_list = user.plist;
     
     if(passenger_list == ''){
       res.send('No History - 0 Posts')
     }
     else{
       fun_for_loop(passenger_list)


  async function fun_for_loop(passenger_list) {

      var index = 0
      for (var element of passenger_list){
        index++

        let temp = element.drivers;
        console.log('Temp', temp)
        var value = await Register
        .findOne(temp)
        .select('first_name last_name image mobile')
        
        var jsonObject = JSON.parse("{}")
        jsonObject.is_trip_completed = element.is_trip_completed
        jsonObject.got_driver = element.got_driver
        jsonObject.trip_cancel = element.trip_cancel
        jsonObject.post_id = element._id
        jsonObject.pick_up = element.pick_up
        jsonObject.drop_off = element.drop_off
        jsonObject.time = element.time
        jsonObject.description = element.description
        if(temp != undefined) {
        jsonObject.first_name_passenger = value.first_name
        jsonObject.last_name_passenger = value.last_name
        jsonObject.image_passenger = value.image
        jsonObject.mobile_passenger = value.mobile

      }

      jsonToSend.push(jsonObject) 

           if (index == passenger_list.length) {  
  
    res.status(200).json(
      jsonToSend);
           }
      }
   }
  }
   });
}



// Get user's profile by ID
export const getUserProfile = async (req, res) => {
  const postid = await Register.findOne({ token: req.query.token },{"_id":0,"plist": 0,"favlist": 0, "history": 0,"password": 0, "fcm_token":0, "token": 0})
  //res.send(postid);
  res.status(200).json(postid);


    //     if (err) {
    //         res.send(err);
    //     }
        
    //     res.json(product);
    // });
}

export const sendEmail = (req, res) => {
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'c0773230project@gmail.com',
    pass: 'C0773230@'
  }
});

var mailOptions = {
  from: 'c0773230project@gmail.com',
  to: 'sbangade1995@gmail.com',
  subject: 'Try',
  text: `Welcome to Kaliron's Clanit app`
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    //console.log('Email sent: ' + info.response);
    return res.status(201).json({
      message: "Email Sent Successfully!"
    });
  }
});
}


export const getEmail = async (req, res) => {
    await Register.find({ email: req.body.email })
    .exec()
    .then(user => {
      
      if (user.length < 1) {
        return res.status(401).json({
          message: "Email doesnt exist."
        });
      }else{
        // return res.status(201).json({
        //     message: "Login Successfully"
        //   });
        //var STRING = user.toString();
        const obj = {...user};
        const Password = obj[0].password;
        const Token = obj[0].token;
        const Emailaddress = obj[0].email;
        //console.log('password - ',Password, Token, Emailaddress)
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'c0773230project@gmail.com',
            pass: 'C0773230@'
          }
        });
        
        var mailOptions = {
          from: 'c0773230project@gmail.com',
          to: Emailaddress,
          subject: 'Try',
          text: 'Here is your login credentials \n Password: '+Password+'\n Email: '+Emailaddress+'\n Token: '+Token
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            //console.log('Email sent: ' + info.response);
            return res.status(201).json({
              message: "Email Sent Successfully!"
            });
          }
        });
            }
        });
      }
//let ra      
export const onlinePilot = async (req, res, next) => {
  const tchecker = req.body.token;
  const finding = req.body.find_passenger;
  
 
  if(tchecker == '' || tchecker == undefined){
    return res.status(401).json({
      message: "Please enter your token"
    });
  }   
  if( finding == '' || finding == undefined){
    return res.status(401).json({
      message: "Please Enter Locality"
    });
  }
  else{
    await Pilot.findOneAndUpdate( {token: tchecker},  {
      $set: {
        find_passenger : finding
      },
    }, { new: true });
    //const data = Pilot.findOne({ token: tchecker})
    var value = await Pilot
    .findOne({token: tchecker})
    console.log('data', value);
    if( value.find_passenger == true){
    return res.status(201).json({
      message: "Finding Passengers for you..."
    }); 
  }else{
    res.send('')
  }
  }
}

// Driver posting
export const addDriver = async (req, res, next) => {
  const tchecker = req.body.token;
  const local = req.body.locality;
  const ridetype = req.body.ride_type;
 
  if(tchecker == '' || tchecker == undefined){
    return res.status(401).json({
      message: "Please enter your token"
    });
  }   
  if( local == '' || local == undefined){
    return res.status(401).json({
      message: "Please Enter Locality"
    });
  }
  if(ridetype == '' || ridetype == undefined){
    return res.status(401).json({
      message: "Please enter your ride type"
    });
  }
  else{
    console.log('tchecker ',tchecker)
  const tkn = await Register.findOne({ token: tchecker })
  
   console.log('entry - ',tkn); 
  const newPlace = new Pilot(req.body);
  //await newPlace.save();
  //console.log(newPlace);
  //const data = requireLogin();
  
  const user = await Register.findById(tkn._id);
  
  console.log('driver post', user.favlist);
  if(user.favlist == [] || user.favlist == ''){
    newPlace.myfavorite = user; //myfavorite
    await newPlace.save();
    user.favlist.push(newPlace);
  }
  //
  else{
    const drtoken = user.favlist;
    const newtoken = "'"+drtoken+"'";
    //console.log('postID', newtoken);

 
await Pilot.findOneAndUpdate( {_id: drtoken},  {
      $set: {
        find_passenger : req.body.find_passenger,
        locality : local,
        ride_type :ridetype,
        is_trip_completed :req.body.is_trip_completed,
        trip_cancel :req.body.trip_cancel
      },
    }, { new: true });


  }
  
  //const locality = req.body.locality
  //var dateTimeTofilter = moment().subtract(1, 'year');
 // var currentdate = new Date();
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time; 
  //console.log('Datetime ',dateTime);
  await user.save();
  var jsonToSend = [];
  
  await Passenger.find(
        {
          $and: [{$or:[
          {pick_up: /sarnia/i},
          {drop_off: /sarnia/i}
        
        ]},
        {
          time: { $gte: dateTime}
        },
      {
        got_driver: false
      },{
        passenger_cancel: false
      }
      ]
      },(err, login) => {
             if (err) {
                 res.send(err);
             }
             fun_for_loop(login)


             async function fun_for_loop(login) {
           
                 var index = 0
                 for (var element of login){
                   index++
           
                   let temp = element.poster;
                   
                   var value = await Register
                   .findOne(temp)
                   .select('first_name last_name image mobile')
                   
                   var jsonObject = JSON.parse("{}")
                   jsonObject.is_trip_completed = element.is_trip_completed
                   jsonObject.got_driver = element.got_driver
                   jsonObject.post_id = element._id
                   jsonObject.pick_up = element.pick_up
                   jsonObject.drop_off = element.drop_off
                   jsonObject.time = element.time
                   jsonObject.description = element.description
                   if(temp != undefined) {
                   jsonObject.first_name_passenger = value.first_name
                   jsonObject.last_name_passenger = value.last_name
                   jsonObject.image_passenger = value.image
                   jsonObject.mobile_passenger = value.mobile
           
                 }
           
                 jsonToSend.push(jsonObject) 
           
                      if (index == login.length) {  
             
               res.status(200).json(
                 jsonToSend);
                      }
                 }
              }
             //res.json(login);
        //      login.forEach(async (element, index, array) => {

        //       let temp = element.poster;
        //       var value = await Register.findOne(temp).select('first_name last_name image mobile')
        
        //       var jsonObject = JSON.parse("{}")
        
        
        //       jsonObject.is_trip_completed = element.is_trip_completed
        //       jsonObject.post_id = element._id
        //       jsonObject.pick_up = element.pick_up
        //       jsonObject.drop_off = element.drop_off
        //       jsonObject.time = element.time
        //       jsonObject.description = element.description
        //       jsonObject.first_name_passenger = value.first_name
        //       jsonObject.last_name_passenger = value.last_name
        //       jsonObject.image_passenger = value.image
        //       jsonObject.mobile_passenger = value.mobile
        
        //       jsonToSend.push(jsonObject)
        
        //          if (index == array.length - 1) {
        //              funName(jsonToSend);
        //          }
        // });
        // //console.log(jsonToSend);
        // function funName(jsonToSend) {
        //  // const isEmpty = jsonToSend.length;
        //   //console.log('jsonToSend',isEmpty)
        //  // var isEmpty = jsonToSend.length;
        //  // console.log('empty',isEmpty )
        //   //console.log('checking', jsonToSend.length)
        //   //const decider = jsonToSend.length;
        //   //console.log('hecking', decider);
        //   if(jsonToSend.length > 0){
        //     return res.status(200).json(
        //       jsonToSend
        //       );
        //   }else{
        //     //console.log('Emptybhai');
        //     return res.status(201).json({
        //       message: "No Passengers Postings"
        //     });
        //   }
        //  }
         }).sort({
          time: 1
      });
        }
  // let newDriver = new Pilot(req.body);
  // newDriver.save((err, driver) => {
  //     if (err) {
  //         res.send(err);
  //     }
  //     Passenger.find({},{"_id":0},(err, login) => {
  //         if (err) {
  //             res.send(err);
  //         }
  //         res.json(login);
  //     });
  //     //  res.json(driver);
  // });
       
    
    }

export const confirmBooking = async (req, res, next) => {
  const postid = await Passenger.findOne({ _id: req.query.poster })
  //console.log(postid.poster);
  const tokenn = await Register.findOne({ token: req.query.token })
  //console.log('token ', tokenn._id);
  const drvr = await Register.findOne({ _id: postid.poster },{"first_name":1,"last_name":1,"image":1});
  //console.log('new',drvr._id);
  const jsonToSend = JSON.parse(JSON.stringify(postid))
  const jsonDrvr = JSON.parse(JSON.stringify(drvr))
  jsonToSend._id = jsonDrvr._id
  jsonToSend._first_name = jsonDrvr._first_name
  //var upost = JSON.stringify(postid)
  //var drinfo = JSON.stringify(tokenn)
  //console.log(tokenn);
               //const {placeID} = req.params;
  //const data = await Register.findOne({Token: tkn});
  //console.log(data._id); 
               //const newPlace = new Pilot(req.body);
  //console.log(newPlace);
  //const data = requireLogin();
  
  //////new
  const user = await Register.findById(tokenn._id);
  const driveR = await Register.findById(postid.poster);
  //console.log('drive',driveR);
  //console.log(user);
  // newPlace.myfavorite = user; //myfavorite
  // await newPlace.save();
  const passData = await Passenger.findOne({_id: postid._id})
  const availability = passData.got_driver;
  console.log('availability - ',availability)
  if(availability == true){
    res.status(200).json({
      message: "This ride has already been booked."
    });
  }else{
  user.history.push(tokenn,postid);

  //user.history.push(postid);
  //console.log("req.body.poster", req.body.poster);
  //console.log("postid", postid);
  //console.log("postid._id", postid._id);
Passenger.findOneAndUpdate({_id: postid._id}, { $set:
              {
                trip_cancel: false,
                got_driver: true,
                drivers: tokenn._id
              }}, null, function(err,doc) {
           if (err) { throw err; }
           else { console.log("Updated"); }
         }); 


  await user.save();
  console.log('fcm ',driveR.fcm_token)

  if( driveR.fcm_token == null || driveR.fcm_token == undefined || driveR.fcm_token == ""){
    res.status(200).json({
      message: " Bokking Confirmerd but FCM Token Is Null"
    });
   }
   else{
  const registrationToken = driveR.fcm_token;
//   module.exports.sendToSingleUser = async (message, token) => {
//     let message_body = {
//         notification: {
//           score: ''+postid+'',
//           passenger: ''+drvr+''
//         },
//         token: registrationToken
//     };
//     FcM.send(message_body, function (err, response) {
//         if (err) {
//           console.log('Error', err);
//         } else {
//           console.log('Successfully sent message:', response);
//         }
//     })

// }
// j: ''+jsonToSend
const message = {
  data: {
    data: ''+JSON.stringify(postid)+'',
    driver: ''+JSON.stringify(drvr)+'',
    type: 'Booking Confirmed'
  },
  token: registrationToken
};

// Send a message to the device corresponding to the provided
// registration token.
admin.messaging().send(message)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });

  res.status(200).json({
    message: "Booking Confirmed"
  });
}
}

  
  // await Passenger.find({},{"_id":0},(err, login) => {
  //            if (err) {
  //                res.send(err);
  //            }
  //            res.json(login);
  //        });       
    } 

    
// Booking Cancellation
export const bookingCancellation = async (req, res, next) => {
  const postid = await Passenger.findOne({ _id: req.query.poster })
  //const drpost = await Pilot.findOne({ _id: req.query.driverpost })
  console.log('poster',postid.poster);
  const tokenn = await Register.findOne({ token: req.query.token },{"first_name":1,"last_name":1});
  const drvr = await Register.findOne({ _id: postid.poster },{"first_name":1,"last_name":1,"image":1});
  console.log('new data', postid.token);
  const newdata = postid.token;
  let oppid = 0;
  let checker = false;
  if( newdata == req.query.token){
    console.log('driver',postid.drivers)
    oppid = postid.drivers;
    checker = true;
  }else{
    console.log('passenger',postid.poster)
    oppid = postid.poster;
    checker = false;
  }
  console.log('opposition', oppid, checker);
  //console.log(tokenn);
               //const {placeID} = req.params;
  //const data = await Register.findOne({Token: tkn});
  //console.log(data._id); 
               //const newPlace = new Pilot(req.body);
  //console.log(newPlace);
  //const data = requireLogin();
  
  //////new
  //const user = await Register.findById(tokenn._id);
  
  //console.log('drive',driveR.fcm_token);
  //console.log(user);
  // newPlace.myfavorite = user; //myfavorite
  // await newPlace.save();
 // const cancellation = user.history.filter(x => {
  //   return x.id != postid;
  // })
  // Register.findOneAndUpdate(
  //   {_id: tokenn._id},
  //   { $pull: { history: { _id: postid._id } } }, // Here , id is variable where your userid is stored
  //   { multi: true }
  // )
  
  // user.history.remove(postid);
  //console.log("req.body.poster", req.body.poster);
  //console.log("postid", postid);
  //console.log("postid._id", postid._id);
// Passenger.findOneAndUpdate({_id: postid._id}, { $set:
//               {
//                 trip_cancel: true,
//                 got_driver: false,
//                 passenger_cancel: checker
//               }}, null, function(err,doc) {
//            if (err) { throw err; }
//            else { console.log("Updated"); }
//          }); 
    //      Pilot.findOneAndUpdate({_id: drpost._id}, { $set:
    //       {
    //         trip_cancel: true
    //         //got_driver: false,
    //         //drivers: tokenn._id
    //       }}, null, function(err,doc) {
    //    if (err) { throw err; }
    //    else { console.log("Updated"); }
    //  });
    const driveR = await Register.findById(oppid); 
    console.log('fcm token ', driveR);
  //  const driveR = await Register.findById(oppid);
    if( driveR.got_driver == false || driveR.fcm_token == null || driveR.fcm_token == undefined || driveR.fcm_token == "" ){
      res.status(200).json({
        message: "Booking Cancelled"
      });
    }else{ 
     
      
  //await user.save();
  const registrationToken = driveR.fcm_token;

const message = {
  data: {
    data: ''+JSON.stringify(postid)+'',
    user: ''+JSON.stringify(drvr)+'',
    type: 'Booking Cancelled'
  },
  token: registrationToken
};

// Send a message to the device corresponding to the provided
// registration token.
admin.messaging().send(message)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });

  res.status(200).json({
    message: "Booking Cancelled"
  });

    }
    Passenger.findOneAndUpdate({_id: postid._id}, { $set:
      {
        trip_cancel: true,
        got_driver: false,
        passenger_cancel: checker
      }}, null, function(err,doc) {
   if (err) { throw err; }
   else { console.log("Updated"); }
 });    
  
  // await Passenger.find({},{"_id":0},(err, login) => {
  //            if (err) {
  //                res.send(err);
  //            }
  //            res.json(login);
  //        });       
    }     

//passenger calcelling trip  

// export const passengerCancellation = async (req, res, next) => {
//   //const postid = await Pilot.findOne({ _id: req.query.driverpost })
//   const passid = await Passenger.findOne({ _id: req.query.poster })
//   //console.log('poster',postid.myfavorite);
//   const tokenn = await Register.findOne({ token: req.query.token },{"first_name":1,"last_name":1})
//   const drvr = await Register.findOne({ _id: passid.drivers },{"first_name":1,"last_name":1,"image":1});
//   console.log('new',drvr);
//   //console.log(tokenn);
//                //const {placeID} = req.params;
//   //const data = await Register.findOne({Token: tkn});
//   //console.log(data._id); 
//                //const newPlace = new Pilot(req.body);
//   //console.log(newPlace);
//   //const data = requireLogin();
  
//   //////new
//   //const user = await Register.findById(tokenn._id);
//   const driveR = await Register.findById(passid.drivers);
//   console.log('drive',driveR.fcm_token);
//   //console.log(user);
//   // newPlace.myfavorite = user; //myfavorite
//   // await newPlace.save();
//  // const cancellation = user.history.filter(x => {
//   //   return x.id != postid;
//   // })
//   // Register.findOneAndUpdate(
//   //   {_id: tokenn._id},
//   //   { $pull: { history: { _id: postid._id } } }, // Here , id is variable where your userid is stored
//   //   { multi: true }
//   // )
  
//   // user.history.remove(postid);
//   //console.log("req.body.poster", req.body.poster);
//   //console.log("postid", postid);
//   //console.log("postid._id", postid._id);

//   //passenger
//   Passenger.findOneAndUpdate({_id: passid._id}, { $set:
//     {
//       trip_cancel: true,
//       got_driver: false,
//       drivers: tokenn._id
//     }}, null, function(err,doc) {
//  if (err) { throw err; }
//  else { console.log("Updated"); }
// }); 
//   // driver
//   // Pilot.findOneAndUpdate({_id: postid._id}, { $set:
//   //             {
//   //               trip_cancel: true
//   //               //got_driver: false,
//   //               //drivers: tokenn._id
//   //             }}, null, function(err,doc) {
//   //          if (err) { throw err; }
//   //          else { console.log("Updated"); }
//   //        }); 
         

//  if( driveR.fcm_token == null){
//   res.status(200).json({
//     message: "FCM Token Is Null"
//   });
//  }
//  else{
// //  await user.save();
//   const registrationToken = driveR.fcm_token;


// const message = {
//   data: {
//     score: ''+passid+'',
//     driveer: ''+drvr+''
//   },
//   token: registrationToken
// };

// // Send a message to the device corresponding to the provided
// // registration token.
// admin.messaging().send(message)
//   .then((response) => {
//     // Response is a message ID string.
//     console.log('Successfully sent message:', response);
//   })
//   .catch((error) => {
//     console.log('Error sending message:', error);
//   });

//   res.status(200).json({
//     message: "Booking Cancelled"
//   });
// }
  
//   // await Passenger.find({},{"_id":0},(err, login) => {
//   //            if (err) {
//   //                res.send(err);
//   //            }
//   //            res.json(login);
//   //        });       
//     }     

// drivers history (The booking he/she took)
export const datahistory = async (req, res, next) => {
  const tkn = await Register.findOne({ token: req.query.token })
  console.log('drid',tkn._id)
  var jsonToSend = [];

 Register
   .findOne({_id: tkn._id })
   .populate({ 
    path: 'history', 
    options: { sort: { time : -1 } } 
  }) // key to populate
   .then(user => {
     const user_history = user.history;
     //console.log('history',user_history);
     var myname;
     //console.log('history',user_history)
     if(user_history == ''){
       res.send('No History - 0 Posts')
     }
     else{

      fun_for_loop(user_history)


  async function fun_for_loop(user_history) {

      var index = 0
      for (var element of user_history){
        index++

        let temp = element.poster;
        
        var value = await Register
        .findOne(temp)
        .select('first_name last_name image mobile')
        
        var jsonObject = JSON.parse("{}")
        jsonObject.is_trip_completed = element.is_trip_completed
        jsonObject.got_driver = element.got_driver
        jsonObject.trip_cancel = element.trip_cancel
        jsonObject.post_id = element._id
        jsonObject.pick_up = element.pick_up
        jsonObject.drop_off = element.drop_off
        jsonObject.time = element.time
        jsonObject.description = element.description
        jsonObject.first_name_passenger = value.first_name
        jsonObject.last_name_passenger = value.last_name
        jsonObject.image_passenger = value.image
        jsonObject.mobile_passenger = value.mobile

      

      jsonToSend.push(jsonObject) 

           if (index == user_history.length) {  
  
    res.status(200).json(
      jsonToSend);
           }
      }
   }
}
    });
    }

// update driver
export const updateDriver = async (req, res) => {
     const data = await Pilot.findOneAndUpdate({_id: req.body.personid}, req.body, { new: true, useFindAndModify: false });
     res.json(data);
    // , (err, product) => {
    //     if (err) {
    //         res.send(err);
    //     }
    //     res.json(product);
    // });
  }    

// passengers posting
export const addUserRequest = async (req, res) => {
  const tchecker = req.body.token;
  const PickUp = req.body.pick_up
  const DropOff = req.body.drop_off
  const Time = req.body.time
  const Desc = req.body.description
  const ridetype = req.body.ride_type
 
  if(tchecker == '' || tchecker == undefined ){
    return res.status(401).json({
      message: "Please enter your token"
    });
  }
  if( PickUp == '' || PickUp == undefined){
    return res.status(401).json({
      message: "Please enter your pickUp location"
    });
  }
  if( DropOff == '' || DropOff == undefined){
    return res.status(401).json({
      message: "Please enter your dropoff location"
    });
  }
  if( Time == '' || Time == undefined){
    return res.status(401).json({
      message: "Please enter your ride time"
    });
  }
  if( Desc == '' || Desc == undefined){
    return res.status(401).json({
      message: "Please enter your car description"
    });
  }
  if( ridetype == '' || ridetype == undefined){
    return res.status(401).json({
      message: "Please enter your ride type"
    });
  }
  else{
  const tkn = await Register.findOne({ token: req.body.token })
  //console.log(tkn);
  //const data = await Register.findOne({token: Token});
  //console.log(data._id);  
  const newPlace = new Passenger(req.body);
  //console.log(Token);
  //console.log(newPlace);
 // const { page = 1, limit = 5 } = req.query;
  const user = await Register.findById(tkn._id)

  newPlace.poster = user;
  await newPlace.save();
  user.plist.push(newPlace);
  await user.save();
  var jsonToSend = [];
  //res.status(201).json(user);
  //const { page = 1, limit = 5 } = req.query;
    Register
   .findOne({_id: tkn._id })
   .populate({ 
    path: 'plist', 
    options: { sort: { time : 1 } } 
  }) // key to populate
   .then(user => {
     const passenger_list = user.plist;
     //console.log('passengers - ',passenger_list);
     //console.log('Token_id - ',tkn._id)
     var jsonarray = JSON.parse(JSON.stringify(passenger_list))

     function funName(jsonToSend) {
    
      res.status(200).send(jsonarray);
     }
     if(passenger_list == ''){
       res.send('No History - 0 Posts')
     }
     else{

      fun_for_loop(passenger_list)


      async function fun_for_loop(passenger_list) {
    
          var index = 0
          for (var element of passenger_list){
            index++
    
            let temp = element.drivers;
            
            var value = await Register
            .findOne(temp)
            .select('first_name last_name image mobile')
            
            var jsonObject = JSON.parse("{}")
            jsonObject.post_id = element._id
            jsonObject.is_trip_completed = element.is_trip_completed
            jsonObject.got_driver = element.got_driver
            jsonObject.trip_cancel = element.trip_cancel
            jsonObject.pick_up = element.pick_up
            jsonObject.drop_off = element.drop_off
            jsonObject.time = element.time
            jsonObject.description = element.description
            if(temp != undefined) {
            jsonObject.first_name_passenger = value.first_name
            jsonObject.last_name_passenger = value.last_name
            jsonObject.image_passenger = value.image
            jsonObject.mobile_passenger = value.mobile

           // jsonToSend.push(jsonObject)
    
          }
    
          jsonToSend.push(jsonObject) 
    
               if (index == passenger_list.length) {  
      
        res.status(200).json(
          jsonToSend);
               }
          }
       }
    // function funName(jsonToSend) {
    //   return res.status(200).send(jsonarray);
    // }
  }
   });
  }
    // let newUser = new Passenger(req.body);
    // newUser.save((err, driver) => {
    //     if (err) {
    //         res.send(err);
    //     }else{
    //     Register.find({Is_driver_or_passenger: {$eq: true}},{"_id":0,"FirstName":1,"LastName":1,"DOB":1,"Image":1,"Mobile":1,"Email":1,"Gender":1,"Car_details":1},(err, login) => {
    //         if (err) {
    //             res.send(err);
    //         }
    //         res.json(login);
    //     });
        
    //     }
    // });

}



export const getPassengerWithId = async (req, res) => {
   const tkn = await Register.findOne({ token: req.query.token })
   console.log(tkn._id);
  //const {placeID} = req.params;
    //const userpost =  await Register.findById(tkn._id).populate('favlist');
    res.status(200).json(tkn) ;
  // Register.findById({_id: req.params.placeID},(err, product) => {

  //     if (err) {
  //         res.send(err);
  //     }
      
  //     res.json(product);
  // });
}
export const updatePassenger = (req, res) => {
    Passenger.findOneAndUpdate({_id: req.body.postid}, req.body, { new: true, useFindAndModify: false }, (err, product) => {
        if (err) {
            res.send(err);
        }
        res.json(product);
    });
  }     