

const addStream = (who,stream,peerConnection)=>{
    return {
        type:"ADD_STREAM",
        payload:{
            who,
            stream,
            peerConnection
        }
    }
}

export default addStream;