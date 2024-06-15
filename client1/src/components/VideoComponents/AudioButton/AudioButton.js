import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux"
import DropDown from "../VideoButton/DropDown.js";
import getDevices from '../../../webRTCutilities/getDevices.js'
import changeAudioDevice from "../../../handlers/changeAudioDevice.handler.js";
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

    function handleVideoDeviceChange(e) {
        console.log("change in audio device");
        changeAudioDevice(e, addStream, smallFeedEl, callStatus, dispatch, updateCallStatus)
    }

    function muteUnmute() {
        console.log("checking audio button");

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
        } catch (error) {
            console.log(error);
        }
    }

    let micText;
    if (callStatus?.audio === "off") {
        micText = "Join Audio"
    } else if (callStatus?.audio === 'enabled') {
        micText = "Mute"
    } else {
        micText = "Unmute"
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
                        handleChange={handleVideoDeviceChange}
                        type="audio"
                    />
                    :
                    <></>
            }
        </div>
    )
}

export default AudioButton