import axios from "axios";
import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react"; 
function ChatDialog({ user, onClose }) {

    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
	const [currUser, setCurrUser] = useState(null);
    const [message, setMessage] = useState("");
	useEffect(() => {

    const loadCurrentUser = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/users/me",
                {
                    withCredentials: true
                }
            );

            setCurrUser(response.data.user);

        } catch (error) {
            console.log(
                error.response?.data || error.message
            );
        }
    };

    loadCurrentUser();

}, []);
    // Load existing messages
    useEffect(() => {

        const loadMessages = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/messages/${user._id}`,
                    {
                        withCredentials: true,
                    }
                );

                setMessages(response.data.messages);

            } catch (error) {
                console.log(
                    error.response?.data || error.message
                );
            }
        };

        loadMessages();

    }, [user._id]);


    // Socket.IO - real-time messages
    useEffect(() => {

        const socket = io("http://localhost:5000");

        socket.on("newMessage", (data) => {

            const newMessage = data.message;

            // Only add message if it belongs to this chat
            if (
				newMessage.sender === user._id ||
				newMessage.receiver === user._id
			) {
				setMessages((prevMessages) => [
					...prevMessages,
					newMessage
				]);
			}

        });

        return () => {
            socket.disconnect();
        };

    }, [user._id]);


    // Scroll to latest message
    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });

    }, [messages]);
	const sendMessage = async () => {
    if (!message.trim()) {
        return;
    }

    try {
        await axios.post(
            "http://localhost:5000/api/messages",
            {
                receiverId: user._id,
                message: message,
            },
            {
                withCredentials: true,
            }
        );

        setMessage("");

    } catch (error) {
        console.log(
            error.response?.data || error.message
        );
    }
};

    return (
        <div
            className="modal d-block container-fluid"
            tabIndex="-1"
            style={{
                backgroundColor: "rgba(0,0,0,0.5)"
            }}
        >
            <div className="modal-dialog">

                <div className="modal-content">

                    {/* Header */}
                    <div className="modal-header">

                        <div className="d-flex align-items-center">

                            <img
                                src={user.avatar}
                                alt={user.username}
                                style={{
                                    width: "45px",
                                    height: "45px",
                                    borderRadius: "50%",
                                    marginRight: "10px"
                                }}
                            />

                            <div>
                                <h5 className="mb-0">
                                    {user.name}
                                </h5>

                                <small className="text-body-secondary">
                                    @{user.username}
                                </small>
                            </div>

                        </div>

                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>

                    </div>


                    {/* Messages */}
                    <div
                        className="modal-body"
                        style={{
                            minHeight: "300px",
                            maxHeight: "400px",
                            overflowY: "auto"
                        }}
                    >

					{messages.length === 0 ? (

						<p className="text-center text-body-secondary">
							No messages yet
						</p>

					) : (

						messages.map((msg) => {

							const isMyMessage = msg.sender === currUser?._id;

							return (
								<div
									key={msg._id}
									className={`d-flex mb-2 ${
										isMyMessage
											? "justify-content-end"
											: "justify-content-start"
									}`}
								>

									<div
										className={`px-3 py-2 rounded ${
											isMyMessage
												? "bg-primary text-white"
												: "bg-light text-dark border"
										}`}
										style={{
											maxWidth: "75%",
											wordBreak: "break-word"
										}}
									>
										{msg.message}
									</div>

								</div>
							);
						})

					)}

                        <div ref={messagesEndRef}></div>
						<div className="d-flex gap-2 mt-3">

						<input
							type="text"
							className="form-control"
							placeholder="Type a message..."
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									sendMessage();
								}
							}}
						/>

						<button
							className="btn btn-primary"
							onClick={sendMessage}
						>
							Send
						</button>

					</div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default ChatDialog;