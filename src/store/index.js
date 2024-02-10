// store/index.js
import { createStore } from 'vuex';
import api from '../api/api';

export default createStore({
    state: {
        currentQuestion: null,
    },
    mutations: {
        setCurrentQuestion(state, question) {
            state.currentQuestion = question;
        },
    },
    actions: {
        fetchQuestion({ commit }, questionId) {
            const data = {
                "questionId": questionId
            }
            console.log("传送id", data)

            api.getAllQuestionInfo(data)
                .then(response => {
                    if (response.data.status === 'success') {
                        commit('setCurrentQuestion', response.data.data);
                    }
                })
                .catch(error => console.error('Error fetching question:', error));
        },
    },
});
