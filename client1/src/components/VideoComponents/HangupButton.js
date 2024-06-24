import { useDispatch, useSelector } from "react-redux"
import updateCallStatus from "../../redux-elements/actions/updateCallStatus"

const HangupButton = ({smallFeedEl,largeFeedEl})=>{

    const dispatch = useDispatch()
    const callStatus = useSelector(state=>state.callStatus)
    const streams = useSelector(state=>state.streams)

    const hangupCall = ()=>{
        dispatch(updateCallStatus('current','complete'))
        for(const s in streams){
            if(streams[s].peerConnection){
                streams[s].peerConnection.close()
                streams[s].peerConnection.onicecandidate = null;
                streams[s].peerConnection.onaddstream = null;
                streams[s].peerConnection = null;
            }
        }
        largeFeedEl.current.srcObject = null;
        smallFeedEl.current.srcObject = null;
    }

    if(callStatus.current === "complete"){
        return <></>
    }

    return(
        <button 
            onClick={hangupCall} 
            className="btn btn-danger hang-up"
        >Hang Up</button>
    )
}

export default HangupButton