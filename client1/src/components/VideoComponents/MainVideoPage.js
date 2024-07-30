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
    const _idRef = useRef(null)
    const streamsRef = useRef(null)
    const [showCallInfo,setShowCallInfo] = useState(true);

    useEffect(() => {
        const constraints = {
            video: true, // both can't be passed false at the same time
            audio: true
        }
        const fetchUserMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia(constraints)

                //update our call status to know we have the media
                // to do this set the set the callStateReduceers state.haveMedia = true
                dispatch(updateCallStatus('haveMedia', true));

                dispatch(addStream("localStream", stream));

                //addIce is defined below. It helps in addiding ice candidates
                const { peerConnection, remoteStream } = await createPeerConnection(addIce)

                // we dont know who we are talking to yet..
                // we will change it dynamically
                dispatch(addStream("remote1", remoteStream, peerConnection));

                // we finally have a peer connection, we can make an offer

                largeFeedEl.current.srcObject = remoteStream
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
                const resp = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/verify-link`, { token })

                // console.log("main vid data: ",resp?.data);

                setApptInfo(resp?.data)
                console.log("respp main vid token: ",resp?.data);

                // set the _idref here so that it can change automatically
                _idRef.current = resp?.data?._id

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

                        // clientSocketListeners(socket,dispatch);
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

    useEffect(()=>{
        // we cant update util remote1 is set
        if(streams?.remote1){
            streamsRef.current = streams
        }
    },[streams])

    const addIceCandidatesToPc = (iceCandidate)=>{
        for(const s in streamsRef.current){
            if(s!=="localStream"){
                const pc = streamsRef.current[s].peerConnection
                pc.addIceCandidate(iceCandidate);
                console.log("ice candidate added to client");
                setShowCallInfo(false)
            }
        }
    }

    useEffect(() => {
        const token = searchParams.get('token');
        const socket = socketConnection(token);

        clientSocketListeners(socket,dispatch,addIceCandidatesToPc); // here we are listening for apptData event to get the appointments of the professional
    }, [])

    const addIce = (iceCandidate)=>{
        //emit icecandidates to the server (not professional)
        const token = searchParams.get('token')
        const socket = socketConnection(token);
        // console.log("ref:: ",_idRef?.current);

        socket.emit('iceToServer',{
            iceCandidate,
            userType:"client",
            // _id:apptInfo?._id, // this will not work as uiqueId might change
            // we need a way to auto update _id, 
            //that's why we will use useRef hook
            _id:_idRef?.current
            // this will keep _id updated without rerendring
        })
        

    }
    return (
        <div className="main-video-page">
            <div className="video-chat-wrapper">
                {/* Div to hold our remote video, our local video, and our chat window*/}

                <video id="large-feed" ref={largeFeedEl} autoPlay controls  playsInline></video>

                <video id="own-feed" ref={smallFeedEl} autoPlay controls  playsInline></video>

                {showCallInfo ? <CallInfo apptInfo={apptInfo} /> : <></>}

                <ChatWindow />
            </div>
            <ActionButtons smallFeedEl={smallFeedEl} largeFeedEl={largeFeedEl} />

        </div>
    )
}

export default MainVideoPage