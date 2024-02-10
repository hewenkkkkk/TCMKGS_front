<!-- EdgeEditModal.vue -->
<template>
  <div v-if="isVisible" class="modal" @mousedown="startDrag" @mousemove="onDrag" @mouseup="endDrag" @mouseleave="endDrag">
    <div class="modal-content">
      <span class="close-button" @click="close">&times;</span>
      <h3>编辑连线信息</h3>
      <div class="form-group">
        <label for="edgeType">连线类型:</label>
        <input type="text" id="edgeType" v-model="edgeData.type" placeholder="连线类型">
      </div>
      <div class="form-group">
        <label for="edgeAttributes">连线属性:</label>
        <input type="text" id="edgeAttributes" v-model="edgeData.attributes" placeholder="连线属性">
      </div>
      <button @click="save">保存</button>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      dragging: false,
      startX: 0,
      startY: 0,
    };
  },
  props: {
    edgeData: {
      type: Object,
      default: () => ({type:'',attributes:''})
    },
    isVisible: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    close() {
      this.$emit('update:isVisible', false);
    },
    save() {
      this.$emit('save', this.edgeData);
      this.close();
    },
    //鼠标拖动
    startDrag(event) {
      this.dragging = true;
      this.startX = event.clientX - event.currentTarget.getBoundingClientRect().left;
      this.startY = event.clientY - event.currentTarget.getBoundingClientRect().top;
    },
    onDrag(event) {
      if (!this.dragging) return;
      let x = event.clientX - this.startX;
      let y = event.clientY - this.startY;
      event.currentTarget.style.right = 'auto';
      event.currentTarget.style.bottom = 'auto';
      event.currentTarget.style.left = `${x}px`;
      event.currentTarget.style.top = `${y}px`;
    },
    endDrag() {
      this.dragging = false;
    },
  },
};
</script>

<style>
.modal {
  position: fixed;
  right: 0; /* 调整为右侧显示 */
  top: 0;
  width: 30%; /* 或者根据需要调整宽度 */
  height: 100%;
  background-color: transparent; /* 设置为完全透明 */
  display: flex;
  justify-content: flex-start; /* 内容靠左排列 */
  align-items: center;
  cursor: move; /* 表示可移动的光标 */
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  width: 100%; /* 调整宽度为100%以填充父容器 */
  position: relative;
}


.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 30px;
  font-weight: bold;
  cursor: pointer;
}

.close-button:hover {
  color: red;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px 15px;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}
</style>
