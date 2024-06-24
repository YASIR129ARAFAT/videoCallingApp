import { useSelector } from "react-redux";
import updateCallStatus from "../redux-elements/actions/updateCallStatus";

function proSocketListeners(socket,setApptInfo,dispatch){
    socket.on('apptData',(data)=>{
        // apptInfo will be a state which will be rendered to display the appts of the professional
        console.log("recieved");
        setApptInfo(data);
    })
    socket.on("newOfferWaiting",(offerData)=>{
        // update the redux callStatus to add offer
        dispatch(updateCallStatus("offer",offerData?.offer));
        dispatch(updateCallStatus("myRole","answerer"));
    })
}

export default proSocketListeners