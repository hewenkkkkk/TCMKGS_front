<template>
  <div class="container">
    <!-- 左侧内容 -->
    <div class="left-content">
      <div class="input-area">
        <select v-model="selectedSearchType" class="search-select">
          <option value="current">Neo4j查询</option>
          <option value="google">谷歌查询</option>
          <option value="baidu">百度查询</option>
        </select>
        <input v-model="query" type="text" placeholder="Enter your query" />
        <button @click="search">查询</button>
      </div>
      <div ref="graphContainer" class="graph-container">
        <!-- 图谱数据将在这里显示 -->
      </div>
    </div>

    <!-- 右侧内容 -->
    <div class="right-content">
      <div class="query-input-area">
        <textarea v-model="cypherQuery" placeholder="输入Cypher查询语句" rows="2"></textarea>
        <button @click="executeCypherQuery">查询</button>
      </div>
      <div class="data-display-area">
        <!-- 表格数据显示区域 -->
        <table v-if="tableData.length > 0">
          <thead>
          <tr>
            <th v-for="(header, index) in tableHeaders" :key="index">{{ header }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
            <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>



<script>
import * as echarts from 'echarts';
import api from '../../api/api';

export default {
  name: 'GraphVisualization',
  data() {
    return {
      query: '鱼腥草',  // 用户输入的查询
      chart: null, // ECharts 实例
      selectedButton: null,
      selectedSearchType: 'current',
      cypherQuery: 'MATCH (p:中药{name: "防风草"})-[r]->(other) RETURN p, r, other;', // Cypher查询语句
      tableHeaders: [], // 表格标题
      tableData: [] // 表格数据
    };
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      // ECharts 实例初始化
      this.chart = echarts.init(this.$refs.graphContainer, null, {
        width: 'auto',
        height: 'auto'
      });
      window.addEventListener('resize', this.handleResize);
    },
    handleResize() {
      this.chart.resize();
    },

    async search() {
      if (!this.query) return;
      switch (this.selectedSearchType) {
        case 'current': await this.searchNode(); break;
        case 'google': this.performGoogleSearch(); break;
        case 'baidu': this.performBaiduSearch(); break;
      }
    },

    async searchNode() {
      if (!this.query) return;
      try {
        const response = await this.fetchGraphData(this.query);
        const graphData = response.data.data;
        this.updateChart(graphData);
      } catch (error) {
        console.error('Error fetching graph data:', error);
      }
    },

    performGoogleSearch() {
      // 实现谷歌查询的逻辑
      // 注意：由于浏览器安全策略，你可能无法直接从前端发起跨域请求到谷歌
      // ...
      const encodedQuery = encodeURIComponent(this.query);

      // 构建百度搜索的URL
      // 重定向到百度搜索页面
      window.open(`https://www.google.com.hk/search?q=${encodedQuery}`, '_blank');
    },

    performBaiduSearch() {
      // 对查询关键词进行URL编码
      const encodedQuery = encodeURIComponent(this.query);
      window.open(`https://www.baidu.com/s?wd=${encodedQuery}`, '_blank');
    },

    async fetchGraphData() {
      if (!this.query) {
        alert("请输入查询内容");
        return;
      }
      const requestData = {
        name: this.query
      };

      try {
        const response = await api.searchNode(requestData);
        // 假设返回的数据结构与响应示例相同
        const graphData = response.data.data;
        this.updateChart(graphData);
      } catch (error) {
        console.error("Error fetching graph data:", error);
        alert("获取图谱数据失败");
      }
    },
    updateChart(graphData) {
      // 颜色映射
      const colorMap = {
        '中药': '#c23531',
        '功效': '#77ee92',

        // 可以添加更多类型和颜色的映射
      };

      // 为节点分配颜色
      const nodes = graphData.nodes.map(node => ({
        ...node,
        symbolSize: 50,  // 调整节点大小
        itemStyle: { color: colorMap[node.label_0] || '#c4ccd3' }, // 使用映射的颜色，如果未定义则使用默认颜色
        label: {
          show: true,
          formatter: '{b}'  // 显示节点的名称
        },
      }));

      // 连线数据
      const edges = graphData.edges ? graphData.edges.map(edge => ({
        ...edge,
        source: edge.source,
        target: edge.target,
        linestyle: {
          width: 2,  // 线条粗细
          curveness: 0.3  // 线条的曲度
        }
      })) : []; // 如果没有边，则提供一个空数组

      // 图表配置
      const option = {
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: function (params) {
            if (params.dataType === 'node') {
              // 根据标点符号格式化文本
              let text = params.data.attributes;
              text = text.replace(/([。；！？.?!])(\s*)/g, '$1<br>'); // 在标点符号后添加换行符
              if (text.length > 300) {
                // 如果文本超过300字符，只显示前300个字符后加省略号
                text = text.substring(0, 300) + '...';
              }
              return text;
            }
            return '';
          },
          extraCssText: 'max-width: 250px; word-wrap: break-word; white-space: normal;' // 设置样式
        },
        series: [{
          type: 'graph',
          layout: 'force',
          data: nodes,
          links: edges,
          force: {
            edgeLength: [100, 200], // 连线的长度范围
            repulsion: 1000  // 节点之间的排斥力
          },
          edgeLabel: {
            show: true,
            formatter: function (params) {
              return params.data.type;  // 显示连线的类型
            }
          },
          roam: true,
          lineStyle: {
            normal: {
              width: 2,
              curveness: 0.3
            }
          },
          edgeSymbol: ['circle', 'arrow'], // 为所有连线添加箭头
          edgeSymbolSize: [2, 10], // 设置箭头的大小
          emphasis: {
            focus: 'adjacency',
            lineStyle: {
              width: 10
            }
          }
        }]
      };

      this.chart.setOption(option, true);  // 使用新配置更新图表
    },

    executeCypherQuery() {

      let escapedQuery = this.cypherQuery.replace(/\\/g, '\\\\');
       // 构建请求数据
      const requestData = {
        cypher: escapedQuery
      };
      // 发送请求
      api.executeCypherQuery(requestData)
        .then(response => {
          // 假设返回的数据结构与响应示例相同
          const data = response.data.data.data;
          this.processTableData(data)
          // 将数据显示在页面上
        })
        .catch(error => {
          console.error('Error executing Cypher query:', error);
          alert('执行Cypher查询失败');
        });
    },
    processTableData(data) {
      if (!data || data.length === 0) {
        this.tableHeaders = [];
        this.tableData = [];
        return;
      }

      // 设置表格标题
      this.tableHeaders = Object.keys(data[0]);

      // 处理表格数据
      this.tableData = data.map(row => {
        return this.tableHeaders.map(header => {
          return typeof row[header] === 'object' ? JSON.stringify(row[header]) : row[header];
        });
      });
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.handleResize);
    }


  },
};
</script>

<style>
.container {
  display: flex;
  height: 90vh;
  background-color: #f4f4f8; /* 轻微的背景颜色 */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* 现代字体 */
  border: 1px solid #d3d3d3; /* 整体容器边框 */
}

.left-content, .right-content {
  flex: 1; /* 左右内容区域等分 */
  display: flex;
  flex-direction: column;
  align-items: stretch; /* 子元素拉伸以填充容器 */
  border: 1px solid #d3d3d3; /* 左右内容区域的边框 */
  margin: 10px; /* 间距 */
  padding: 20px; /* 内边距 */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2); /* 阴影效果 */
  background-color: white; /* 背景色 */
}

.search-select {
  padding: 10px;
  margin-right: 10px;
  border-radius: 8px; /* 增加圆角 */
  border: 1px solid #d3d3d3;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影 */
}

.input-area input {
  width: 300px;
  padding: 10px;
  border-radius: 8px; /* 增加圆角 */
  border: 1px solid #d3d3d3;
  margin-right: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 添加阴影 */
  transition: border-color 0.3s, box-shadow 0.3s; /* 添加过渡效果 */
}

.input-area input:focus {
  border-color: #4a8cc7;
  box-shadow: 0 0 8px rgba(74, 140, 199, 0.5); /* 焦点时的阴影效果 */
}

.input-area button {
  padding: 10px 20px;
  border-radius: 8px; /* 增加圆角 */
  border: none;
  background-color: #5b9bd5; /* 流行的蓝色调 */
  color: white;
  cursor: pointer;
  transition: all 0.3s; /* 平滑过渡效果 */
}

.input-area button:hover {
  background-color: #4a8cc7; /* 悬停效果 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 悬停时的阴影 */
}

.input-area button:active {
  transform: scale(0.98); /* 点击时的缩放效果 */
}

.graph-container {
  flex-grow: 1;
  width: 100%;
  overflow: auto; /* 内容超出时滚动 */
}

.query-input-area {
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.query-input-area textarea {
  width: 85%;
  max-width: 800px;
  padding: 10px;
  border-radius: 8px; /* 增加圆角 */
  border: 1px solid #d3d3d3;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影 */
  min-height: 100px;
  transition: border-color 0.3s, box-shadow 0.3s; /* 添加过渡效果 */
}

.query-input-area button {
  padding: 10px 15px;
  border: none;
  border-radius: 8px; /* 增加圆角 */
  margin-left: 10px;
  cursor: pointer;
  background-color: #5b9bd5;
  color: white;
  transition: background-color 0.3s;
}

.query-input-area button:hover {
  background-color: #4a8cc7; /* 悬停效果 */
}

.query-input-area button:active {
  background-color: #3678b5; /* 点击时的效果 */
}

.data-display-area {
  flex-grow: 1;
  width: 100%;
  overflow: auto; /* 允许内容过多时滚动 */
}

.data-display-area table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 表格阴影 */
}

.data-display-area th, .data-display-area td {
  border: 1px solid #ddd;
  padding: 8px;
  transition: background-color 0.3s; /* 平滑背景色变化 */
}

.data-display-area th {
  background-color: #e3e4e6; /* 表头背景色 */
}

.data-display-area tr:nth-child(even) {
  background-color: #f9f9f9;
}

.data-display-area tr:hover {
  background-color: #e3e4e6; /* 悬停行的背景色 */
}
</style>






