// on send, do a post to create a new chat id record in the id and create a new message
// await the response of the chat id
// should create a chat and redirect to /chat/:id (on that page, retrieve all the messages where = chat id)

export default function App() {
    return (
        <>
        <div className="flex flex-col h-screen justify-center items-center text-center gap-8">
        <div>What's on your mind today?</div>
        <div id="home-message-section">
            <input 
                type="text"
                placeholder="Type your message..."
                className="flex-1 p-3 border rounded-lg w-96"
            />
            <button className="ml-2 bg-black text-white p-3 rounded-lg">Send</button>
        </div>
        </div>
        </>
    )
}