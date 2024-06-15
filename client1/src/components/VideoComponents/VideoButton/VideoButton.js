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

    const startStopVideo = () => {
        // console.log("checking video button");

        //1 check if video is enabled  if so disable it
        // 2 check if the video is disabled if so enable it
        // 3 check if the media is available, if so start the stream
        // 4 if media is not availble then wait for it and then start the stream

        if (callStatus.video === 'enabled') {
            dispatch(updateCallStatus('video', 'disabled'));
            const tracks = streams?.localStream?.stream?.getVideoTracks()
            tracks.forEach(element => {
                element.enabled = false;
            });
        }
        else if (callStatus.video === 'disabled') {
            dispatch(updateCallStatus('video', 'enabled'));
            const tracks = streams?.localStream?.stream?.getVideoTracks()
            tracks.forEach(element => {
                element.enabled = true;
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

    // handler for dropDown
    function handleVideoDeviceChange(e){
        changeVideoDevice(e,dispatch,callStatus,addStream,smallFeedEl,updateCallStatus)
    }
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
                        handleChange={handleVideoDeviceChange}
                        type='video'
                    /> 
                    : 
                    <></>
            }
        </div>
    )
}

export default VideoButton