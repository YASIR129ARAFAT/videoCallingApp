import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import startLocalVideoStream from "./startLocalVideoStream.js"
import updateCallStatus from "../../../redux-elements/actions/updateCallStatus.js"
import DropDown from "./DropDown.js"
import getDevices from "../../../webRTCutilities/getDevices.js"
import changeVideoDevice from "../../../handlers/changeVideoDevice.handler.js"
import addStream from '../../../redux-elements/actions/addStream';

const VideoButton = ({ smallFeedEl, largeFeedEl }) => {
    const callStatus = useSelector(state => state.callStatus)
    const streams = useSelector(state => state.streams)
    const [pendingUpdate, setPendingUpdate] = useState(false);
    const dispatch = useDispatch();
    const [caretOpen, setCaretOpen] = useState(false);
    const [videoDeviceList, setVideoDeviceList] = useState([]);

    //DropDown functional and component is in separate file

    useEffect(() => {
        async function getDevicesAsync() {
            if (caretOpen) {

                try {
                    const devicesList = await getDevices()
                    setVideoDeviceList(devicesList?.videoInputDevices)
                    // console.log(devicesList);
                } catch (error) {
                    console.log(error);
                }
            }
        }
        getDevicesAsync()

    }, [caretOpen])




    // handler for dropDown
    // function handleVideoDeviceChange(e){
    //     changeVideoDevice(e,dispatch,callStatus,addStream,smallFeedEl,updateCallStatus)
    // }

    const changeVideoDevice = async (e) => {
        // if (callStatus?.video === 'off') {
        //     // user must turn on its video first to select device
        //     console.log("please turn on video first");
        //     return;
        // }
        console.log("vid device changed..");
        const deviceId = e.target.value;

        //prepare the newConstraint with new video devices
        const newConstraint = {
            audio: (callStatus?.audioDevice === "default") ? true : { deviceId: { exact: callStatus?.audioDevice } },
            video: { deviceId: { exact: deviceId } }
        }

        // fetch the stream with newConstraints
        const stream = await navigator.mediaDevices.getUserMedia(newConstraint)

        //update the redux state for video device
        dispatch(updateCallStatus('videoDevice', deviceId));
        dispatch(updateCallStatus("video", "enabled"))
        //update the local stream
        smallFeedEl.current.srcObject = stream;

        //update the redux stream state
        dispatch(addStream('localStream', stream));

        const [videoTrack] = stream.getVideoTracks()
        // we will come back to this
        // if we directly change tracks then it will need renegotiation that is sending offer, icecandidates etc again
        for(const s in streams){
            if(s !== "localStream"){
                //getSenders will grab all the RTCRtpSenders that the PC has
                //RTCRtpSender manages how tracks are sent via the PC
                const senders = streams[s].peerConnection.getSenders();
                //find the sender that is in charge of the video track
                const sender = senders.find(s=>{
                    if(s.track){
                        //if this track matches the videoTrack kind, return it
                        return s.track.kind === videoTrack.kind
                    }else{
                        return false;
                    }
                })
                //sender is RTCRtpSender, so it can replace the track
                sender.replaceTrack(videoTrack)
            }
        }


    }

    const startStopVideo = () => {
        // console.log("checking video button");

        //1 check if video is enabled  if so disable it
        // 2 check if the video is disabled if so enable it
        // 3 check if the media is available, if so start the stream
        // 4 if media is not availble then wait for it and then start the stream

        // console.log("call video before: " ,callStatus);
        if (callStatus.video === 'enabled') {
            console.log("video button disabled..");
            dispatch(updateCallStatus('video', 'disabled'));
            const tracks = streams?.localStream?.stream?.getVideoTracks()
            tracks.forEach(element => {
                element.enabled = false;
                console.log("dd");
            });
        }
        else if (callStatus.video === 'disabled') {
            console.log("video button enabled..");
            dispatch(updateCallStatus('video', 'enabled'));
            const tracks = streams?.localStream?.stream?.getVideoTracks()
            tracks.forEach(element => {
                element.enabled = true;
                console.log("dd");
            });
        }
        else if (callStatus?.haveMedia) {
            // we have the media show the feed
            smallFeedEl.current.srcObject = streams?.localStream?.stream;

            // now add the tracks to existing peerConnections
            startLocalVideoStream(streams, dispatch)
        }
        else {
            setPendingUpdate(true)
        }
        // console.log("call video after: " ,callStatus);

    }
    useEffect(() => {
        //this useEffect will run if our pendinag update is changed to true or callStatus gets the media
        if (pendingUpdate && callStatus?.haveMedia) {
            setPendingUpdate(false)
            smallFeedEl.current.srcObject = streams?.localStream?.stream;
            // console.log("done...");
            startLocalVideoStream(streams, dispatch)
        }
    }, [pendingUpdate, callStatus?.haveMedia])
    return (
        <div className="button-wrapper video-button d-inline-block">
            <i className="fa fa-caret-up choose-video" onClick={() => {
                setCaretOpen(!caretOpen)
            }}></i>
            <div className="button camera" onClick={startStopVideo}>
                <i className="fa fa-video"></i>
                <div className="btn-text">{callStatus.video === "enabled" ? "Stop" : "Start"} Video</div>
            </div>
            {
                caretOpen ?
                    <DropDown
                        deviceList={videoDeviceList}
                        defaultValue={callStatus?.videoDevice}
                        handleChange={changeVideoDevice}
                        type='video'
                    />
                    :
                    <></>
            }
        </div>
    )
}

export default VideoButton