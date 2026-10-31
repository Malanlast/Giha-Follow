import "./ChatMenu.css";
import { useEffect, useRef, useState } from "react"; 
function ChatMenu({ githubUsername, onDeleteConversation }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
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
            <button className="chat-menu-trigger" onClick={() => setIsOpen(prev => !prev)}>
				<i className="bi bi-three-dots-vertical"></i>
			</button>
            {isOpen && (
                <div className="chat-menu-dropdown">
                    <button className="chat-menu-item" onClick={handleViewProfile}>
					<i className="bi bi-github"></i>
					<span>View GitHub Profile</span>
					</button>
					<button className="chat-menu-item delete" onClick={handleDelete}>
						<i className="bi bi-trash3"></i>
						<span>Delete Conversation</span>
					</button>
                </div>
            )}
        </div>
    );
}
export default ChatMenu;
