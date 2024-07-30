
import updateCallStatus from "../redux-elements/actions/updateCallStatus";

function proDashboardSocketListeners(socket,setApptInfo,dispatch){
    socket.on('apptData',(data)=>{
        // apptInfo will be a state which will be rendered to display the appts of the professional
        console.log("recieved....",data);
        
        setApptInfo(data);
    })
    socket.on("newOfferWaiting",(offerData)=>{
        // update the redux callStatus to add offer
        dispatch(updateCallStatus("offer",offerData?.offer));
        dispatch(updateCallStatus("myRole","answerer"));
    })
}


function proVideoSocketListeners(socket,addIceCandidatesToPc){
    socket.on("iceToClient",iceCandidate=>{
        addIceCandidatesToPc(iceCandidate)
    })
}
export default {proDashboardSocketListeners,proVideoSocketListeners}