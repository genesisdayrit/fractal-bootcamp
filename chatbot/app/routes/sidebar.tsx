// look up the user_chats and retrieve all of the chats where user id order by updated_at desc

export default function SideBar() {
    return (
        <>
        <div className="">
            <div id="new-chat-button" className="justify-flex-start max-h">
                Start New Chat
            </div>
            <div id="sidebar" className="justify-flex-start max-h">
                Previous Chats
            </div>
        </div>
        </>
    )
}