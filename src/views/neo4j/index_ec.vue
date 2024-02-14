<template>
  <div>
    <!-- 控制面板，包含输入框和按钮 -->
    <div class="control-panel">
      <input type="number" v-model="nodeCount" placeholder="Enter node count" class="node-input"/>
      <button @click="fetchGraphData" class="control-button">数据加载</button>
      <button @click="exportImage" class="control-button">图片</button>
<!--      <button @click="exportJSON" class="control-button">导出Json</button>-->

      <!-- 布局选择下拉框 -->
      <select v-model="selectedLayout" class="layout-select">
        <option value="force">默认布局</option>
        <option value="circular">环形布局</option>
      </select>
    </div>

    <!-- 图表容器 -->
    <div class="graph-container">
      <div ref="chart" style="width: 100%; height: 100%;"></div>

      <!-- 节点详细信息模态框 -->
      <node-details-modal
          v-if="isNodeModalVisible"
          :nodeData="selectedNode"
          :isVisible="isNodeModalVisible"
          @save="saveNode"
          @update:isVisible="isNodeModalVisible = $event"
      />

      <!-- 关系详细信息模态框 -->
      <relationship-details-modal
          v-if="isRelationshipModalVisible"
          :relationshipData="selectedRelationship"
          :isVisible="isRelationshipModalVisible"
          @save="saveRelationship"
          @update:isVisible="isRelationshipModalVisible = $event"
      />
    </div>
  </div>
</template>


<script>
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components';
import { GraphChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import api from '../../api/api';
import NodeDetailsModal from '../neo4j/components/NodeDetailsModal.vue'
import RelationshipDetailsModal from "../neo4j/components/RelationshipDetailsModal.vue";
import { ElMessage } from 'element-plus';
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GraphChart,
  CanvasRenderer
]);

export default {
  name: 'GraphChartComponent',
  components: {
    RelationshipDetailsModal,
    NodeDetailsModal,
  },
  data() {
    return {
      myChart: null,
      isNodeModalVisible: false,
      selectedNode: null,
      searchQuery: '', // 用于存储搜索框的输入
      nodeCount: 300 ,// 新增属性
      graphData: null, // 初始时为null或适当的初始值
      isRelationshipModalVisible: false,
      selectedRelationship: null,
      selectedLayout: 'force', // 默认布局
    };
  },
  watch: {
    selectedLayout(newLayout) {
      this.updateGraphLayout(newLayout);
    }
  },
  mounted() {
    this.fetchGraphData();
  },
  methods: {
    updateGraphLayout(layout) {
      if (this.myChart) {
        const option = this.myChart.getOption();

        option.series.forEach(series => {
          if (series.type === 'graph') {
            series.data.forEach(node => {
              node.symbolSize = 50;
            });
            series.layout = layout;

            if (layout === 'circular') {
              // 根据节点数量动态调整节点大小
              const nodeSize = Math.max(10, 50 - series.data.length / 5);
              series.data.forEach(node => {
                node.symbolSize = nodeSize;
              });
              // 环形布局特定设置
              series.circular = {
                rotateLabel: true,
                radius: ['40%', '60%']
              };
            } else {
              // 重置为默认布局设置
              series.circular = null;
            }
          }
        });

        this.myChart.setOption(option, true);
      }
    },

    async fetchGraphData() {
      try {
        const response = await api.getNeo4jData(this.nodeCount);
        this.initializeGraph(response.data);
      } catch (error) {
        console.error("Error fetching graph data:", error);
        // 处理错误情况
      }
    },
    initializeGraph(graphData) {
      console.log("获取数据：",graphData)
      // 创建label到颜色的映射
      const labelColorMap = {};
      const colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3']; // 示例颜色数组
      let colorIndex = 0;
      // 检查并处理重复的节点ID或名称
      const uniqueIds = new Set();
      const uniqueNames = new Set();
      const chartDom = this.$refs.chart;
      this.myChart = echarts.init(chartDom);

      graphData.nodes.forEach(node => {
        if (uniqueIds.has(node.id)) {
          // 处理重复的id，例如添加后缀
          node.id += '_1';
        } else {
          uniqueIds.add(node.id);
        }

        if (uniqueNames.has(node.name)) {
          // 处理重复的name，例如添加后缀
          node.name += '_1';
        } else {
          uniqueNames.add(node.name);
        }
      });

      // 为每个独特的label_0分配颜色
      graphData.nodes.forEach(node => {
        const label = node.label_0;
        if (!(label in labelColorMap)) {
          labelColorMap[label] = colors[colorIndex % colors.length];
          colorIndex++;
        }

        node.itemStyle = { color: labelColorMap[label] }; // 设置节点颜色
      });

      graphData.nodes.forEach(function (node) {
        node.symbolSize = 50;
        node.label = {
          show: true, // 显示标签
          //formatter: `{b}` // `{b}` 表示使用节点的name属性作为标签
          formatter: function (params) {
            return params.data.name;
          }
        };
        node.value = node.label;
        node.category = node.attributes;
        node.draggable = true;
      });


      graphData.edges.forEach(function (edge) {
        edge.label = {
          show: true, // 显示标签
          formatter: edge.type // 使用edges的attributes属性作为标签
        };
      });

      const option = {
        title: {
          // text: 'Neo4j Graph Visualization',
          // top: 'bottom',
          // left: 'right'
        },
        tooltip: {},
        legend: [
          {

            data: graphData.nodes.map(node => node.value).filter((v, i, a) => a.indexOf(v) === i)
          }
        ],
        animation: false,
        animationDuration: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            name: 'Neo4j Graph',
            type: 'graph',
            layout: 'force',
            data: graphData.nodes,
            links: graphData.edges,
            circular: null,
            categories: graphData.nodes.map(node => {
              return { name: node.category };
            }),
            edgeLabel: { // 连线上的标签设置
              normal: {
                show: true,
                textStyle: {
                  fontSize: 10
                },
                formatter: function (params) {
                  return params.data.attributes; // 使用连线的attributes属性作为标签
                }
              }
            },
            roam: true,
            label: {
              position: 'right',
              formatter: '{b}'
            },
            force: {
              repulsion: 1000,
              edgeLength: [100,200]
            },
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
          }
        ]
      };
      this.myChart.on('click', (params) => {
        if (params.dataType === 'node') {
          this.selectedNode = { ...params.data };
          // console.log("Selected Node Data:", this.selectedNode);

          this.isNodeModalVisible = true;
          // console.log("Selected Node Data:", this.selectedNode);
        }
      });
      this.myChart.on('click',this.handleEdgeClick)
      this.myChart.setOption(option);
    },

    handleEdgeClick(params) {
      if (params.dataType === 'edge') {
        this.selectedRelationship = { ...params.data };
        this.isRelationshipModalVisible = true;
      }
    },
    saveRelationship(updatedData) {
      const dataToSend = {
        source: updatedData.source,
        target: updatedData.target,
        type: updatedData.type,
        attributes: updatedData.attributes
      };
      console.log("关系数据:", dataToSend);
      // 调用API更新关系数据
      api.updateRelationshipById(dataToSend).then(response => {
        if (response.data.code === 200) {
          ElMessage({
            message: response.data.info,
            type: 'success'
          })
          this.isRelationshipModalVisible = false;
          this.fetchGraphData(); // 刷新图表数据
        } else {
          ElMessage({
            message: response.data.info,
            type: 'error'
          })
        }
      })
    },

    saveNode(updatedData) {
      console.log(updatedData)
      // 准备发送的数据格式
      const dataToSend = {
        id: updatedData.id,
        name: updatedData.name,
        type: updatedData.label_0,
        attributes: updatedData.attributes
      };

      // 调用API保存更新后的节点数据
      api.updateNodeInfo(dataToSend).then((response) => {
        console.log("发送数据:", dataToSend);
        console.log("响应:", response);
        console.log("节点数据更新成功:", response.data.code);
        if (response.data.code === 200) {
          ElMessage({
            message: response.data.info,
            type: 'success'
          })
          this.isNodeModalVisible = false;
          this.fetchGraphData(); // 刷新图表数据
        } else {
          ElMessage({
            message: response.data.info,
            type: 'error'
          })
        }
      })
    },
    exportImage() {
      if (this.myChart) {
        const imageURL = this.myChart.getDataURL({
          pixelRatio: 2,
          backgroundColor: '#fff'
        });
        const link = document.createElement('a');
        link.href = imageURL;
        link.download = "graph.png";
        link.click();
      }
    },

    exportJSON() {
      if (!this.graphData || !this.graphData.nodes) {
        console.error("Graph data is not available.");
        return;
      }
      console.log("Exporting JSON");
      const graphData = {
        nodes: this.graphData.nodes,
        edges: this.graphData.edges
      };
      const jsonString = JSON.stringify(graphData);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      console.log("Blob URL:", url);

      const link = document.createElement('a');
      link.href = url;
      link.download = "graph.json";
      document.body.appendChild(link); // 可能需要添加到body
      link.click();
      document.body.removeChild(link); // 清理
    },
    searchNode() {
      const nodeName = this.searchQuery.trim();
      if (!nodeName) return;

      const nodes = this.myChart.getOption().series[0].data;
      const nodeToFocus = nodes.find(node => node.name === nodeName);

      if (nodeToFocus) {
        const nodePosition = { x: nodeToFocus.x, y: nodeToFocus.y };

        // 聚焦到该节点
        this.myChart.setOption({
          series: [{
            center: [nodePosition.x, nodePosition.y],
            zoom: 2,
          }]
        });

        this.myChart.dispatchAction({
          type: 'focusNodeAdjacency',
          seriesIndex: 0,
          dataIndex: nodes.indexOf(nodeToFocus)
        });
      } else {
        alert('Node not found');
      }
    },


    beforeDestroy() {
      if (this.myChart) {
        this.myChart.dispose();
      }
    }
  }
};
</script>

<style>
.control-panel {
  margin-bottom: 20px;
  text-align: center;
}

.node-input, .control-button {
  padding: 10px 15px;
  margin-right: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.control-button {
  border: none;
  background-color: #5b9bd5;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.control-button:hover {
  background-color: #4a8cc7;
}

.control-button:active {
  background-color: #3678b5;
}

.graph-container {
  width: 100%;
  height: 650px;
}
.layout-select {
  padding: 10px 15px;
  margin-right: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
}
</style>
