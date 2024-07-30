import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux"
import DropDown from "../VideoButton/DropDown.js";
import getDevices from '../../../webRTCutilities/getDevices.js'

import updateCallStatus from "../../../redux-elements/actions/updateCallStatus.js"
import addStream from "../../../redux-elements/actions/addStream.js";
import startAudioStream from "./startAudioStream.js";

// devices will not be displayed if audio permission is not given but in case of video this will not be the case
function AudioButton({ smallFeedEl }) {
    const callStatus = useSelector(state => state.callStatus);
    const streams = useSelector(state => state.streams)
    const [caretOpen, setCaretOpen] = useState(false)
    const [audioDeviceList, setAudioDeviceList] = useState([]);
    const dispatch = useDispatch();


    let micText;
    if (callStatus?.audio === "off") {
        micText = "Join Audio"
    } else if (callStatus?.audio === 'enabled') {
        micText = "Mute"
    } else {
        micText = "Unmute"
    }

    useEffect(() => {
        async function getAudioDevices() {
            if (caretOpen) {
                try {
                    const devices = await getDevices()
                    // console.log(devices);
                    setAudioDeviceList([...devices?.audioInputDevices, ...devices?.audioOutputDevices]) // put both audio input and output in the same array
                } catch (error) {
                    console.log(error);
                }
            }
        }
        getAudioDevices()
    }, [caretOpen])

    function muteUnmute() {
        console.log("checking audio button");
        // console.log("call audio before: " ,callStatus);

        //1 check if audio is enabled  if so disable it
        // 2 check if the audio is disabled if so enable it


        try {
            if (callStatus?.audio === 'enabled') {
                dispatch(updateCallStatus('audio', 'disabled'));
                const tracks = streams?.localStream?.stream?.getAudioTracks()
                tracks.forEach(element => {
                    element.enabled = false;
                });
            }
            else if (callStatus?.audio === 'disabled') {
                dispatch(updateCallStatus('audio', 'enabled'));
                const tracks = streams?.localStream?.stream?.getAudioTracks()
                tracks.forEach(element => {
                    element.enabled = true;
                });
            } else if (callStatus?.audio === 'off') {
                // we cant have e here using which we can access the value e.target.value
                // but we can fake it
                // use the value of 
                changeAudioDevice({ target: { value: `idefault` } }, addStream, smallFeedEl, callStatus, dispatch, updateCallStatus)

                startAudioStream(streams)
            }
            // console.log("call audio after: " ,callStatus);
        } catch (error) {
            console.log(error);
        }
    }

    // function handleAudioDeviceChange(e) {
    //     console.log("change in audio device");
    //     changeAudioDevice(e, addStream, smallFeedEl, callStatus, dispatch, updateCallStatus)
    // }


    const changeAudioDevice = async (e) => {
        //audio type specifies 
        try {

            const deviceId = e.target.value?.slice(1)
            const audioType = e.target.value?.slice(0, 1)

            // console.log(e.target.value);
            // console.log(audioType);
            // console.log(deviceId);

            if (audioType === 'o') { // output
                smallFeedEl.current.setSinkId(deviceId)

            }
            else if (audioType === 'i') {
                // get new user media with defined constrainst

                const newConstraints = {
                    audio: { deviceId: { exact: deviceId } },
                    video: (callStatus?.videoDevice === 'default') ? (true) : ({ deviceId: { exact: callStatus?.videoDevice } })
                }
                // fetch the stream with newConstraints
                const stream = await navigator.mediaDevices.getUserMedia(newConstraints)

                //update the redux state for audio device
                dispatch(updateCallStatus('audioDevice', deviceId));

                dispatch(updateCallStatus('audio', 'enabled'))

                //update the redux stream state
                dispatch(addStream('localStream', stream));

                const [audioTrack] = stream.getAudioTracks()
                // we will come back here
                for(const s in streams){
                    if(s !== "localStream"){
                        //getSenders will grab all the RTCRtpSenders that the PC has
                        //RTCRtpSender manages how tracks are sent via the PC
                        const senders = streams[s].peerConnection.getSenders();
                        //find the sender that is in charge of the video track
                        const sender = senders.find(s=>{
                            if(s.track){
                                //if this track matches the videoTrack kind, return it
                                return s.track.kind === audioTrack.kind
                            }else{
                                return false;
                            }
                        })
                        //sender is RTCRtpSender, so it can replace the track
                        sender.replaceTrack(audioTrack)
                    }
                }
    

            }
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className="button-wrapper d-inline-block">
            <i className="fa fa-caret-up choose-audio" onClick={
                () => { setCaretOpen(!caretOpen) }}
            ></i>
            <div className="button mic" onClick={muteUnmute}>
                <i className="fa fa-microphone"></i>
                <div className="btn-text">{micText}</div>
            </div>
            {
                caretOpen ?
                    <DropDown
                        deviceList={audioDeviceList}
                        defaultValue={callStatus?.audioDevice}
                        handleChange={changeAudioDevice}
                        type="audio"
                    />
                    :
                    <></>
            }
        </div>
    )
}

export default AudioButton