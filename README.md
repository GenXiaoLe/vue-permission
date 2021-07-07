### 项目名称
vue鉴权系统实现方案

### 项目描述
1. 仿Fiber结构构建的权限树，支持在进入路由跳转时页面获取最新权限并动态的更新权限树。
2. 权限树暴露方法用来校验节点是否有相关权限
3. 使用路由守卫 - Store - 权限树，形成鉴权闭环

### Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

