
import axios from 'axios';

// 设置基础的 API URL，如果您的所有API请求都是向同一个域名发送的


const api = {
    uploadNeo4jData: (fileContent) => {
        const url = `api/neo4j/uploadData`;
        return axios.post(url, fileContent, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },

    getNeo4jData: (limit) => {
        const url = `api/neo4j/getGraphData?limit=${limit}`;
        return axios.get(url);
    },

    updateNodeInfo: (updatedNodeData) => {
        const url = `api/neo4j/updateNodeId`;
        return axios.post(url, updatedNodeData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },
    deleteRelationship: (sourceId, targetId) => {
        const url = `/api/neo4j/deleteRelationshipById`; // 确保 URL 是正确的
        const data = {
            source: sourceId,
            target: targetId
        };

        return axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },
    updateRelationshipById: (updatedData) => {
        const url = `api/neo4j/updateRelationshipById`;
        return axios.post(url, updatedData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },

    countNodesType: () => {
        const url = `api/nodes/countNodesByType`;
        return axios.get(url);
    },

    getCountNodes: () => {
        const url = `api/nodes/getCountNodes`;
        return axios.get(url);
    },
    countRelationships: () => {
        const url = `api/relationships/countRelationships`;
        return axios.get(url);
    },

    countRelationshipType: () => {
        const url = `api/relationships/countRelationshipType`;
        return axios.get(url);
    },

    createRelationship(relationshipData) {
        const url = `api/neo4j/addRelationship`;
        return axios.post(url, relationshipData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },

    searchNode(searchData) {
        const url = `api/neo4j/searchNode`;
        return axios.post(url, searchData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },

    executeCypherQuery(query) {
        const url = `api/neo4j/executeCypherQuery`;
        return axios.post(url, query, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },

    getNewQuestionsTen: () => {
        const url = `api/questions/getNewQuestion`;
        return axios.get(url);
    },

    getAllQuestionInfo(query) {
        const url = `api/questions/getQuestionsAndComments`;
        return axios.post(url, query, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },

    uploadQuestionImage(file) {
    const formData = new FormData();
    formData.append('images', file);

    return fetch('api/questions/uploadQuestionImage', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                return data.data; // 返回图片 URL 数组
            } else {
                throw new Error(data.info || '上传失败');
            }
        });
   },

    commitQuestionComment(query) {
        const url = `api/questions/addComment`;
        return axios.post(url, query, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },

    addQuestion(query) {
        const url = `api/questions/addQuestion`;
        return axios.post(url, query, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

};

export default api;
