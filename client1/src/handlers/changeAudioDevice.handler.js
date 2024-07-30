

const changeAudioDeviceHandler = async (e, addStream, smallFeedEl, callStatus, dispatch, updateCallStatus) => {
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
            const streams = await navigator.mediaDevices.getUserMedia(newConstraints)

            //update the redux state for audio device
            dispatch(updateCallStatus('audioDevice', deviceId));

            dispatch(updateCallStatus('audio','enabled'))

            //update the redux stream state
            dispatch(addStream('localStream', streams));

            const tracks = streams.getAudioTracks()
            // we will come back here

        }
    } catch (error) {
        console.log(error);
    }
}

export default changeAudioDeviceHandler