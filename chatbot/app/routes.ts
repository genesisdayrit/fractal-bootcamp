import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    // route("protected", 'routes/protected.tsx'),
    route("api/auth/*", "routes/auth-handler.ts"),
    route("signup", "routes/signup.tsx"),
    route("signin", "routes/signin.tsx"),
    route("app", "routes/app.tsx"),
] satisfies RouteConfig;