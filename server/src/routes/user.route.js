const express = require('express');
const { 
    getUser,
    updateUser,
    changePassword,
    getAllUser,
    getLoggedInUserDetails} = require('../controllers/user.controller.js');
const { upload } = require('../middlewares/multerFileUpload.middleware.js');


const router = express.Router();

//READ -> GET   /user
//READ -> GET   /user/:id
// CREATE -> POST
// update - put
//Delete -> DELETE


// Note: The order of route definitions in Express matters. Placing the 'getLoggedInUserDetails' route
// at the top ensures that it gets matched before routes with dynamic parameters like '/:getAdminsOnly' and '/:id'.
// This order prevents unintentional matching of more generic routes and resolves the issue of fetching
// details of the logged-in user correctly.

// /api/user/loggedInUserDetails
// route to get details od logged in user
router.get('/loggedInUserDetails',getLoggedInUserDetails);

// ---

/*
 * /api/user 
*/ 
router
.get('/otherUserProfile/:id', getUser)
.post('/changePassword',changePassword)
.get('/:getProfessionalOnly', getAllUser)
.patch('/updateUserDetails/:id', 
        upload.fields([
        {
            name:"profileImage", // you can access this file inside controller using this name
            maxCount:1
        },
        
        // add multiple object inside this array to upload multiple file
        // this middleware will add a .file inside the req object
    ]), 
    updateUser
)


exports.userRoute = router;

