<template>
  <section class="layout">
    <div class="layout-sidbar">
      <Sidebar />
    </div>
    <div class="layout-view">
      <Headers />
      <router-view></router-view>
    </div>
  </section>
</template>

<script>
  import Sidebar from './sidebar/index.vue';
  import Headers from './headers/index.vue';

  export default {
    components: { Sidebar, Headers },

  }
</script>

<style lang="scss" scoped>
.layout-sidbar {
  width: 200px;
  background-color: #334142 !important;
}
</style>