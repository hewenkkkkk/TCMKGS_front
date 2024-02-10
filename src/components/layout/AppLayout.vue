<script>
import {defineComponent} from "vue";
import AppAside from "./AppAside.vue";
import AppHeader from "./AppHeader.vue";

export default defineComponent({
  components: {AppAside, AppHeader}
})
</script>

<template>
  <div class="common-layout">
    <el-container>
      <AppAside />
      <el-container class="header-and-main">
        <AppHeader />
        <el-main>

          <el-scrollbar>
            <RouterView />
          </el-scrollbar>

        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.header-and-main{
  flex-direction: column;
  height: 100vh;
}
.el-main{
  background-color: #fdfcfc;
  //padding-right: 0;
  margin: 0;
  padding: 0;
}
</style>