import { createRouter, createMemoryHistory, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const isServer = typeof window === 'undefined';
const history = isServer ? createMemoryHistory() : createWebHistory();

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = createRouter({
  history,
  routes
});

export default router;
