const initState = {
    current: "idle", //negotiating, progress, complete
    video: "off", //video feed status: "off" "enabled" "disabled" "complete"
    audio: "off", //audio feed status: "off" "enabled" "disabled" "complete"
    audioDevice: 'default', //contains device id of choosen audio output device (we dont care about the output device) 
    videoDevice: 'default', // contains device id of choosen video output device
    shareScreen: false, 
    haveMedia: false, //is there a localStream, has getUserMedia been run
    haveCreatedOffer: false, // if offer is already created then we will not create it again
    haveCreatedAnswer: false, // if answer is already created then we will not create it again
}

export default (state = initState, action)=>{
    if (action.type === "UPDATE_CALL_STATUS"){
        // console.log("action");
        // console.log(action);
        const copyState = {...state}
        copyState[action.payload.prop] = action.payload.value
        // console.log(copyState.video);
        return copyState
    }else if((action.type === "LOGOUT_ACTION") || (action.type === "NEW_VERSION")){
        return initState
    }else{
        return state
    }
}