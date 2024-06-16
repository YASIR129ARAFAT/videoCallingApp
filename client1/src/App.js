
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
// import socket from './webRTCutilities/socketConnection.js';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" >
      <Route path="/join-video" element={<MainVideoPage />} />
      <Route path="/join-video-pro" element={<ProMainVideoPage />} />
      <Route path="dashboard" element={<Dashboard />} />
      
    </Route>
  )
);


function App() {
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
