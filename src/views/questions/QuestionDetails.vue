<template>
  <div v-if="questionData && questionData.user" class="question-details-container">
    <div class="question">
      <h2>问题详情</h2>
      <div class="question-info">
        <img :src="questionData.user.avatar" alt="用户头像" class="user-avatar">
        <div class="question-text">
          <h3>{{ questionData.user.username }}</h3>
          <p>{{ questionData.content }}</p>
          <!-- 新增评论按钮 -->
          <button @click="toggleCommentBox" class="add-comment-btn">添加评论</button>
          <div class="question-images">
            <img v-for="image in questionData.images" :key="image.image_id" :src="image.image_url" alt="问题图片" @click="openImageModal(image.image_url)">
          </div>
        </div>
      </div>
    </div>

    <div class="comments" v-if="questionData.comments.length">
      <h2>评论</h2>
      <Comment v-for="comment in questionData.comments" :key="comment.comment_id" :comment="comment" @reply="openReplyBox"/>

    </div>
  </div>

  <!-- 添加一个透明遮罩，用于实现点击外部关闭侧滑框的功能 -->
  <div v-if="showCommentBox" class="overlay" @click="closeCommentBox"></div>
  <!-- 新增评论侧滑框 -->
  <div v-if="showCommentBox" class="comment-box">
    <input v-model="userName" placeholder="用户名" />
    <input v-model="userEmail" placeholder="邮箱" />
    <textarea v-model="newComment" placeholder="输入你的评论"></textarea>
    <input type="file" @change="uploadImage" />
    <div class="uploaded-images">
      <img v-for="url in uploadedImageUrls" :key="url" :src="url" class="uploaded-image" />
    </div>
    <button @click="submitComment">提交评论</button>
  </div>



</template>

<script>
import { mapState } from 'vuex';
import api from '../../api/api.js';
import Comment from '../questions/compenonts/Comment.vue'; // 导入评论组件

export default {
  components: {
    Comment
  },
  name: 'QuestionDetails',
  data() {
    return {
      showCommentBox: false,
      newComment: '',
      userName: '', // 新增用户名
      userEmail: '', // 新增用户邮箱
      uploadedImageUrls: [],
      replyingToCommentId: null, // 正在回复的评论ID
    };
  },
  computed: {
    ...mapState(['currentQuestion']),
    questionData() {
      return this.currentQuestion;
    },
  },
  mounted() {

    const questionId = this.$route.params.questionId;
    if (!this.questionData || this.questionData.question_id !== questionId) {
      this.$store.dispatch('fetchQuestion', questionId);
    }
  },
  methods: {

    toggleSubComments(comment) {
      comment.showSubComments = !comment.showSubComments;
    },
    openImageModal(imageUrl) {
      window.open(imageUrl, '_blank');
    },
    prepareComments(data) {
      if (data && data.comments) {
        data.comments.forEach(comment => {
          comment.showSubComments = false;
        });
      }
      return data;
    },
    toggleCommentBox() {
      this.showCommentBox = !this.showCommentBox;
      if (this.showCommentBox) {
        document.body.classList.add("show-comment-box");
      } else {
        document.body.classList.remove("show-comment-box");
      }
    },
    uploadImage(event) {
      const file = event.target.files[0];
      api.uploadQuestionImage(file)
          .then(urls => {
            this.uploadedImageUrls.push(...urls);
          })
          .catch(error => console.error('Error:', error));
    },
    submitComment() {
      const commentData = {
        userName: this.userName,
        email: this.userEmail,
        question_id: this.questionData.question_id,
        content: this.newComment,
        image_url: this.uploadedImageUrls,
        parent_id: this.replyingToCommentId,
      };
      console.log("提交数据",commentData);
      api.commitQuestionComment(commentData)
          .then(response => {
            if (response.data.status === 'success') {
              this.closeCommentBox();
              this.newComment = '';
              this.userName = '';
              this.userEmail = '';
              this.uploadedImageUrls = [];
              this.fetchLatestComments();
            } else {
              throw new Error(response.data.info || '提交失败');
            }
          })
          .catch(error => console.error('Error:', error));
    },
    fetchLatestComments() {
      this.$store.dispatch('fetchQuestion', this.questionData.question_id);
    },
    closeCommentBox() {
      this.showCommentBox = false;
    },


    openReplyBox(commentId) {
      this.replyingToCommentId = commentId;
      this.showCommentBox = true;
    },



  },
}
</script>


<style>
.question-details-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.question {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.user-avatar {
  width: 60px; /* 增大头像大小 */
  height: 60px;
  border-radius: 50%;
  margin-right: 15px;
}

.question-info {
  display: flex;
  align-items: center; /* 垂直居中对齐 */
  margin-bottom: 15px;
}

.question-text{
  flex-grow: 1;
}


h2 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 24px;
}

h3, h4, h5 {
  margin: 0;
  color: #34495e;
  font-weight: 600;
}

.question-text p, .comment-content p, .sub-comment-content p {
  color: #7f8c8d;
  line-height: 1.8;
  font-size: 16px;
}

.question-images{
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.question-images img, .comment-images img, .sub-comment-images img {
  max-width: 100%;
  max-height: 300px;
  width: auto;
  height: auto;
  object-fit: contain;
  cursor: pointer;
  border-radius: 5px;
  transition: transform 0.3s ease;
}


.question-images img:hover, .comment-images img:hover, .sub-comment-images img:hover {
  transform: scale(1.05);
}


.comments {
  background-color: #f0f0f0;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  margin-top: 20px;
  border: 1px solid #e1e1e1;
  margin-bottom: 20px;
}


.comment-box {
  position: fixed;
  right: -300px;
  top: 0;
  width: 300px;
  height: 100%;
  background-color: #f8f8f8;
  padding: 20px;
  z-index: 100;
  overflow-y: auto;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
  transition: right 0.3s ease;
}
.show-comment-box .comment-box {
  right: 0;
}

.comment-box input, .comment-box textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.comment-box button {
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.comment-box button:hover {
  background-color: #2980b9;
}

.comment-box textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
}

.uploaded-images {
  margin-bottom: 10px;
}

.uploaded-image {
  max-width: 100%;
  height: auto;
  margin-top: 10px;
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
}
.add-comment-btn {
  padding: 8px 15px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
  display: block;
  width: max-content;
  margin-left: auto;
  margin-right: 0;
}

.add-comment-btn:hover {
  background-color: #2980b9;
}


</style>


