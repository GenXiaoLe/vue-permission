import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex);

const modulesFiles = require.context("./modules", true, /\.js$/);

const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});

import getters from "@/store/getters";
export default new Vuex.Store({
  modules,
  getters,
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
      // paths: ["tagsView"]
    })
  ]
});
