import React, { useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useEffect } from 'react'
import "./VideoComponent.css"
import CallInfo from './CallInfo'
import ActionButtons from './ActionButtons'
import ChatWindow from './ChatWindow.js'
import addStream from '../../redux-elements/actions/addStream.js'
import { useDispatch, useSelector } from 'react-redux'
import createPeerConnection from '../../webRTCutilities/createPeerConnection.js'
import socketConnection from '../../webRTCutilities/socketConnection.js'

import updateCallStatus from '../../redux-elements/actions/updateCallStatus.js'
import clientSocketListeners from '../../webRTCutilities/clientSocketListeners.js'
function MainVideoPage() {


    const [searchParams, setSearchParams] = useSearchParams()
    const [apptInfo, setApptInfo] = useState({})
    const callStatus = useSelector(state => state.callStatus)
    const dispatch = useDispatch()
    const streams = useSelector(state => state?.streams)
    const smallFeedEl = useRef(null);
    const largeFeedEl = useRef(null);


    useEffect(() => {
        const constraints = {
            video: true, // both cant be passed false at the same time
            audio: false
        }
        const fetchUserMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia(constraints)

                //update our call status to know we have the media
                // to do this set the set the callStateReduceers state.haveMedia = true
                dispatch(updateCallStatus('haveMedia', true));

                dispatch(addStream("localStream", stream));

                const { peerConnection, remoteStream } = await createPeerConnection()
                // we dont know who we are talking to yet..
                // we will change it dynamically
                dispatch(addStream("remote1", remoteStream, peerConnection));

                // we finally have a peer connection, we can make an offer
            } catch (error) {
                console.log(error);
            }
        }
        fetchUserMedia()
    }, [])
    useEffect(() => {
        const token = searchParams.get('token');

        const fetchDecodedToken = async () => {
            try {
                // console.log("attempt started");
                const resp = await axios.post(`https://localhost:${process.env.REACT_APP_BACKEND_PORT}/verify-link`, { token })

                console.log(resp?.data);

                setApptInfo(resp?.data)

            } catch (error) {
                console.log(error);
            }
        }
        fetchDecodedToken()
    }, [])

    useEffect(() => {
        async function createOfferAsync() {
            try {
                for (let s in streams) {
                    if (s !== "localStream") {
                        const pc = streams[s].peerConnection;
                        const offer = await pc.createOffer();
                        await pc.setLocalDescription(offer)

                        const token = searchParams.get('token');
                        const socket = socketConnection(token);

                        console.log("djhfbhdsg");
                        socket.emit('newOffer', { offer, apptInfo })

                        clientSocketListeners(socket,dispatch);
                    }
                }
                dispatch(updateCallStatus("haveCreatedOffer", true))
            } catch (error) {
                console.log(error);
            }
        }
        if (callStatus?.audio === "enabled" && callStatus?.video === "enabled"
            && !callStatus?.haveCreatedOffer) {

            createOfferAsync()

        }
    }, [callStatus?.audio, callStatus?.video, callStatus?.haveCreatedOffer])

    useEffect(()=>{
        //look for the answer in callStatus if it exist
        // then we will set the remote description 
        async function addAnswer(){
            for(const s in streams){
                if(s !== "localStream"){
                    const pc = streams[s].peerConnection;
                    await pc.setRemoteDescription(callStatus?.answer)
                    console.log(`answer added!!`);
                }
            }
        }
        if(callStatus?.answer)
            addAnswer()
    },[callStatus?.answer])
    return (
        <div className="main-video-page">
            <div className="video-chat-wrapper">
                {/* Div to hold our remote video, our local video, and our chat window*/}

                <video id="large-feed" ref={largeFeedEl} autoPlay controls playsInline></video>

                <video id="own-feed" ref={smallFeedEl} autoPlay controls playsInline></video>

                {apptInfo?.fullname ? <CallInfo apptInfo={apptInfo} /> : <></>}

                <ChatWindow />
            </div>
            <ActionButtons smallFeedEl={smallFeedEl} largeFeedEl={largeFeedEl} />

        </div>
    )
}

export default MainVideoPage