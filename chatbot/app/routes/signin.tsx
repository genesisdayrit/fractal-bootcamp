import { useState } from "react"
import { Form } from "react-router"
import { authClient } from "~/lib/auth-client"

export default function SignIn() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const signIn = async () => {
        await authClient.signIn.email(
            {
                email,
                password,
            },
            {
                onRequest: (ctx) => {
                    // show loading state
                },
                onSuccess: (ctx) => {
                    // redirect to home
                },
                onError: (ctx) => {
                    alert(ctx.error)
                },
            },
        )
    }

    return (
        <div>
            <h2 className="">
                Sign In
            </h2>
            <Form onSubmit={signIn} className="flex flex-col">
                <input
                    className="bg-black font-white"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    type="submit"
                >
                    Sign In
                </button>
            </Form>
        </div>
    )
}