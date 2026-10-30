import { io } from "socket.io-client";

const API = "http://localhost:5000";

export const socket = io(API, {
    withCredentials: true,
    autoConnect: false,
});