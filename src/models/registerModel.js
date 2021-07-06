//import { Double } from 'bson';
//import { Timestamp } from 'bson';
import mongoose from 'mongoose';
//import { Long } from 'mongodb';
//import Int64 from 'node-int64';

const Schema = mongoose.Schema;

export const RegistersSchema = new Schema({
    FirstName: {
        type: String,
        required: 'Enter first name'
    },
    LastName: {
        type: String,
        required: 'Enter first name'
    },
    DOB: {
        type: Date,
        required: 'Enter Date of Birth'
    },
    Is_driver_or_passenger: {
        type: Boolean,
        required:'Enter driver or passenger'
    },
    Image: {
        type: String
    },
    Mobile: {
        type: Number,
        required: 'Enter your mobile number'

    },
    Email: {
        type: String,
        required: 'Enter your Email address'

    },
    Gender: {
        type: String
    },
    Car_details: {
        type: String
    },
    Password: {
        type: String,
        required: 'Enter your password'
    },
    Token: {
        type: String
    },
    fcmToken: {
        type: String
    },
    Everification: {
        type: String
    },
    plist: [{
        type: Schema.Types.ObjectId,
        ref: 'Passenger'
    }],
    favlist: [{
        type: Schema.Types.ObjectId,
        ref: 'Pilot'
    }],
    history: [{
            type: Schema.Types.ObjectId,
            ref: 'Passenger'
        
    }]
});

export const PilotSchema = new Schema({
    FindPassenger: {
        type: Boolean,
    },
    Locality: {
        type: String,
        required: 'Enter your location'
    },
    RideType: {
        type: String,
        required: 'Enter ride type'
    },
    is_trip_completed: {
        type: Boolean,
        default: false
    },
    Token: {
        type: String
    },
    tripCancel:{
        type:Boolean,
        default: false
    },
    myfavorite: {
        type: Schema.Types.ObjectId,
        ref: 'Register'
    }
   
});

export const passengerSchema = new Schema({
    PickUp: {
        type: String,
        required: 'Enter your pickup location'
    },
    DropOff: {
        type: String,
        required: 'Enter your drop off location'
    },
    Time: {
        type: Date,
        required: 'Enter your ride time'
    },
    Description: {
        type: String,
       required: 'Enter your description'
    },
    RideType: {
        type: String,
        required: 'Enter your ride type'
    },
    is_trip_completed: {
        type: Boolean,
        default: false
    },
    got_driver: {
        type: Boolean,
        default: false
    },
    tripCancel:{
        type:Boolean,
        default: false
    },
    Token: {
        type: String
    },
    drivers: {
        type: Schema.Types.ObjectId,
        ref: 'Register'
    },
    poster: {
        type: Schema.Types.ObjectId,
        ref: 'Register'
    }
});