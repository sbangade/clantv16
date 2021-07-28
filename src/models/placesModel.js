import mongoose from 'mongoose';

const Schema = mongoose.Schema;
export const placesSchema = new Schema({
    poster: {
        type: Schema.Types.ObjectId,
        ref: 'Register'
    }
},{collection : 'places'});