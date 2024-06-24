import peerConfiguration from "./stunServers.js";
const createPeerConnection =(addIce)=>{
    return new Promise(async(resolve, reject) => {
        const peerConnection = await new RTCPeerConnection();
        // rtc peer connection is the connection to the peer 
        // we may need more than one this time
        // we pass in the config object which is just stun servers
        // it will get us ice candidates
        const remoteStream = new MediaStream();
        peerConnection.addEventListener('signalingstatechange',(e)=>{
            console.log("Signaling State Change")
            console.log(e)
        })
        peerConnection.addEventListener('icecandidate',e=>{
            console.log("Found ice candidate...")
            // console.log(e);
            if(e.candidate){
               addIce(e.candidate)// a function that will help in adding ice
            //    this abstraction is done to escape the sending of multiple props from react to here
            }
        })

        peerConnection.addEventListener("track",(e)=>{
            console.log("got a track from remote..");
            e.streams[0].getTracks().forEach(track=>{
                remoteStream.addTrack(track,remoteStream)

                console.log("fingers crossed");
            })
        })

        resolve({
            peerConnection,
            remoteStream
        })
    })
}

export default createPeerConnection;