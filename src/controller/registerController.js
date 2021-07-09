import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from '../config/keys';
import moment from 'moment';
import fs from 'fs';
import mime from 'mime';
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
import bodyParser from 'body-parser';
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
        return res.status(200).json({
          message: "Registered successfully!"
        });
       // return res.status(200).json({
         // message: "Registered successfully!"
        //});
        var matches = req.body.image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/),
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
        // return res.status(200).json({
        //   message: "Registered successfully!"
        // });
        } 
        catch (e) {
        next(e);
        }
      }else{
        return res.status(401).json({
          message: "Email already exist."
        });
      }
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
export const liveDriver = async (req, res) => { 
  await Pilot.find({ "find_passenger": { $eq: true } },(err, login) => {
         if (err) {
             res.send(err);
         }
         res.json(login);
     });
}

// Get Passengers History
export const passengerHistory = async (req, res) => { 
  
  const tkn = await Register.findOne({ token: req.query.token })
  
  var jsonToSend = [];
  
    Register
   .findOne({_id: tkn._id })
   .populate("plist",{ token: 0, poster:0}) // key to populate
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
        
        var value = await Register
        .findOne(temp)
        .select('first_name last_name image mobile')
        
        var jsonObject = JSON.parse("{}")
        jsonObject.is_trip_completed = element.is_trip_completed
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
export const getUserProfile = (req, res) => {
    Register.findById(req.params.userID,{"_id":0, "FirstName":1,"LastName":1,"DOB":1,"Is_driver_or_passenger":1,"Image":1,"Mobile":1,"Email":1,"Gender":1,"Car_details":1}, (err, product) => {

        if (err) {
            res.send(err);
        }
        
        res.json(product);
    });
}
export const getEmail = (req, res) => {
    Register.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Email doesnt exist."
        });
      }else{
        return res.status(201).json({
            message: "Login Successfully"
          });
            }
        });
      }
//let ra      
// export const tom = (requireLogin) => {
//   //let ra = requireLogin
//   console.log('test')
//   console.log(requireLogin)
//    return addDriver
//   }

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
  //console.log(newPlace);
  //const data = requireLogin();
  
  const user = await Register.findById(tkn._id);
  newPlace.myfavorite = user; //myfavorite
  await newPlace.save();
  user.favlist.push(newPlace);
  //const locality = req.body.locality
  //var dateTimeTofilter = moment().subtract(1, 'year');
  var currentdate = new Date(); 
  console.log(currentdate);
  // {drop_off: { $regex: new RegExp(`^${local}$`), $options: 'i' }}
  await user.save();
  var jsonToSend = [];
  await Passenger.find(
        {
          $and: [{$or:[
           // { $text: { $search: "sarnia" } }
          {pick_up: /sarnia/i},
          {drop_off: /sarnia/i}
        
        ]},
        {
          time: { $gte: currentdate}
        },
      {
        got_driver: false
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
  const tokenn = await Register.findOne({ token: req.query.token },{"_id":1,"first_name":1,"last_name":1, "image":1})
  //console.log('token ', tokenn._id);
  const drvr = await Register.findOne({ _id: postid.poster },{"first_name":1,"last_name":1,"image":1});
  //console.log('new',drvr._id);
  
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

const message = {
  data: {
    post: ''+postid+'',
    driver: ''+drvr+''
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
  console.log('poster',postid.poster);
  const tokenn = await Register.findOne({ token: req.query.token },{"first_name":1,"last_name":1});
  const drvr = await Register.findOne({ _id: postid.poster },{"first_name":1,"last_name":1,"image":1});
  console.log('new',drvr);
  //console.log(tokenn);
               //const {placeID} = req.params;
  //const data = await Register.findOne({Token: tkn});
  //console.log(data._id); 
               //const newPlace = new Pilot(req.body);
  //console.log(newPlace);
  //const data = requireLogin();
  
  //////new
  //const user = await Register.findById(tokenn._id);
  const driveR = await Register.findById(postid.poster);
  console.log('drive',driveR.fcm_token);
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
Passenger.findOneAndUpdate({_id: postid._id}, { $set:
              {
                trip_cancel: true,
                got_driver: false,
                drivers: tokenn._id
              }}, null, function(err,doc) {
           if (err) { throw err; }
           else { console.log("Updated"); }
         }); 
         


  //await user.save();
  const registrationToken = driveR.fcm_token;

const message = {
  data: {
    score: ''+postid+'',
    passenger: ''+drvr+''
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
  
  // await Passenger.find({},{"_id":0},(err, login) => {
  //            if (err) {
  //                res.send(err);
  //            }
  //            res.json(login);
  //        });       
    }     

//passenger calcelling trip  

export const passengerCancellation = async (req, res, next) => {
  const postid = await Pilot.findOne({ _id: req.query.poster })
 // const postid = await Pilot.findOne({ _id: req.query.passenger })
  //console.log('poster',postid.myfavorite);
  const tokenn = await Register.findOne({ token: req.query.token },{"first_name":1,"last_name":1})
  const drvr = await Register.findOne({ _id: postid.myfavorite },{"first_name":1,"last_name":1,"image":1});
  console.log('new',drvr);
  //console.log(tokenn);
               //const {placeID} = req.params;
  //const data = await Register.findOne({Token: tkn});
  //console.log(data._id); 
               //const newPlace = new Pilot(req.body);
  //console.log(newPlace);
  //const data = requireLogin();
  
  //////new
  //const user = await Register.findById(tokenn._id);
  const driveR = await Register.findById(postid.myfavorite);
  console.log('drive',driveR.fcm_token);
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
  Pilot.findOneAndUpdate({_id: postid._id}, { $set:
              {
                trip_cancel: true
                //got_driver: false,
                //drivers: tokenn._id
              }}, null, function(err,doc) {
           if (err) { throw err; }
           else { console.log("Updated"); }
         }); 
         


//  await user.save();
  const registrationToken = driveR.fcm_token;


const message = {
  data: {
    score: ''+postid+'',
    driveer: ''+drvr+''
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
  
  // await Passenger.find({},{"_id":0},(err, login) => {
  //            if (err) {
  //                res.send(err);
  //            }
  //            res.json(login);
  //        });       
    }     

// drivers history (The booking he/she took)
export const datahistory = async (req, res, next) => {
  const tkn = await Register.findOne({ token: req.query.token })
  console.log('drid',tkn._id)
  var jsonToSend = [];

 Register
   .findOne({_id: tkn._id })
   .populate("history",{ token: 0 }) // key to populate
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
     const data = await Pilot.findOneAndUpdate({_id: req.params.productID}, req.body, { new: true, useFindAndModify: false });
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
  const { page = 1, limit = 5 } = req.query;
    Register
   .findOne({_id: tkn._id })
   .populate("plist",{ token: 0, poster: 0, _id: 0 }).limit(limit * 1).skip((page - 1) * limit) // key to populate
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
            jsonObject.is_trip_completed = element.is_trip_completed
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
   const tkn = await Register.findOne({ token: req.body.token })
   console.log(tkn._id);
  //const {placeID} = req.params;
    const userpost =  await Register.findById(tkn._id).populate('favlist');
    res.status(200).json(userpost.favlist) ;
  // Register.findById({_id: req.params.placeID},(err, product) => {

  //     if (err) {
  //         res.send(err);
  //     }
      
  //     res.json(product);
  // });
}
export const updatePassenger = (req, res) => {
    Passenger.findOneAndUpdate({_id: req.params.placeID}, req.body, { new: true, useFindAndModify: false }, (err, product) => {
        if (err) {
            res.send(err);
        }
        res.json(product);
    });
  }     