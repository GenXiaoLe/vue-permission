<template>
  <section class="flex flex-1 flex-column">
    <el-scrollbar ref="menuScrollBar">
      
    </el-scrollbar>
  </section>
</template>

<script>
// import { devNavRoutes } from "@/router";
// import { mapGetters } from "vuex";
export default {
  name: "muPublicMenu",
  data() {
    return {
      isCollapse: false, //是否折叠菜单
      activePath: "",
      query: {
        name: ""
      }
    };
  },
  methods: {
    
  }
};
</script>

<style lang="sass" scoped></style>
