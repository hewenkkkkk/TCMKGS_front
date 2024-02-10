<template>
  <div class="dashboard-container">
    <div class="info-boxes">
      <div class="info-box">
        <div class="info-title">节点数量</div>
        <div class="info-value">{{ nodeCount }}</div>
      </div>
      <div class="info-box">
        <div class="info-title">关系数量</div>
        <div class="info-value">{{ relationshipCount }}</div>
      </div>
    </div>
    <div class="charts">
      <div class="chart-container">
        <div ref="nodeChart" class="bar-chart"></div>
      </div>
      <div class="chart-container">
        <div ref="relationshipChart" class="bar-chart"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import api from '../../api/api';

export default {
  name: 'MyChart',
  data() {
    return {
      nodeChart: null,
      relationshipChart: null,
      nodeCount: 0,
      relationshipCount: 0,
    };
  },
  mounted() {
    this.fetchChartData();
    this.fetchCounts();
    this.fetchRelationshipData();
  },
  methods: {
    async fetchChartData() {
      try {
        const response = await api.countNodesType();
        const chartData = response.data.data;
        this.initNodeChart(chartData);
      } catch (error) {
        console.error('Error fetching node chart data:', error);
      }
    },
    async fetchCounts() {
      try {
        const nodeResponse = await api.getCountNodes();
        const relationshipResponse = await api.countRelationships();
        this.nodeCount = nodeResponse.data.data;
        this.relationshipCount = relationshipResponse.data.data;
        console.log('节点数量',nodeResponse)
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    },
    async fetchRelationshipData() {
      try {
        const response = await api.countRelationshipType();
        const chartData = response.data.data;
        this.initRelationshipChart(chartData);
      } catch (error) {
        console.error('Error fetching relationship chart data:', error);
      }
    },
    initNodeChart(chartData) {
      const chartDom = this.$refs.nodeChart;
      this.nodeChart = echarts.init(chartDom);
      const option = {
        title: {
          text: '节点种类',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c}' // 显示类别和数量
        },
        xAxis: {
          type: 'category',
          data: chartData.map(item => item.type),
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: chartData.map(item => item.count),
            type: 'bar',
          },
        ],
      };
      this.nodeChart.setOption(option);
    },
    initRelationshipChart(chartData) {
      const chartDom = this.$refs.relationshipChart;
      this.relationshipChart = echarts.init(chartDom);
      const option = {
        title: {
          text: '关系种类',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c}' // 显示类别和数量
        },
        xAxis: {
          type: 'category',
          data: chartData.map(item => item.type),
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: chartData.map(item => item.count),
            type: 'bar',
          },
        ],
      };
      this.relationshipChart.setOption(option);
    },
  },
};
</script>

<style>
.dashboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 1200px; /* 限制最大宽度 */
  margin: auto; /* 水平居中 */
}

.info-boxes {
  display: flex;
  justify-content: center;
  gap: 20px;
  width: 100%;
}

.info-box {
  background: #f0f0f0;
  padding: 10px 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 150px; /* 确保在小屏幕上也有足够的空间 */
}

.charts {
  display: flex;
  justify-content: space-around;
  width: 100%;
  flex-wrap: wrap; /* 在小屏幕上换行 */
}

.chart-container {
  flex: 1;
  padding: 10px;
  min-width: 300px; /* 设置最小宽度，避免图表太小 */
}

.bar-chart {
  width: 100%;
  height: 400px;
}
</style>
