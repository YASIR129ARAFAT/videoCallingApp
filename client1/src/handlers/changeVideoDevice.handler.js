

const changeVideoDevice = async (e,dispatch,callStatus,addStream,smallFeedEl,updateCallStatus) => {
    if (callStatus?.video === 'off') {
      // user must turn on its video first to select device
      console.log("please turn on video first");
      return;
    }
    console.log("vid device changed..");
    const deviceId = e.target.value;

    //prepare the newConstraint with new video devices
    const newConstraint = {
      audio: (callStatus?.audioDevice === "default") ? true : { deviceId: { exact: callStatus?.audioDevice } },
      video: { deviceId: { exact: deviceId } }
    }

    // fetch the stream with newConstraints
    const streams = await navigator.mediaDevices.getUserMedia(newConstraint)

    //update the redux state for video device
    dispatch(updateCallStatus('videoDevice', deviceId));

    //update the local stream
    smallFeedEl.current.srcObject = streams;

    //update the redux stream state
    dispatch(addStream('localStream', streams));

    const tracks = streams.getVideoTracks()
    // we will come back to this
    // if we directly change tracks then it will nedd renegotiation that is sending offer, icecandidates etc again


  }

  export default changeVideoDevice