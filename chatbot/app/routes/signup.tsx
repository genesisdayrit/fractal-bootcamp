import { useState } from "react"
import { redirect, Form } from "react-router"
import { authClient } from "../lib/auth-client"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"

export default function SignUp() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")

  const signUp = async () => {
    await authClient.signUp.email(
      {
        email,
        password,
        name,
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
    <div className="flex flex-col justify-center items-center gap-4 h-screen mx-auto w-3xl">
      <h2>
        Sign Up to Chatbot
      </h2>
      <Form
        onSubmit={signUp}
        className="flex flex-col gap-4 border w-md p-8 "
      >
        <label htmlFor="nameInput">Name:</label>
        <Input 
            type="name"
            value={name}
            // placeholder="Name"
            onChange={(e) => setName(e.target.value)}
        />
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

        <Button>Sign Up</Button>
      </Form>
    </div>
  )
}