// import { someApi } from "./api";
// import { openai } from '@ai-sdk/openai';
// import { generateText } from 'ai';

import { useState, useEffect } from 'react'
import { useSubmit, useActionData, Form, type ActionFunctionArgs, redirect } from "react-router";

// import { openai } from '@ai-sdk/openai';
// import { streamText, convertToModelMessages, type UIMessage } from 'ai';
// import { createChat, insertChatMessage } from '../db/queries';
// import { authClient } from '../lib/auth-client';
// import { auth } from '../lib/auth-server';
import { useNavigate } from "react-router-dom"

export default function App() {

    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    const onSend = () => {
        console.log('clicked')
        // let gameId = randomUUID()
        const gameId = crypto.randomUUID()
        navigate(`/chat/${gameId}`)
    }

    return (
        <>
        <div className="flex flex-col h-screen justify-center items-center text-center gap-8">
        <div>What's on your mind today?</div>
        <div id="home-message-section">
            <input 
                type="text"
                placeholder="Type your message..."
                className="flex-1 p-3 border rounded-lg w-96"
                onChange= {(e) => {
                    setMessage(e.target.value)
                    console.log(message)
                }}
            />
            <button onClick={onSend} className="ml-2 bg-black text-white p-3 rounded-lg">Send</button>
        </div>
        </div>
        </>
    )
}
