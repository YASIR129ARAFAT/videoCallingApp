const getDevices = () => {
    return new Promise(async (resolve, reject) => {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices()
        // console.log("fro main:",mediaDevices);
        const audioInputDevices = mediaDevices.filter((d) => {
            return d.kind === "audioinput";
        })
        const audioOutputDevices = mediaDevices.filter((d) => {
            return d.kind === "audiooutput";
        })
        const videoInputDevices = mediaDevices.filter((d) => {
            return d.kind === "videoinput";
        })

        resolve({
            audioInputDevices,
            videoInputDevices,
            audioOutputDevices
        })
    })
}

export default getDevices