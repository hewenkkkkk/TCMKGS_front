<template>
  <div class="header-container">
    <el-menu
        :default-active="activeIndex2"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#9796f0"
        text-color="#fff"
        active-text-color="#ffd04b"
        @select="handleSelect"
        router="true"
    >
      <el-menu-item index="/">主页</el-menu-item>


    </el-menu>
    <el-header>
      <div class="time-display">
        <div class="time-segment">
          <span class="time-value">{{ year }}</span>
        </div>
        <span class="separator">-</span>
        <div class="time-segment">
          <span class="time-value">{{ month }}</span>
        </div>
        <span class="separator">-</span>
        <div class="time-segment">
          <span class="time-value">{{ day }}</span>
        </div>
        <span class="separator"> </span>
        <div class="time-segment">
          <span class="time-value">{{ hours }}</span>
        </div>
        <span class="separator">:</span>
        <div class="time-segment">
          <span class="time-value">{{ minutes }}</span>
        </div>
        <span class="separator">:</span>
        <div class="time-segment">
          <span class="time-value">{{ seconds }}</span>
        </div>
      </div>
    </el-header>
  </div>
</template>

<script>
import { ArrowRight } from "@element-plus/icons-vue";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      year: "",
      month: "",
      day: "",
      hours: "",
      minutes: "",
      seconds: "",
      activeIndex2: null
    };
  },
  computed: {
    ArrowRight() {
      return ArrowRight;
    },
  },
  mounted() {
    this.updateTime();
    setInterval(this.updateTime, 1000); // 每秒更新时间
  },
  methods: {
    updateTime() {
      const now = new Date();
      this.year = String(now.getFullYear());
      this.month = String(now.getMonth() + 1).padStart(2, "0");
      this.day = String(now.getDate()).padStart(2, "0");
      this.hours = String(now.getHours()).padStart(2, "0");
      this.minutes = String(now.getMinutes()).padStart(2, "0");
      this.seconds = String(now.getSeconds()).padStart(2, "0");
    },
  },
});
</script>

<style scoped>
.header-container {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #9796f0, #9796f0);
}

.el-menu-demo {
  flex: 1; /* 让 el-menu 占据剩余空间 */
}

.time-display {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  margin-left: auto; /* 将 time-display 向右侧推动 */

}
.el-header {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #9796f0, #9796f0);
}

.el-icon {
  margin-right: 12px;
}

.time-display {
  margin-left: auto;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
}

.time-segment {
  position: relative;
  padding: 4px 8px;
  border: 2px solid #fff;
  border-radius: 4px;
  background-color: #000;
  color: #fff;
  margin-right: 6px;
}

.time-value {
  position: relative;
  z-index: 1;
}

.separator {
  color: #090808;
  font-weight: bold;
  margin-right: 4px;
}
</style>






