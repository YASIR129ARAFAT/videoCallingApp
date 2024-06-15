
// this func will add track (peerConnections ) and update callStatus

function startAudioStream(streams) {
    // console.log("check startLocalVideoStreams");
    const localStream = streams?.localStream;


    for(const s in streams){ //s is the key

        if(s !== "localStream"){
            //we don't addTracks to the localStream
            const curStream = streams[s];
            //addTracks to all peerConnecions
            localStream?.stream?.getAudioTracks().forEach(t=>{
                curStream?.peerConnection?.addTrack(t,streams?.localStream?.stream);
            })
        }
        
    }
}

export default startAudioStream