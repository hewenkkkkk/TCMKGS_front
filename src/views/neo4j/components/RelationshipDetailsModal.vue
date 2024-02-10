<template>
  <div v-if="isVisible" class="modal">
    <div class="modal-content">
      <h3>关系信息</h3>
      <div class="form-group">
        <label for="relation-type">类型:</label>
        <input id="relation-type" v-model="relationshipData.type" placeholder="Type">
      </div>
      <div class="form-group">
        <label for="relation-attributes">属性:</label>
        <textarea id="relation-attributes" v-model="relationshipData.attributes" placeholder="Attributes" rows="4"></textarea>
      </div>
      <div class="button-group">
        <button @click="save" class="btn-save">保存</button>
        <button @click="close" class="btn-cancel">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    relationshipData: Object,
    isVisible: Boolean
  },
  methods: {
    save() {
      this.$emit('save', this.relationshipData);
    },
    close() {
      this.$emit('update:isVisible', false);
    }
  }
};
</script>


<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.5s;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
textarea {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical; /* 允许垂直调整大小 */
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  min-width: 300px;
  width: 80%;
  max-width: 500px;
}

h3 {
  margin-top: 0;
  color: #333;
}

input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  margin-right: 10px;
  cursor: pointer;
  background-color: #5b9bd5;
  color: white;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #4a8cc7;
}

button:active {
  background-color: #3678b5;
}

button:last-child {
  margin-right: 0;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input, textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
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

