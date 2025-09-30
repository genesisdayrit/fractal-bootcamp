import Sidebar from './sidebar'


// retrieve messages where chat id and user id 

// list user previous chat
// when clicking a previous chat, 

// on send, we need to send a post request to openai to get a response
// on send from 


export default function App() {
    return (
        <>
        <div id="parent-div" className="flex flex-row bg-white justify-center max-w max-h">
            <Sidebar />
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