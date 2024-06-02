import {io} from 'socket.io-client'

const socket = io.connect("https://localhost:8000")

export default socket;