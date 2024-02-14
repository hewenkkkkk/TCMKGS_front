<template>
  <div class="comment">
    <div class="comment-main">
      <!-- 评论主体内容 -->
      <img :src="comment.user.avatar" alt="用户头像" class="user-avatar">
      <div class="comment-content">
        <h4>{{ comment.user.username }}</h4>
        <span class="comment-time">{{ formatTime(comment.created_at) }}</span>
        <p>{{ comment.content }}</p>
        <div class="comment-actions">
          <button class="reply-btn" @click="$emit('reply', comment.comment_id)">
            <i class="fa fa-reply"></i> 回复
          </button>

          <button v-if="comment.subComments && comment.subComments.length" @click="toggleSubComments" class="toggle-subcomments-btn">
            <i class="fa" :class="{'fa-chevron-down': !showSubComments, 'fa-chevron-up': showSubComments}"></i>
            {{ showSubComments ? '隐藏子评论' : '显示子评论' }}
          </button>
        </div>
        <div class="comment-images">
          <img v-for="image in comment.images" :key="image.image_id" :src="image.image_url" alt="评论图片">
        </div>
      </div>
    </div>
    <!-- 子评论列表 -->
    <div class="sub-comments" v-if="showSubComments">
      <Comment v-for="subComment in comment.subComments" :key="subComment.comment_id" :comment="subComment" @reply="$emit('reply', $event)"/>
    </div>
  </div>
</template>


<script>
export default {
  name: 'Comment',
  props: ['comment'],
  data() {
    return {
      showSubComments: false, // 控制子评论的显示
    };
  },
  methods: {
    toggleSubComments() {
      this.showSubComments = !this.showSubComments;
    },
    formatTime(datetime) {
      if (!datetime) return '时间未知';
      const date = new Date(datetime);
      return date.toLocaleString(); // 或者使用任何其他您喜欢的日期格式
    }
  },
  components: {
    Comment: () => import('./Comment.vue') // 递归导入
  },
}
</script>

<style scoped>
.comment {
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.comment-time {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: rgb(9, 8, 8);
}
.comment-actions {
  display: flex;
  align-items: center;
  margin-top: 8px;
}
.comment-main {
  display: flex;
  align-items: start;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.comment-content {
  flex-grow: 1;
}

.comment-content h4 {
  margin: 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.comment-content p {
  margin: 4px 0 8px;
  color: #555;
  font-size: 14px;
  line-height: 1.4;
}

.comment-images img {
  max-width: 100%;
  border-radius: 4px;
  margin-top: 5px;
}

.sub-comments {
  margin-top: 10px;
  margin-left: 20px; /* 缩进显示子评论 */
  border-left: 2px solid #eee;
  padding-left: 10px;
}

.reply-btn, .toggle-subcomments-btn {
  padding: 5px 10px;
  background-color: transparent; /* 扁平化设计 */
  color: #3498db;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px; /* 为按钮添加间距 */
  font-size: 14px;
  transition: color 0.2s ease;
}

.reply-btn:hover, .toggle-subcomments-btn:hover {
  color: #2980b9; /* Hover状态下颜色变化 */
}

.reply-btn i, .toggle-subcomments-btn i {
  margin-right: 5px; /* 图标和文本之间的间距 */
}
/* Font Awesome 图标库样式 */
.fa-reply {
  transform: scale(-1, 1); /* 使回复图标翻转 */
}
.fa-chevron-down, .fa-chevron-up {
  font-size: 10px; /* 图标大小 */
}

</style>
