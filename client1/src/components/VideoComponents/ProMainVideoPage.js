import React, { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import "./VideoComponent.css";
import ActionButtons from "./ActionButtons";
import ChatWindow from "./ChatWindow.js";
import addStream from "../../redux-elements/actions/addStream.js";
import { useDispatch, useSelector } from "react-redux";
import createPeerConnection from "../../webRTCutilities/createPeerConnection.js";
import socketConnection from "../../webRTCutilities/socketConnection.js";
import updateCallStatus from "../../redux-elements/actions/updateCallStatus.js";
import proSocketListeners from "../../webRTCutilities/professionalSocketListeners.js";



function ProMainVideoPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [apptInfo, setApptInfo] = useState({});
    const [clientName, setClientName] = useState("");
    const callStatus = useSelector((state) => state.callStatus);
    const dispatch = useDispatch();
    const streams = useSelector((state) => state?.streams);
    const smallFeedEl = useRef(null);
    const largeFeedEl = useRef(null);
    const [haveGottenIce, setHaveGottenIce] = useState(false);
    const streamsRef = useRef(null)
    const [showCallInfo,setShowCallInfo] = useState(true);

    useEffect(() => {
        const constraints = {
            video: true, // both cant be passed false at the same time
            audio: true,
        };
        const fetchUserMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia(constraints);

                //update our call status to know we have the media
                // to do this set the set the callStateReduceers state.haveMedia = true
                dispatch(updateCallStatus("haveMedia", true));

                dispatch(addStream("localStream", stream));

                const { peerConnection, remoteStream } = await createPeerConnection(
                    addIce
                );
                // we dont know who we are talking to yet..
                // we will change it dynamically
                dispatch(addStream("remote1", remoteStream, peerConnection));

                // we finally have a peer connection, we can make an offer
                largeFeedEl.current.srcObject = remoteStream
               

            } catch (error) {
                console.log(error);
            }
        };
        fetchUserMedia();
    }, []);

    


    useEffect(() => {
        async function setOffer() {
            try {
                for (const s in streams) {
                    if (s !== "localStream") {
                        const pc = streams[s].peerConnection;
                        await pc.setRemoteDescription(callStatus?.offer);
                        console.log(pc.signalingState);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }

        if (
            callStatus?.offer &&
            streams?.remote1 &&
            streams?.remote1?.peerConnection
        ) {
            setOffer();
        }
    }, [callStatus?.offer, streams?.remote1]);

    useEffect(() => {
        async function createAnswerAsync() {
            try {
                for (const s in streams) {
                    if (s !== "localStream") {
                        const pc = streams[s].peerConnection;
                        const answer = await pc.createAnswer();
                        await pc.setLocalDescription(answer);
                        // console.log(pc.signalingstate);

                        dispatch(updateCallStatus("haveCreatedAnswer", true));
                        dispatch(updateCallStatus("answer", answer));

                        const token = searchParams.get("token");
                        const _id = searchParams.get("_id");
                        // console.log("_id ", _id);

                        const socket = socketConnection(token);

                        socket.emit("newAnswer", { answer, _id });
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
        if (
            callStatus?.audio === "enabled" &&
            callStatus?.video === "enabled" &&
            !callStatus?.haveCreatedAnswer 
        ) {
            createAnswerAsync();
        }
    }, [callStatus?.audio, callStatus?.video, callStatus?.haveCreatedAnswer]);

    


    useEffect(() => {
        const token = searchParams.get("token");
        const clientName = searchParams.get("client")
        setClientName(clientName);
        console.log({clientName});

        // console.log(searchParams.get("client"));
        const fetchDecodedToken = async () => {
            try {
                // console.log("attempt started");
                const resp = await axios.post(
                    `${process.env.REACT_APP_BACKEND_URL}/verify-link`,
                    { token }
                );

                console.log(resp?.data);

                setApptInfo(resp?.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchDecodedToken();
    }, []);


    const addIceCandidatesToPc = (iceCandidate)=>{
        for(const s in streamsRef.current){
            if(s!=="localStream"){
                const pc = streamsRef.current[s].peerConnection
                pc.addIceCandidate(iceCandidate);
                setShowCallInfo(false)
                console.log("ice candidate added to client");
            }
        }
    }

    useEffect(()=>{
        // we cant update util remote1 is set
        if(streams?.remote1){
            streamsRef.current = streams
        }
    },[streams])

    useEffect(() => {
        const token = searchParams.get('token');
        const socket = socketConnection(token);

        proSocketListeners.proVideoSocketListeners(socket,addIceCandidatesToPc); // here we are listening for apptData event to get the appointments of the professional
    }, [])

    const addIce = (iceCandidate) => {
        //emit icecandidates to the server (not client)
        const token = searchParams.get("token");
        const _id = searchParams.get("_id");
        const socket = socketConnection(token);
        console.log({token,_id});
        socket.emit("iceToServer", {
            iceCandidate,
            userType: "professional",
            _id,
        });
    };

    useEffect(() => {
        async function getIceCandidates() {
            try {
                const token = searchParams.get("token");
                const _id = searchParams.get("_id");

                const socket = socketConnection(token);
                const iceCandidates = await socket.emitWithAck(
                    "getIce",
                    _id,
                    "professional"
                ); // userType and _id sent
                console.log("iceCandidates recieved in acknowledgement: ");
                console.log(iceCandidates);

                iceCandidates.forEach((iceCand) => {
                    for (const s in streams) {
                        if (s !== "localStream") {
                            const pc = streams[s].peerConnection;
                            pc.addIceCandidate(iceCand);
                            console.log("ice cand.. added!!!!!");
                        }
                    }
                });
            } catch (error) {
                console.log(error);
            }
        }
        if (streams.remote1 && !haveGottenIce) {
            setHaveGottenIce(true)
            getIceCandidates();
        }
    }, [streams,haveGottenIce]);
    return (
        <div className="main-video-page">
            <div className="video-chat-wrapper">
                {/* Div to hold our remote video, our local video, and our chat window*/}

                <video
                    id="large-feed"
                    ref={largeFeedEl}
                    autoPlay
                    controls
                    playsInline
                ></video>

                <video
                    id="own-feed"
                    ref={smallFeedEl}
                    autoPlay
                    controls
                    playsInline
                ></video>

                {(showCallInfo)&&(callStatus?.audio === "off" || callStatus?.video === "off") ? (
                    <div className="call-info">
                        <h1 className="text-center">
                            {clientName} is waiting
                            <br />
                            turn on your camera and mic to join.
                        </h1>
                    </div>
                ) : (
                    <></>
                )}

                <ChatWindow />
            </div>
            <ActionButtons smallFeedEl={smallFeedEl} largeFeedEl={largeFeedEl} />
        </div>
    );
}

export default ProMainVideoPage;
