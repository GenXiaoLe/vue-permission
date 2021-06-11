import VueRouter from "vue-router";
import Vue from "vue";

Vue.use(VueRouter)

const files = require.context("./", false, /\/*-router.js$/);
// 开发模式 二层路由
const defaultRoute = [
  {
    path: "/",
    name: "首页",
    icon: "el-icon-house",
    meta: {
      affix: true
    },
    component: () => import(/* webpackChunkName: "Index" */ "@/views/Index")
  },
  {
    path: "/login",
    name: "登录",
    // icon: "el-icon-house",
    hidden: true,
    component: () => import(/* webpackChunkName: "Index" */ "@/views/login")
  },
  {
    path: "/error/404",
    name: "404",
    hidden: true,
    component: () =>
      import(/* webpackChunkName: "error" */ "@/views/404.vue")
  },
];

// 左侧路由树路由集合
export let devNavRoutes = [...defaultRoute];
// 所有需注册的路由集合
let prdRoutesList = [...defaultRoute];
files.keys().forEach(key => {
  Object.keys(files(key)).forEach(item => {
    const node = files(key)[item] ? files(key)[item][0] : {};
    devNavRoutes = devNavRoutes.concat(node);
    prdRoutesList = prdRoutesList.concat(node.children);
  });
});


export const routes = prdRoutesList;
const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
