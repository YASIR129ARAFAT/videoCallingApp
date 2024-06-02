const addStream = (who,stream)=>{
    return {
        type:"ADD_STREAM",
        payload:{
            who,
            stream
        }
    }
}

export default addStream;