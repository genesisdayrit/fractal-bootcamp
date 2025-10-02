import { useState, useEffect } from 'react';
import { useLoaderData, useActionData, useSubmit, useRevalidator, useLocation, type LoaderFunctionArgs, type ActionFunctionArgs } from "react-router";
import { auth } from "../lib/auth-server";
import { getChatMessages, insertChatMessage, getChatHistory } from "../db/queries";
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { randomUUID } from 'crypto';
import Sidebar from './sidebar';

export async function loader({ request, params }: LoaderFunctionArgs) {
    try {
        const { chatId } = params;
        
        // get user session
        const session = await auth.api.getSession({ 
            headers: request.headers 
        });
        
        if (!session?.user) {
            throw new Response("Unauthorized", { status: 401 });
        }

        // get chat messages
        const messages = await getChatMessages(chatId!);
        
        return { 
            chatId,
            messages,
            user: session.user
        };
    } catch (error) {
        console.error("Chat loader error:", error);
        throw error;
    }
}

export async function action({ request, params }: ActionFunctionArgs) {
    try {
        const { chatId } = params;
        const formData = await request.formData();
        const actionType = formData.get("actionType") as string;

        if (actionType === "generateInitialResponse") {
            // handle initial ai response generation
            const message = formData.get("message") as string;
            const userId = formData.get("userId") as string;

            console.log("Action: generateInitialResponse called", { chatId, message, userId });

            // get conversation history (should just be the user message)
            const conversationHistory = await getChatHistory(chatId!);
            console.log("Conversation history:", conversationHistory);
            
            // generate ai response using vercel ai sdk
            const { text: aiResponse } = await generateText({
                model: openai('gpt-4o'),
                messages: conversationHistory,
            });

            console.log("AI response generated:", aiResponse.substring(0, 100) + "...");

            // insert ai response into chat_messages
            const aiMessageId = randomUUID();
            await insertChatMessage(
                aiMessageId,
                chatId!,
                userId,
                aiResponse,
                "assistant",
                { model: "gpt-4o" }
            );

            console.log("AI response inserted into database");
            return { success: true, type: "initialResponse" };

        } else if (actionType === "sendMessage") {
            // handle continuing conversation
            const message = formData.get("message") as string;
            const userId = formData.get("userId") as string;

            if (!message?.trim()) {
                return { success: false, error: "Message cannot be empty" };
            }

            // insert user message
            const userMessageId = randomUUID();
            await insertChatMessage(
                userMessageId,
                chatId!,
                userId,
                message,
                "user",
                { model: "gpt-4o" }
            );

            // get updated conversation history
            const conversationHistory = await getChatHistory(chatId!);
            
            // generate ai response using vercel ai sdk
            const { text: aiResponse } = await generateText({
                model: openai('gpt-4o'),
                messages: conversationHistory,
            });

            // insert ai response into chat_messages
            const aiMessageId = randomUUID();
            await insertChatMessage(
                aiMessageId,
                chatId!,
                userId,
                aiResponse,
                "assistant",
                { model: "gpt-4o" }
            );

            return { success: true, type: "continuedConversation" };
        }

        return { success: false, error: "Unknown action type" };

    } catch (error) {
        console.error("Chat action error:", error);
        return { 
            success: false, 
            error: "Failed to process request" 
        };
    }
}

export default function Chat() {
    const { chatId, messages, user } = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    const submit = useSubmit();
    const revalidator = useRevalidator();
    const location = useLocation();
    const [newMessage, setNewMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasTriggeredInitial, setHasTriggeredInitial] = useState(false);

    // handle initial message generation - detect if this is initial by checking if there's only a user message and no ai response
    useEffect(() => {
        const hasUserMessage = messages.some(msg => msg.role === 'user');
        const hasAIResponse = messages.some(msg => msg.role === 'assistant');
        const isInitialMessage = hasUserMessage && !hasAIResponse;
        
        console.log("Initial message check:", { 
            hasUserMessage, 
            hasAIResponse, 
            isInitialMessage, 
            hasTriggeredInitial, 
            userId: user?.id,
            messagesCount: messages.length,
            messages: messages.map(msg => ({ id: msg.id, role: msg.role, message: msg.message?.substring(0, 50) }))
        });
        
        if (isInitialMessage && !hasTriggeredInitial && user?.id) {
            setHasTriggeredInitial(true);
            
            // get the user message to pass to ai
            const userMessage = messages.find(msg => msg.role === 'user');
            console.log("Triggering initial AI response for message:", userMessage?.message);
            
            // trigger initial ai response generation
            const formData = new FormData();
            formData.append("actionType", "generateInitialResponse");
            formData.append("message", userMessage?.message || "");
            formData.append("userId", user.id);
            
            submit(formData, { method: "post" });
        }
    }, [messages, hasTriggeredInitial, submit, user?.id]);

    // revalidate after successful actions to get updated messages
    useEffect(() => {
        if (actionData?.success) {
            revalidator.revalidate();
        }
    }, [actionData, revalidator]);

    // handle continuing conversation
    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newMessage.trim() || isSubmitting) return;

        setIsSubmitting(true);
        
        const formData = new FormData();
        formData.append("actionType", "sendMessage");
        formData.append("message", newMessage);
        formData.append("userId", user?.id || "");
        
        submit(formData, { method: "post" });
        setNewMessage(''); // clear input immediately
        setIsSubmitting(false);
    };

    // check if ai is currently processing
    const isAIProcessing = isSubmitting || (actionData?.success && actionData?.type === "initialResponse");

    return (
        <div id="parent-div" className="flex flex-row bg-white justify-center max-w-full max-h-screen">
            <Sidebar />
            <div id="main-chat-section" className="flex-1 overflow-hidden flex flex-col">
                {/* chat header */}
                <div className="p-4 bg-gray-100 border-b">
                    <h2 className="font-semibold">Chat {chatId?.slice(0, 8)}...</h2>
                </div>
                
                {/* messages area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                        <div 
                            key={message.id} 
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.role === 'user' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-200 text-gray-800'
                            }`}>
                                <div className="text-sm font-medium mb-1">
                                    {message.role === 'user' ? 'You' : 'AI'}
                                </div>
                                <div className="whitespace-pre-wrap">
                                    {message.message}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* ai processing indicator */}
                    {(isAIProcessing || hasTriggeredInitial) && messages.length > 0 && 
                     !messages.some(msg => msg.role === 'assistant') && (
                        <div className="flex justify-start">
                            <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-200 text-gray-800">
                                <div className="text-sm font-medium mb-1">AI</div>
                                <div className="flex items-center space-x-1">
                                    <div className="animate-pulse">Thinking</div>
                                    <div className="flex space-x-1">
                                        <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
                                        <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                        <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* message input */}
                <div className="p-4 bg-gray-100 border-t">
                    <form onSubmit={handleSend} className="flex items-center space-x-2">
                        <input 
                            type="text" 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..." 
                            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isSubmitting}
                        />
                        <button 
                            type="submit"
                            disabled={!newMessage.trim() || isSubmitting}
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Sending...' : 'Send'}
                        </button>
                    </form>
                    
                    {actionData?.error && (
                        <div className="mt-2 text-red-600 text-sm">
                            {actionData.error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}