// import type { Route } from "./+types/home";
// import { Welcome } from "../welcome/welcome";

// export function meta({}: Route.MetaArgs) {
//   return [
//     { title: "New React Router App" },
//     { name: "description", content: "Welcome to React Router!" },
//   ];
// }

// export default function Home() {
//   return <Welcome />;
// }

import { redirect } from 'react-router'
import { Button } from "~/components/ui/button"
import { Link } from "react-router-dom"
 
import SignIn from '~/routes/signin'
import SignUp from '~/routes/signup'
// import type { Route } from "./+types/home"
// import type { Route } from "./+types/protected"
 
export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ]
}

function goToSignUp() {
    throw redirect("/signup")

}
 
export default function Home() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      <Button asChild>
        <Link to="/signup">Sign up</Link>
      </Button>
      <Button asChild>
        <Link to="/signin">Sign In</Link>
      </Button>
    </div>
  )
}