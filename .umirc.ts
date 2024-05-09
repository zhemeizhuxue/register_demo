import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "Home" },
    { path: "/register", component: "Register" },
  ],
  npmClient: 'yarn',
});
