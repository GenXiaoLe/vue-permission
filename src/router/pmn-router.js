export const routes = [
  {
    path: "/pms",
    meta: {
      system: "pms"
    },
    icon: "el-icon-news",
    name: "权限管理",
    children: [
      {
        path: "/amc/resourceList",
        name: "资源列表",
        component: () =>
          import(/* webpackChunkName: "amc" */ "@/views/pmn/reSourceList.vue")
      },
    ]
  }
]
