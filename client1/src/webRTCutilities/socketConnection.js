import { io } from "socket.io-client";

let socket;
const socketConnection = (token) => {
    //if socket connection is alredy made then just return it else form a aconnection
    if (socket && socket?.connected) {
        return socket;
    } else {
        socket = io.connect("https://localhost:8000", {
            auth: {
                token,
            },
        });
        return socket;
    }

};

export default socketConnection;
