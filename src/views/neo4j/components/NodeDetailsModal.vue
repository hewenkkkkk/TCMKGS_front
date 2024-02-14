<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content">
      <h2>节点信息</h2>
      <form @submit.prevent="submit">
        <div class="form-group">
          <label for="node-id">ID:</label>
          <input type="text" id="node-id" v-model="nodeData.id" disabled />
        </div>
        <div class="form-group">
          <label for="node-name">名称:</label>
          <input type="text" id="node-name" v-model="nodeData.name" required />
        </div>
        <div class="form-group">
          <label for="node-label">标签:</label>
          <input type="text" id="node-label" v-model="nodeData.label_0" required />
        </div>
        <div class="form-group">
          <label for="node-attributes">属性:</label>
          <textarea id="node-attributes" v-model="nodeData.attributes" required rows="8"></textarea>
        </div>
        <div class="button-group">
          <button type="submit" class="btn-save">保存</button>
          <button type="button" class="btn-cancel" @click="close">取消</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    nodeData: {
      type: Object,
      required: true
    },
    isVisible: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    close() {
      this.$emit('update:isVisible', false);
    },
    submit() {
      this.$emit('save', this.nodeData);
      console.log("提交数据：", this.nodeData);
      this.close();
    },
  }
};
</script>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 500px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.form-group input, .form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-group textarea {
  resize: vertical;
  height: 100px; /* 初始高度，可根据需要调整 */
}

.button-group {
  text-align: right;
}

.btn-save, .btn-cancel {
  padding: 10px 15px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-save {
  background-color: #28a745;
  color: white;
}

.btn-save:hover {
  background-color: #218838;
}

.btn-cancel {
  background-color: #dc3545;
  color: white;
  margin-left: 10px;
}

.btn-cancel:hover {
  background-color: #c82333;
}
</style>

