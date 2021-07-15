//import { Double } from 'bson';
//import { Timestamp } from 'bson';
import mongoose from 'mongoose';
//import { Long } from 'mongodb';
//import Int64 from 'node-int64';

const Schema = mongoose.Schema;

export const RegistersSchema = new Schema({
    first_name: {
        type: String,
        required: 'Enter first name'
    },
    last_name: {
        type: String,
        required: 'Enter first name'
    },
    dob: {
        type: Date,
        required: 'Enter Date of Birth'
    },
    is_driver_or_passenger: {
        type: Boolean,
        required:'Enter driver or passenger'
    },
    image: {
        type: String
    },
    mobile: {
        type: Number,
        required: 'Enter your mobile number'

    },
    email: {
        type: String,
        required: 'Enter your Email address'

    },
    gender: {
        type: String
    },
    car_details: {
        type: String
    },
    password: {
        type: String,
        required: 'Enter your password'
    },
    token: {
        type: String
    },
    fcm_token: {
        type: String
    },
    emailverified: {
        type: Boolean,
        default: false
    },
    everification: {
        type: Number,
        default: 1
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
    find_passenger: {
        type: Boolean,
    },
    locality: {
        type: String,
        required: 'Enter your location'
    },
    ride_type: {
        type: String,
        required: 'Enter ride type'
    },
    is_trip_completed: {
        type: Boolean,
        default: false
    },
    token: {
        type: String
    },
    trip_cancel:{
        type:Boolean,
        default: false
    },
    myfavorite: {
        type: Schema.Types.ObjectId,
        ref: 'Register'
    }
   
});

export const passengerSchema = new Schema({
    pick_up: {
        type: String,
        required: 'Enter your pickup location'
    },
    drop_off: {
        type: String,
        required: 'Enter your drop off location'
    },
    time: {
        type: Date,
        required: 'Enter your ride time'
    },
    description: {
        type: String,
       required: 'Enter your description'
    },
    ride_type: {
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
    trip_cancel:{
        type:Boolean,
        default: false
    },
    passenger_cancel:{
        type: Boolean,
        default: false
    },
    token: {
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