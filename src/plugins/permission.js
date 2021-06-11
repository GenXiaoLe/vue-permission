import router from "@/router";
import store from "@/store";
import Filber from '@/plugins/filber.tree';
import {
  getCookie,
  changeUrlStr,
  setCookie
} from '@/utils/index.js';

const tokenName = 'Local-Token';

const whiteList = ['/login', '/forgetpsd']; // 不需要重定向的白名单
const tokenWhiteList = ['/login', '/forgetpsd', '/error/500', '/error/404']; // 有token情况下的白名单

// 全局路由守卫 动态更新权限
router.beforeEach((to, from, next) => {
  console.log("to, from-----", to, from);

  const token = getCookie(tokenName);
  if (!token) {
    /* 有token */
    if (to.matched.length === 0) { //如果未匹配到路由
      next('/error/404');
    } else if (tokenWhiteList.indexOf(to.path) !== -1) { // 如果在白名单 直接进入
      next();
    } else {
      const { path, query } = to;
      let targetUrl = changeUrlStr(path, query);
      
      store.dispatch('permissions/getAuth', { targetUrl }).then(res => {
        if (res.success) {
          // 通过path匹配对应结点的resCode
          const { filber } = Filber;
          const _filberNode = filber.getNode(targetUrl) || {};

          console.log('生成的权限树结构为：', filber.$tree);

          // 缓存当前页面
          store.commit('permissions/SET_CUTTENT_PAGE', _filberNode);
          
          next(); // 正确跳转 
        }
      });
    }
  } else {
    /* 没有token */

    // 清空token相关
    sessionStorage.clear();
    localStorage.clear();

    setCookie(tokenName, '');

    // 清空所有tabs缓存 在进行跳转
    store.dispatch('tagsView/delAllViews').then(() => {
      if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单, 直接进入
        next();
      } else {
        const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
        next(`/login?redirect=${redirect}`); // 否则全部重定向到登录页
      }
    });
  }
});
