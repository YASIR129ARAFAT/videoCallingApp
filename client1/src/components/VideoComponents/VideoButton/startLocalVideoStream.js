import updateCallStatus from "../../../redux-elements/actions/updateCallStatus";

// this func will add track (peerConnections ) and update callStatus

function startLocalVideoStream(streams,dispatch) {
    // console.log("check startLocalVideoStreams");
    const localStream = streams?.localStream;

    // console.log("streams: ")
    // console.log(streams);
    
    for(const s in streams){ //s is the key

        if(s !== "localStream"){
            //we don't addTracks to the localStream
            const curStream = streams[s];
            //addTracks to all peerConnecions
            localStream?.stream?.getVideoTracks().forEach(t=>{
                curStream?.peerConnection?.addTrack(t,streams?.localStream?.stream);
            })
            //update redux callStatus
            dispatch(updateCallStatus('video',"enabled"));
        }
        
    }
}

export default startLocalVideoStream