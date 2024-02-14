<template>
  <div class="questions-container">
    <div v-for="item in questions" :key="item.question_id" class="task" @click="handleCardClick(item.question_id)">
      <div class="tags">
        <span class="tag">问题</span>
        <button class="options"></button>
      </div>
      <div class="content">
        <p>{{ truncateContent(item.content, 50) }}</p>
      </div>
      <div class="question-date">{{ formatDate(item.created_at) }}</div>
    </div>
    <div class="add-question-container">
      <button class="add-question-button" @click="toggleSideBar">添加问题</button>
    </div>
  </div>



  <div :class="['side-bar', { 'side-bar-show': showSideBar }]" >
    <div class="side-bar-content">
      <input v-model="newQuestion.userName" placeholder="用户名" />
      <input v-model="newQuestion.email" placeholder="邮箱" />
      <textarea v-model="newQuestion.content" placeholder="输入问题内容"></textarea>
      <input type="file" @change="uploadImage" multiple />
      <div class="uploaded-images">
        <img v-for="url in newQuestion.imageUrl" :key="url" :src="url" class="uploaded-image" />
      </div>
      <button @click="submitQuestion">提交问题</button>
    </div>
  </div>
</template>

<script>
import api from '../../api/api.js';
import { ElMessage } from 'element-plus';

export default {
  data() {
    return {
      questions: [],
      showSideBar: false,
      newQuestion: {
        userName: '',
        email: '',
        content: '',
        imageUrl: []
      }
    }
  },
  mounted() {
    this.fetchQuestions();
  },
  methods: {
    async fetchQuestions() {
      try {
        const response = await api.getNewQuestionsTen();
        if (response.data.status === 'success') {
          this.questions = response.data.data;
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    },
    truncateContent(content, maxLength = 100) {
      return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
    },
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
    async handleCardClick(questionId) {
      this.$store.dispatch('fetchQuestion', questionId);

      this.$router.push({ name: 'QuestionDetails', params: { questionId } });
    },

    toggleSideBar() {
      this.newQuestion = { userName: '', email: '', content: '', imageUrl: [] };
      this.showSideBar = !this.showSideBar;
    },
    uploadImage(event) {
      const files = Array.from(event.target.files);
      files.forEach(file => {
        api.uploadQuestionImage(file).then(urls => {
          if (Array.isArray(urls)) {
            this.newQuestion.imageUrl.push(...urls);
            console.log('上传的图片 URL:', this.newQuestion.imageUrl);
          }
        }).catch(error => {
          console.error('Error uploading image:', error);
        });
      });
    },

    submitQuestion() {
      const questionData = {
        userName: this.newQuestion.userName,
        email: this.newQuestion.email,
        content: this.newQuestion.content,
        imageUrl: this.newQuestion.imageUrl
      };
      console.log('提交问题数据:', questionData);
      api.addQuestion(questionData)
          .then(async response => {
            if (response.data.code === 200) {
              // 问题提交成功
              ElMessage({
                message: '问题提交成功',
                type: 'success'
              });
              // 清空输入字段并关闭侧边栏
              this.newQuestion = { userName: '', email: '', content: '', imageUrl: [] };
              this.showSideBar = false;
              // 重新获取问题列表
              await this.fetchQuestions();
            } else {
              // 处理失败响应
              console.error('问题提交失败:', response.data.info);
            }
          })
          .catch(error => {
            console.error('Error submitting question:', error);
          });
    }
  }
}
</script>


<style>
.questions-container {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: 20px;
  padding-left: 10px;
}

.task {
  flex-basis: calc(20% - 10px);
  box-sizing: border-box;
  position: relative;
  color: #2e2e2f;
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;
  margin-right: 10px;
  margin-bottom: 1rem;
  border: 3px dashed transparent;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 200px; /* 固定卡片的高度 */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* 添加过渡效果 */
  animation: fadeIn 0.5s ease-out; /* 应用淡入效果 */
}

.task:nth-child(5n) {
  margin-right: 0;
}
.task:hover {
  transform: scale(1.05);
  box-shadow: rgba(99, 99, 99, 0.2) 0px 4px 12px 0px;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.tag {
  border-radius: 100px;
  padding: 4px 13px;
  font-size: 12px;
  color: #ffffff;
  background-color: #1389eb;
}

.tags {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.options {
  background: transparent;
  border: 0;
  color: #c4cad3;
  font-size: 17px;
}
.content {
  overflow: hidden;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.content p {
  margin: 0;
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.question-date {
  margin-top: 10px;
  align-self: flex-end; /* 日期固定在底部 */
}


.add-question-container {
  align-self: flex-start; /* 对齐到容器的左上角 */
  margin-bottom: 20px;
}

.add-question-button {
  position: absolute;
  left: 0;
  top: 190px; /* 按钮在容器顶部的固定位置 */
  transform: translateX(-50%);
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 0 50px 50px 0; /* 创建半圆形效果 */
  cursor: pointer;
  transition: transform 0.3s ease;
  z-index: 1000;
}

.add-question-button:hover {
  transform: translateX(0); /* 滑出完整按钮 */
}

.side-bar {
  position: fixed;
  right: 0;
  top: 0;
  width: 300px;
  height: 100%;
  background-color: #f8f8f8;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
  transition: transform 0.3s ease;
  z-index: 1000; /* 确保在顶层 */
}

.side-bar-content {
  display: flex;
  flex-direction: column;
  max-height: 100%;
  overflow-y: auto; /* 允许垂直滚动 */
  padding-bottom: 60px; /* 留出足够的空间防止提交按钮被覆盖 */
}

.side-bar input,
.side-bar textarea {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}
.side-bar textarea {
  height: 100px; /* 固定高度 */
  resize: none; /* 禁止调整大小 */
}
/* 上传图片列表样式 */
.uploaded-images {
  display: grid; /* 使用网格布局 */
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); /* 定义列数和列宽 */
  gap: 10px; /* 图片之间的间隔 */
  margin-bottom: 15px; /* 与下一个元素的间隔 */
  overflow-y: auto; /* 允许滚动 */
  max-height: 150px; /* 限制最大高度 */
}

.uploaded-image {
  max-width: 100%;
  height: auto;
  margin-top: 5px;
}
.side-bar button {
  background-color: #3498db;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 14px;
  font-weight: bold;
}

/* 根据 showSideBar 状态调整侧边栏的显示 */
.show-side-bar .side-bar {
  transform: translateX(0);
}
.side-bar button:hover {
  background-color: #2980b9;
}

/* 根据 showSideBar 状态调整侧边栏的显示 */
.side-bar {
  transform: translateX(100%);
  transition: transform 0.3s ease;
  overflow: hidden; /* 隐藏溢出内容 */
}


</style>
