<template>
  <div v-if="!item.hidden">
    <template v-if="item.resType === 3">
      <mu-menu-Link :to="resolvePath(item.resUrl)">
        <el-menu-item :index="item.resCode" @click="handleJump">
          <mu-menu-item :icon="item.icon" :title="item.resName" />
        </el-menu-item>
      </mu-menu-Link>
    </template>

    <el-submenu
      v-else-if="item.children && (item.resType === 1 || item.resType === 2)"
      ref="subMenu"
      :index="item.resCode"
      popper-append-to-body>
      <template slot="title">
       <mu-menu-item :icon="item.icon" :title="item.resName" />
      </template>
      <mu-sidebar-item
        v-for="child in item.children"
        :key="child.resUrl"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.resUrl)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from "path";
import { isExternal } from "@/utils/validate";

export default {
  name: "muSidebarItem",
  components: {
    "mu-menu-item": () => import("./menuItem"),
    "mu-menu-Link": () => import("./menuLink")
  },
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  methods: {
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath;
      }
      if (isExternal(this.basePath)) {
        return this.basePath;
      }
      return path.resolve(this.basePath, routePath);
    },
    handleJump() {
      if (this.isMobile)
        this.$store.dispatch("setWapMenuSwitch", !this.mobileMenuSwitch);
    }
  }
};
</script>
