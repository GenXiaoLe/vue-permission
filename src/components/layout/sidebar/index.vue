<template>
  <section class="flex flex-1 flex-column">
    <el-scrollbar class="scrollbar-box" ref="menuScrollBar">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :text-color="variables.menuText"
        unique-opened
        :active-text-color="variables.menuActiveText"
        :collapse-transition="true"
        mode="vertical"
      >
        <mu-sidebar-item
          v-for="route in menuPermission"
          :key="route.resCode"
          :item="route"
          :base-path="route.resUrl"
        />
      </el-menu>
    </el-scrollbar>
  </section>
</template>

<script>
import variables from "@/assets/css/variables.scss";
import { mapGetters } from "vuex";
export default {
  name: "muPublicMenu",
  components: {
    "mu-sidebar-item": () => import("./sidebarItem")
  },
  data() {
    return {
      isCollapse: false, //是否折叠菜单
      activePath: "",
      query: {
        name: ""
      }
    };
  },
  computed: {
    ...mapGetters([
      'menuPermission',
      'activeMenu',
    ]),
    variables() {
      return variables;
    },
  },
  methods: {
    
  }
};
</script>

<style lang="scss" scoped>
.scrollbar-box ::v-deep .el-submenu__title {
  background: #334142 !important;
  span {
    color: #fff;
  }
}
.scrollbar-box ::v-deep .el-menu-item {
  background: #334142 !important;
  span {
    color: #fff;
  }
}
</style>
