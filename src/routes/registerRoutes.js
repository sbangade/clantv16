import { addnewRegister,
         getRegister,
         userLogin,
         getUserProfile,
         getEmail,
         addDriver,
         addUserRequest,
         updateDriver,
         updatePassenger,
         getPassengerWithId,
         driverHistory,
         passengerHistory,
         confirmBooking,
         datahistory,
         liveDriver,
         tokenGenerator,
         bookingCancellation,
         uploadImage
} from '../controller/registerController';
import express from 'express';

//import requireLogin from '../middleware/requireLogin';
//import upload from '../middleware/upload';
// , upload.single('Image')

const routes = (app) => {
    app.route('/image')
    .post(uploadImage); 

//app.route('/images', express.static('uploads'));    

app.route('/register') //registration
    .get((req,res, next) => {
        console.log(`Request from: ${req.originalUrl}`)
        console.log(`Request type: ${req.method}`)
        next();
    }, getRegister) //getRegistration
    .post(addnewRegister);

    // Login Route
app.route('/login')
    .post(userLogin);
    
app.route('/token')  // both token generating - login
    .post(tokenGenerator);    
 
// get a specific user's profile    
app.route('/profile/:userID')
    .get(getUserProfile) 

// Forgot password    
app.route('/forgot')
    .post(getEmail);

// driver posting route    
app.route('/driver') 
    .post(addDriver)
    .get(driverHistory);
app.route('/livedriver')  // online driver only
    .get(liveDriver);    
    

app.route('/booking') 
    .get(confirmBooking);

app.route('/cancel')   // driver calcelling trip
    .get(bookingCancellation);
    
// app.route('/tripcancel')  // passenget cancelling trip
//     .get(passengerCancellation);        
    
app.route('/history') 
    .get(datahistory);        

app.route('/driver/:productID')     
    .put(updateDriver); 


       

// passenger posting    
app.route('/user')
    .get(getPassengerWithId)
    .post(addUserRequest)
    .put(updatePassenger);

app.route('/userhistory')
    .get(passengerHistory);    
}    
    
// update passenger posting



export default routes;