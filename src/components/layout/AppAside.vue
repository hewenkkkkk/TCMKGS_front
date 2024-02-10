<script setup lang="ts">

</script>

<template>
  <el-aside>
    <el-scrollbar>
      <el-menu router unique-opened :collapse="isCollapse">
      <a class="logo" href="/">
        <img src="public/ic.svg">
        <h1>芯笑</h1>
      </a>
        <el-menu-item index="/findNeo4j">
          <el-icon><IEpIceCreamRound /></el-icon> <span>知识图谱</span>
        </el-menu-item>
        <el-menu-item index="/data">
          <el-icon><IEpIceCreamRound /></el-icon> <span>数据统计</span>
        </el-menu-item>
        <el-menu-item index="/neo4j">
          <el-icon><IEpIceCreamRound /></el-icon> <span>图谱检索</span>
        </el-menu-item>
        <el-menu-item index="/questions">
          <el-icon><IEpIceCream /></el-icon> <span>提问箱</span>
        </el-menu-item>
        <el-sub-menu index="1">
          <template #title>
            <el-icon> <IEpView /> </el-icon><span>AIGC</span>
          </template>
          <el-menu-item index="/questions">
            <el-icon><IEpIceCream /></el-icon> <span>AI写作</span>
          </el-menu-item>
          <el-menu-item index="/aichat">
            <el-icon><IEpIceCream /></el-icon> <span>AI聊天</span>
          </el-menu-item>
        </el-sub-menu>

    </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<style lang="scss">
.el-aside {
  height: 100vh;
  width: auto;
  background: #9796f0;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #fbc7d4, #9796f0);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #fbc7d4, #9796f0); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  position: relative; /* 添加相对定位 */
}

.el-aside::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 1px; /* 调整边框的宽度 */
  background-color: rgba(255, 255, 255, 0.2); /* 调整边框颜色和透明度 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 添加高级感的阴影效果 */
}

.el-menu {
  background: #9796f0;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #fbc7d4, #9796f0);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #fbc7d4, #9796f0); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  width: 200px;
  border-right: none;
  &.el-menu--collapse {
    width: 64px;
    & h1 {
      display: none;
    }
  }
}

.logo{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  text-decoration: none;
  color: black;
  img{
    width: 40px;
    height: 40px;
  }
}
</style>

<script>
export default {
  data(){
    return {
      isCollapse: false
    }
  }
}

</script>
