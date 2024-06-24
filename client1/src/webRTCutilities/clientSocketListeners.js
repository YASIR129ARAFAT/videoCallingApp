import updateCallStatus from "../redux-elements/actions/updateCallStatus";

function clientSocketListeners (socket,dispatch,addIceCandidatesToPc){
    socket.on("answerToClient",(answer)=>{
        console.log(answer);
        dispatch(updateCallStatus("answer",answer));
        dispatch(updateCallStatus("myRole","offerer"));
    })

    socket.on("iceToClient",iceCandidate=>{
        addIceCandidatesToPc(iceCandidate)
    })
}

export default clientSocketListeners