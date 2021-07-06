// import jwt from 'jsonwebtoken';
// import {JWT_SECRET} from '../config/keys';
// import mongoose from 'mongoose';
// import { RegistersSchema } from '../models/registerModel';

// const Register = mongoose.model('Register', RegistersSchema);

// // const jwt = require('jsonwebtoken')
// // const {JWT_SECRET} = require('../config/keys')
// // const mongoose = require('mongoose')
// // const User = mongoose.model("User")

// module.exports = (req,res,next)=>{
//     const {authorization} = req.headers
//     //authorization === Bearer ewefwegwrherhe
//     console.log('one')
//     if(!authorization){
//        return res.status(401).json({error:"you must be logged in"})
//     }
//     const token = authorization.replace("Bearer ","")
//     jwt.verify(token,JWT_SECRET,(err,payload)=>{
//         if(err){
//          return   res.status(401).json({error:"you must be logged in"})
//         }
//         console.log(payload)
//         const {_id} = payload
//         Register.findById(_id).then(userdata=>{
//             req.user = userdata
//             next()
//         })
        
        
//     })
// }