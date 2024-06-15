import peerConfiguration from "./stunServers.js";
const createPeerConnection =()=>{
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
            if(e.candidate){
               
            }
        })

        resolve({
            peerConnection,
            remoteStream
        })
    })
}

export default createPeerConnection;