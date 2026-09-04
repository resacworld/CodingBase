import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("hello", "routes/hello.tsx"),
    route("product/:id", "routes/product.$id.tsx"),
    route("api/hello", "routes/api.hello.tsx"),
] satisfies RouteConfig;
