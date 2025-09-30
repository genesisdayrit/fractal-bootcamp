export default function App() {
    return (
        <>
        <div id="parent-div" className="flex flex-row bg-white justify-center max-w max-h">
            <div id="sidebar" className="border justify-flex-start max-h">
            Previous Chats</div>
            <div id="main-chat-section" className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4">
                <div className="p-4 bg-gray-100 border-b">Main Section Title</div>
                <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4">Active Messages</div>
                <div className="p-4 bg-gray-100 border-t flex items-center">
                    <input type="text" placeholder="Type your message..." className="flex-1 p-3 border rounded-lg" />
                    <button className="ml-2 bg-black text-white p-3 rounded-lg">Send</button>
                </div>
            </div>
        </div>
        </>
    )
}