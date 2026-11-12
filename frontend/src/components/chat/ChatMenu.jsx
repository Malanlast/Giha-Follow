import "./ChatMenu.css";
import { useEffect, useRef, useState } from "react";

function ChatMenu({ githubUsername, onDeleteConversation }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const handleViewProfile = () => {
        if (!githubUsername) return;

        window.open(
            `https://github.com/${githubUsername}`,
            "_blank",
            "noopener,noreferrer"
        );

        setIsOpen(false);
    };

    const handleDelete = () => {
        setIsOpen(false);
        onDeleteConversation?.();
    };

    return (
        <div className="chat-menu" ref={menuRef}>
            <button
                type="button"
                className="chat-menu-trigger"
                onClick={() => setIsOpen((previous) => !previous)}
                aria-label="Chat options"
                aria-expanded={isOpen}
            >
                <i className="bi bi-three-dots-vertical"></i>
            </button>

            {isOpen && (
                <div className="chat-menu-dropdown">
                    <div className="chat-menu-heading">
                        CONVERSATION OPTIONS
                    </div>

                    <button
                        type="button"
                        className="chat-menu-item"
                        onClick={handleViewProfile}
                    >
                        <i className="bi bi-github"></i>
                        <span>View GitHub Profile</span>
                        <i className="bi bi-box-arrow-up-right menu-external-icon"></i>
                    </button>

                    <div className="chat-menu-divider"></div>

                    <button
                        type="button"
                        className="chat-menu-item delete"
                        onClick={handleDelete}
                    >
                        <i className="bi bi-trash3"></i>
                        <span>Delete Conversation</span>
                    </button>
                </div>
            )}
        </div>
    );
}

export default ChatMenu;