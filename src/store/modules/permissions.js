import { pageAuth } from "@/api/permissionApi.js";
import Filber from '@/plugins/filber.tree';
import routes from "@/router";
import {
  resetUrl,
  formatUrl
} from '@/utils/index.js';

const state = {
  menuPermission: [],
  toView: '',
  currentPage: {},
  openedsMenu: [],
  activeMenu: ''
};

// 查找父元素
const getParent = function (filber, state) {
  if (!filber) return null;
  const { resCode = '', parent = {}, resType = '', url = '' } = filber;
  
  if (resCode) {
    state.openedsMenu.unshift(resCode);

    if (resType === 3) {
      state.activeMenu = resCode;
    }
  }

  return {
    resCode,
    resType,
    url,
    parent: getParent(parent, state)
  };
};

// 查找所有子集
const getChildsAuth = function (filber, array) {
  if (filber.child) {
    array.push(filber.child.resCode);
    getChildsAuth(filber.child, array);
  }

  if (filber.sibling) {
    array.push(filber.sibling.resCode);
    getChildsAuth(filber.sibling, array);
  }
};

// 获取网址
const getUrl = function (result) {
  // 格式化入参 去除协议、网关
  try {
    const { pathname = '', search = ''  } = new URL(result);
    const str = pathname + search;
    result = str ? resetUrl(str) : result;
  } catch {
    console.log('URL地址解析错误, URL为: ', result);
  }

  return result;
};

const mutations = {
  SET_MENU_PERMISSION: (state, payload) => {
    state.menuPermission = [...payload];
  },
  SET_CUTTENT_PAGE: (state, payload) => {
    const { resCode = '', parent = {}, resType = '', url = '' } = payload;

    state.openedsMenu = [];
    // 根据当前页面 判断高亮目录 以及当前活跃页签id
    if (resCode) {
      // 如果是有效页面
      state.openedsMenu.unshift(resCode);
      
      if (resType === 3) {
        state.activeMenu = resCode;
      }

      state.currentPage = { 
        resCode,
        resType,
        url,
        auth: [],
        parent: getParent(parent, state)
      };

      getChildsAuth(payload, state.currentPage.auth);
    } else {
      // 如果是首页
      state.activeMenu = '';

      state.currentPage = { 
        resCode: '',
        resType: 0,
        url: '',
        auth: [],
        parent: null
      };
    }
  },
  SET_PAGE_TO: (state, payload) => {
    const { targetUrl } = payload;
    const host = location.origin || '';
    state.toView = host + targetUrl;
  }
};

const actions = {
  /**
   * @method: 获取目录树(模块，目录，页面)鉴权
   */
  getAuth ({ commit, state }, payload) {
    const { filber } = Filber;
    const { targetUrl } = payload;
    commit('SET_PAGE_TO', payload);

    return new Promise(resolve => {
      pageAuth({ targetUrl }).then(res => {
        if (res.success) {
          const model = res.model || [];
          // 创建权限树
          filber.create(model);
          commit('SET_MENU_PERMISSION', model);

          resolve(res);
        } else {
          // 如果当前页面没有权限 删除对应tabs 并且跳转到活跃的activeMenu上
          let visitedViews = [];
          const origin = location.origin;

          try {
            // 当前tabs的集合
            visitedViews = this.state.tagsView.visitedViews;
            
            // 找出无权限tabs的索引值index
            const itemIndex = visitedViews.findIndex(item => {
              const url = getUrl(`${origin}${item.fullPath}`);
              const _toView = getUrl(state.toView);
              return url === _toView;
            });
            
            // 如果成功匹配到tabs 则删除tabs
            if (itemIndex > -1) {
              visitedViews.splice(itemIndex, 1);
            }

            // 进行跳转 当前活跃页不存在 跳转到首页 否则跳转到活跃页
            // 活跃页的索引值index
            const activeIndex = visitedViews.findIndex(item => item.resCode === state.activeMenu);
            if (activeIndex > -1) {
              // 如果当前活跃页是存在的
              const activeItem = visitedViews[activeIndex];
              
              // 如果当前页就是活跃页 则无需跳转
              if (state.currentPage.resCode !== activeItem.resCode) {
                const activePermission = formatUrl(`${origin}${activeItem.fullPath}`);
                routes.push({ path: activePermission.path, query: activePermission.query });
              }

              commit('SET_PAGE_TO', { targetUrl: activeItem.fullPath });
            } else {
              // 当前活跃页不存在直接跳转至首页
              routes.push({ path: '/' });
              commit('SET_PAGE_TO', { targetUrl: '/' });
            }
            
          } catch {
            console.log('store执行错误');
          }
        }
      });
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}