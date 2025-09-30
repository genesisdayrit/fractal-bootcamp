import { useState } from "react"
import { redirect, Form } from "react-router"
import { authClient } from "~/lib/auth-client"
import { Input } from "../components/ui/input"
import { Button } from "~/components/ui/button"


export default function SignIn() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const signIn = async () => {
        await authClient.signIn.email(
            {
                email,
                password,
                callbackURL: "/"
            },
            {
                onRequest: (ctx) => {
                    // show loading state
                },
                onSuccess: (ctx) => {
                    const authToken = ctx.response.headers.get("set-auth-token");
                        if (authToken) {
                    localStorage.setItem("bearer_token", authToken);
                    }
                },
                onError: (ctx) => {
                    alert(ctx.error)
                },
            },
        )
    }

    return (
        <div className="flex flex-col justify-center items-center gap-4 h-screen w-3xl mx-auto">
            <h2 className="">
                Sign In to Chatbot
            </h2>
            <Form onSubmit={signIn} className="flex flex-col gap-4 border w-md p-8 ">
                <label htmlFor="nameInput">Email:</label>
                <Input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="nameInput">Password:</label>
                <Input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                < Button>Sign In</Button>
            </Form>

        </div>

        
    )
}