import { useState } from 'react'
import { useLoaderData, Form, useSubmit, useActionData, type LoaderFunctionArgs, type ActionFunctionArgs, redirect } from "react-router";
import { auth } from "../lib/auth-server"
import { createChat, insertChatMessage } from "../db/queries"
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { randomUUID } from 'crypto'

export async function loader({ request }: LoaderFunctionArgs) {
    try {
        const session = await auth.api.getSession({ 
            headers: request.headers 
        });
        
        console.log("Session:", session);
        
        return { 
            user: session?.user || null,
            isAuthenticated: !!session?.user 
        };
    } catch (error) {
        console.error("Session error:", error);
        return { 
            user: null, 
            isAuthenticated: false 
        };
    }
}

// action function to handle chat creation and immediate redirect
export async function action({ request }: ActionFunctionArgs) {
    try {
        const formData = await request.formData();
        const message = formData.get("message") as string;
        const userId = formData.get("userId") as string;
        
        // generate chatId
        const chatId = randomUUID();

        // create chat title from first 20 characters of message
        const titleLimitChars = 20;
        const chatTitle = message.substring(0, titleLimitChars);

        console.log("Creating chat with:", { chatId, message, userId, chatTitle });

        // use createChat insert query from db/queries.ts to insert new chat
        const newChat = await createChat(chatId, userId, chatTitle);
        console.log("Chat created:", newChat);

        // insert the user's message in chat_messages using insertChatMessage() from db/queries
        const userMessageId = randomUUID();
        await insertChatMessage(
            userMessageId,
            chatId,
            userId,
            message,
            "user",
            { model: "gpt-4o" }
        );
        console.log("User message inserted");

        // redirect immediately to chat/:id - the chat page will detect this is initial by checking if there's only a user message
        return redirect(`/chat/${chatId}`);

    } catch (error) {
        console.error("Error creating chat:", error);
        return { 
            success: false, 
            error: "Failed to create chat" 
        };
    }
}

export default function App() {
    const { user, isAuthenticated } = useLoaderData<typeof loader>();
    const [message, setMessage] = useState('')
    const submit = useSubmit()
    const actionData = useActionData<typeof action>()

    console.log("Better Auth user from loader:", user);

    const onSend = async () => {
        console.log('clicked')
        const chatId = crypto.randomUUID()
        
        console.log('message:', message)
        console.log('chatId:', chatId)

        // using react router 7's form submit function
        const formData = new FormData()
        formData.append("chatId", chatId)
        formData.append("message", message)
        formData.append("userId", user?.id || "")
    
        submit(formData, { method: "post" })
    }

    return (
        <div className="flex flex-col h-screen justify-center items-center text-center gap-8">
            <div>What's on your mind today?</div>    
            <div id="home-message-section">
                <input 
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 p-3 border rounded-lg w-96"
                    onChange={(e) => {
                        setMessage(e.target.value)
                        console.log(e.target.value)
                    }}
                />
                <button onClick={onSend} className="ml-2 bg-black text-white p-3 rounded-lg">Send</button>
            </div>
        </div>
    )
}