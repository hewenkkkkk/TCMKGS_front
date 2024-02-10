<template>
  <div v-if="isVisible" class="relationship-modal">
    <div class="modal-content">
      <h3>添加/编辑关系</h3>
      <label for="type">类型:</label>
      <input type="text" id="type" v-model="relationshipData.type">

      <label for="attributes">属性:</label>
      <input type="text" id="attributes" v-model="relationshipData.attributes">

      <div class="modal-actions">
        <button @click="save">保存</button>
        <button @click="cancel">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    relationshipData: {
      type: Object,
      required: true
    }
  },
  methods: {
    save() {
      this.$emit('save', this.relationshipData);
    },
    cancel() {
      this.$emit('update:isVisible', false);
    }
  }
};
</script>

<style>
.relationship-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.modal-content h3 {
  margin-top: 0;
}

.modal-actions {
  text-align: right;
  margin-top: 20px;
}

.modal-actions button {
  padding: 10px 15px;
  margin-left: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.modal-actions button:first-child {
  background-color: #5b9bd5;
  color: white;
}

.modal-actions button:last-child {
  background-color: #f0f0f0;
}
</style>
