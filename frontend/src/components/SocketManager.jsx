import { useEffect } from "react";
import { socket } from "../socket";

function SocketManager() {
    useEffect(() => {
        socket.connect();

        return () => {
            socket.disconnect();
        };
    }, []);

    return null;
}

export default SocketManager;