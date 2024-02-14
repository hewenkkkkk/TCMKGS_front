<template>
  <div class="main-container">
    <!-- 天气显示部分 -->
    <div class="weather-widget">
      <div id="he-plugin-standard"></div>
    </div>

    <!-- 文件上传部分 -->
    <div class="upload-container">
      <button @click="showModal = true" class="upload-button">选择 JSON 文件</button>
      <input type="file" @change="handleFileSelection" ref="fileInput" class="file-input" style="display: none;" />
    </div>

    <!-- 模态框 -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close-button" @click="showModal = false">&times;</span>
        <h2>注意事项</h2>
        <p>请确保Json文件格式正确，内容符合要求。</p>
        <img src="../assets/sys/json.jpg" alt="注意事项图片" class="modal-image"/><br>
        <button @click="triggerFileInput" class="read-button">导入文件</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../api/api.js";
import { ElMessage } from 'element-plus';

export default {
  created(){
    window.WIDGET = {
      "CONFIG": {
        "layout": "2",
        "width": 230,
        "height": 270,
        "background": "2",
        "dataColor": "000000",
        "key": "7f81786c971f462884b327843a74d5e4"
      }

    };
    (function (d) {
      var c = d.createElement('link')
      c.rel = 'stylesheet'
      c.href = 'https://widget.qweather.net/standard/static/css/he-standard.css?v=2.0'
      var s = d.createElement('script')
      s.src = 'https://widget.qweather.net/standard/static/js/he-standard-common.js?v=2.0"'
      var sn = d.getElementsByTagName('script')[0]
      sn.parentNode.insertBefore(c, sn)
      sn.parentNode.insertBefore(s, sn)
      s.onload=()=>{
        //自动宽度
        setTimeout(() => {
          document.getElementById("he-plugin-standard").style.width  = "100%";
        }, 100);
      }
    })(document)

  },

  data() {
    return {
      showModal: false,
      fileContent: null,
    };
  },
  methods: {
    triggerFileInput() {
      this.showModal = false;
      this.$refs.fileInput.click();
    },
    handleFileSelection(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
          this.fileContent = e.target.result;
          this.uploadData();  // 立即上传文件
        };

        reader.readAsText(file);
      }
    },
    async uploadData() {
      if (!this.fileContent) {
        alert("请先选择一个文件");
        return;
      }
      // 上传文件逻辑
        const response = await api.uploadNeo4jData(this.fileContent);
        if (response.data.code === 200) {
          ElMessage({
            message: response.data.info,
            type: 'success'
          })
        }else if (response.data.code === 901)
          ElMessage({
            message: response.data.info,
            type: 'error'
          })
        }

  },

};
</script>


<style>

.file-input {
  margin-bottom: 10px;
  border: 2px solid #007bff;
  padding: 5px;
  border-radius: 5px;
  outline: none;
}

.upload-button {
  padding: 10px 15px;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.upload-button:hover {
  background-color: #0056b3;
}

.modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  position: relative;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  width: 300px;
}

h2 {
  margin-top: 0;
}

.read-button {
  margin-top: 15px;
  padding: 10px 15px;
  background-color: #28a745;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.read-button:hover {
  background-color: #218838;
}
.modal-image {
  max-width: 100%;
  height: auto;
  margin-bottom: 10px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 30px;
  font-weight: bold;
  color: #000;
  cursor: pointer;
}

.close-button:hover {
  color: red;
}

.main-container {
  display: flex;
  flex-direction: row;
  align-items: start;
  height: 100vh;
  padding: 20px;
}

.weather-widget {
  flex: 1;
  max-width: 230px;
}

.upload-container {
  flex: 3;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
