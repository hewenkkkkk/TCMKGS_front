<template>
  <div v-if="isVisible" class="modal" @mousedown="startDrag" @mousemove="onDrag" @mouseup="endDrag" @mouseleave="endDrag">
    <div class="modal-content">
      <span class="close-button" @click="close">&times;</span>
      <h3>编辑节点信息</h3>
      <div class="form-group">
        <label for="nodeName">节点名称:</label>
        <input type="text" id="nodeName" v-model="nodeData.name" placeholder="节点名称">
      </div>
      <div class="form-group">
        <label for="nodeAttributes">节点属性:</label>
        <input type="text" id="nodeAttributes" v-model="nodeData.attributes" placeholder="节点属性">
      </div>
      <div class="form-group">
        <label for="nodeLabel">节点标签:</label>
        <input type="text" id="nodeLabel" v-model="nodeData.label" placeholder="节点标签">
      </div>
      <button @click="save">保存</button>
    </div>
  </div>
</template>

<script>
export default {
  return :{
    dragging: false,
    startX: 0,
    startY: 0,
  },

  props: {
    nodeData: {
      type: Object,
      default: () => ({})
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
      // 触发保存事件，并传递节点数据
      this.$emit('save', {
        id: this.nodeData.id,
        name: this.nodeData.name,
        type: this.nodeData.label,
        attributes: this.nodeData.attributes,
      });
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
  right: 0;
  top: 0;
  width: 30%;
  height: 100%;
  background-color: transparent;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: move;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  width: 100%;
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
