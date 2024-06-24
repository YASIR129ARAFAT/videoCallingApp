import updateCallStatus from "../redux-elements/actions/updateCallStatus";

function clientSocketListeners (socket,dispatch){
    socket.on("answerToClient",(answer)=>{
        console.log(answer);
        dispatch(updateCallStatus("answer",answer));
        dispatch(updateCallStatus("myRole","offerer"));
    })
}

export default clientSocketListeners