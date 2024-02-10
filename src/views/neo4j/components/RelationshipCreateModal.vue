<template>
  <div class="modal">
    <div class="modal-content">
      <h3>创建新的关系</h3>
      <form @submit.prevent="submit">
        <div class="form-group">
          <label for="type">关系类型:</label>
          <input id="type" v-model="type" type="text" placeholder="输入关系类型" required>
        </div>

        <div class="form-group">
          <label for="attributes">关系属性:</label>
          <input id="attributes" v-model="attributes" type="text" placeholder="输入关系属性" required>
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-button">创建</button>
          <button type="button" @click="$emit('close')" class="cancel-button">取消</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    sourceNode: Object,
    targetNode: Object,
  },
  data() {
    return {
      type: '',
      attributes: '',
    };
  },
  methods: {
    submit() {
      this.$emit('create', {
        source: this.sourceNode.id,
        target: this.targetNode.id,
        type: this.type,
        attributes: this.attributes,
      });
      // 清空表单
      this.type = '';
      this.attributes = '';
    },
  },
};
</script>

<style>
.modal {
  position: fixed; /* 固定位置 */
  top: 0;
  left: 0;
  width: 100%; /* 宽度占满整个视口 */
  height: 100%; /* 高度占满整个视口 */
  background-color: rgba(0, 0, 0, 0.6); /* 半透明背景 */
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  z-index: 1000; /* 确保模态框在最上层 */
}

.modal-content {
  background-color: white; /* 白色背景 */
  padding: 20px;
  border-radius: 10px; /* 圆角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 轻微阴影 */
  width: 50%; /* 根据需要调整宽度 */
  max-width: 600px; /* 最大宽度限制 */
}

.form-group {
  margin-bottom: 15px;
}
.form-actions {
  display: flex;
  justify-content: space-between;
}
.submit-button, .cancel-button {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.submit-button {
  background-color: #5b9bd5;
  color: white;
}
.cancel-button {
  background-color: #f44336;
  color: white;
}
</style>
