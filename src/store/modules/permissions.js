import { pageAuth } from "@/api/permissionApi.js";
import Filber from '@/plugins/filber.tree';

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
  getAuth ({ commit }, payload) {
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