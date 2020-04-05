import io from "socket.io-client";
let socket = io("http://localhost:5000/crazy");
export default socket;