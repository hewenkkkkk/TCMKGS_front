import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import 'element-plus/theme-chalk/src/message-box.scss';
import 'element-plus/theme-chalk/src/message.scss';
import { createPinia } from 'pinia';
import './styles/index.scss';
import store from './store/index';

const app = createApp(App);
app.use(router);
app.use(store);
app.use(createPinia());
app.mount('#app');

