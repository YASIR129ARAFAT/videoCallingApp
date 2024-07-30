
import './App.css';

import MainVideoPage from './components/VideoComponents/MainVideoPage.js';

import ProMainVideoPage from './components/VideoComponents/ProMainVideoPage.js';
import Dashboard from './components/Dashboard/Dashboard.js';


import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import LoginPage from './pages/LoginPage.js';
import RegistrationPage from './pages/RegistrationPage.js';
import ForgotPassword from './pages/ForgotPassword.js';
import UserProfilePage from './pages/UserProfilePage.js';
import UpdateUserDataPage from './pages/UpdateUserDataPage.js';
import ResetPasswordPage from './pages/ResetPasswordPage.js';
import AllUsersPage from './pages/AllUsersPage.js';
import AllDoctorsPage from './pages/AllDoctorsPage.js';
import OtherUserProfilePage from './pages/OtherUserProfilePage.js';
import ChangePasswordPage from './pages/ChangePasswordPage.js';
import LandingPage from './pages/LandingPage.js';
import AddAppointmentPage from './pages/AddAppointmentPage.js';
import ErrorPage from './pages/ErrorPage.js';
import PageNotFound from './pages/PageNotFound.js';
// import socket from './webRTCutilities/socketConnection.js';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" >
      <Route path="join-video" element={<MainVideoPage />} />
      <Route path="" element={<LandingPage />} />
      <Route path="join-video-pro" element={<ProMainVideoPage />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegistrationPage />} />
      <Route path="errorPage/:message" element={<ErrorPage/>}/>
      <Route path="allpatients" element={<AllUsersPage/>}/>
      <Route path="alldoctors" element={<AllDoctorsPage/>}/>
      <Route path="changePassword" element={<ChangePasswordPage/>} />
      <Route path="forgotpassword" element={<ForgotPassword />} />
      <Route path="userprofile" element={<UserProfilePage />} />
      <Route path="otheruserprofile/:id" element={<OtherUserProfilePage/>} />
      <Route path="updateUser/:id" element={<UpdateUserDataPage />} />
      <Route path="reset/:id" element={<ResetPasswordPage/>}/>
      <Route path="addAppointment/:clientId" element={<AddAppointmentPage/>}/>
      <Route path="addAppointment/:clientId" element={<AddAppointmentPage/>}/>
      <Route path="*" element={<PageNotFound/>}/>
      
    </Route>
  )
);


function App() {
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
