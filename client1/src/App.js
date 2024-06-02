
import './App.css';
import socket from './webRTCutilities/socketConnection.js';
import HomePage from './components/VideoComponents/MainVideoPage.js';

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" >
      <Route path="" element={<HomePage />} />
      
    </Route>
  )
);


function App() {
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
