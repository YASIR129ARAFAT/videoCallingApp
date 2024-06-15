
import './App.css';

import HomePage from './components/VideoComponents/MainVideoPage.js';

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
      <Route path="" element={<HomePage />} />
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
