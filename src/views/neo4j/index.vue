<template>
  <div class="graph-container">
    <div id="cy"></div>
    <node-edit-modal
        v-if="isModalVisible"
        :nodeData="selectedNode"
        :isVisible="isModalVisible"
        @save="updateNode"
        @update:isVisible="isModalVisible = $event"
    ></node-edit-modal>
    <edge-edit-modal
        v-if="isEdgeModalVisible"
        :edgeData="selectedEdge"
        :isVisible="isEdgeModalVisible"
        @save="updateEdge"
        @update:isVisible="isEdgeModalVisible = $event"
    ></edge-edit-modal>
  </div>
</template>

<script>
import cytoscape from 'cytoscape';
import api from '../../api/api.js'
import NodeEditModal from '../neo4j/components/NodeEditModal.vue'// 确保路径正确
import EdgeEditModal from '../neo4j/components/EdgeEditModal.vue'

export default {
  components: {
    NodeEditModal,
    EdgeEditModal
  },
  data() {
    return {
      graphData: null,
      labelColors: {},
      isModalVisible: false,
      selectedNode: null,
      isEdgeModalVisible: false,
      selectedEdge: null,
    };
  },
  mounted() {
    this.fetchGraphData();
  },
  methods: {
    // 更新边的方法
    async updateEdge(updatedData) {
      try {
        const response = await api.updateRelationshipById(updatedData);
        console.log(response.data);
        alert("连线信息更新成功");
        this.isEdgeModalVisible = false;
        // 可能需要重新获取图形数据并刷新图形
        await this.fetchGraphData();
        this.initializeGraph();
      } catch (error) {
        console.error("Error updating relationship:", error);
        alert("连线信息更新失败");
      }
    },
    async fetchGraphData() {
      try {
        const response = await api.getNeo4jData();
        this.graphData = response.data;
        this.initializeGraph();
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    },
    initializeGraph() {
      if (!this.graphData) return;
      const vm = this; // 保存组件实例的引用
      const cy = cytoscape({
        container: document.getElementById('cy'),
        elements: this.getElements(),
        style: [
          {
            selector: 'node',
            style: {
              'background-color': 'data(color)',
              'label': 'data(name)',
              'text-valign': 'center',
              'text-halign': 'center',
              'color': '#fff',
              'text-outline-width': 2,
              'text-outline-color': '#888',
              'font-size': 12,
              'font-weight': 'bold',
            }
          },
          {
            selector: 'edge',
            style: {
              'curve-style': 'bezier',
              'target-arrow-shape': 'triangle',
              'line-color': '#9dbaea',
              'target-arrow-color': '#9dbaea',
              'label': 'data(label)',
              'text-margin-y': '-10px',
              'text-rotation': 'autorotate',
              'font-size': 10,
              'color': '#444',
            }
          }
        ],
        layout: {
          name: 'cose',
          idealEdgeLength: 100,
          nodeOverlap: 20,
          refresh: 20,
          fit: true,
          padding: 30,
          randomize: false,
          componentSpacing: 100,
          nodeRepulsion: 400000,
          edgeElasticity: 100,
          nestingFactor: 5,
        },
      });
      cy.on('tap', 'node', function(evt) {
        const node = evt.target;
        vm.selectedNode = {
          id: node.id(),
          name: node.data('name'),
          attributes: node.data('attributes'),
          label: node.data('label'),
        };
        vm.isModalVisible = true;

      });

      // 边的点击事件处理
      let tappedBefore;
      let tappedTimeout;
      cy.on('tap', 'edge', (evt) => {
        const edge = evt.target;
        if (tappedBefore && tappedBefore === edge) {
          // 处理双击事件
          clearTimeout(tappedTimeout);
          tappedBefore = null;
          vm.selectedEdge = {
            source: edge.source().id(),
            target: edge.target().id(),
            type: edge.data('label'),
            attributes: edge.data('attributes')
          };
          vm.isEdgeModalVisible = true;
        } else {
          // 单击处理
          tappedTimeout = setTimeout(() => {
            tappedBefore = null;
            // 调用删除连线的方法
            vm.deleteRelationship(edge.source().id(), edge.target().id());
          }, 300);
          tappedBefore = edge;
        }
      });
      //突出显示节点
      cy.on('mouseover', 'node', function(evt) {
        const node = evt.target;
        const connectedEdges = node.connectedEdges();
        const connectedNodes = connectedEdges.connectedNodes();
        const unconnectedElements = cy.elements().difference(node.union(connectedNodes).union(connectedEdges));

        // 突出显示当前节点、与其连接的节点和边
        node.style('background-color', node.data('color'));
        connectedNodes.style('background-color', (n) => n.data('color'));
        connectedEdges.style({ 'line-color': '#9dbaea', 'target-arrow-color': '#9dbaea' });

        // 使其他元素颜色变淡（包括节点、边和节点的文字）
        unconnectedElements.style({
          'background-color': '#ddd', // 未连接的节点
          'line-color': '#ddd', // 未连接的边
          'target-arrow-color': '#ddd', // 边上的箭头
          'color': '#ffffff', // 节点的文字
          'text-opacity': 0.5 // 文字的透明度
        });
      });

      // 当鼠标离开节点时，恢复原样
      cy.on('mouseout', 'node', function() {
        cy.elements().style({
          'background-color': (n) => n.data('color') || '#9dbaea',
          'line-color': '#9dbaea',
          'target-arrow-color': '#9dbaea',
          'color': 'node', // 恢复节点的文字颜色
          'text-opacity': 1 // 恢复节点的文字透明度
        });

        cy.edges().style({
          'color': '#444', // 恢复连线的文字颜色
          'text-opacity': 1 // 恢复连线的文字透明度
        });
      });


    },
    // 删除连线的方法
    async deleteRelationship(sourceId, targetId) {
      try {
        const response = await api.deleteRelationship(sourceId, targetId)
        console.log(response.data);
        alert("连线删除成功");

        // 可能需要重新获取图形数据并刷新图形
        await this.fetchGraphData();
        this.initializeGraph();
      } catch (error) {
        console.error("Error deleting relationship:", error);
        alert("连线删除失败");
      }
    },
    async updateNode(updatedData) {
      try {
        const response = await api.updateNodeInfo(updatedData);
        console.log(response.data);
        alert("节点更新成功");
        // 刷新图形显示最新信息
        await this.fetchGraphData();
        this.initializeGraph();
      } catch (error) {
        console.error("Error updating node:", error);
        alert("节点更新失败");
      }
    },
    getElements() {
      const nodes = this.graphData.nodes.map(node => ({
        data: {
          id: node.id,
          name: node.name,
          attributes: node.attributes, // 确保这些字段在 graphData 中
          label: node.label,
          color: this.getNodeColor(node.label)
        }
      }));
      const edges = this.graphData.edges.map(edge => ({
        data: {
          source: edge.source,
          target: edge.target,
          label: edge.type,
          attributes:edge.attributes
        }
      }));
      return nodes.concat(edges);
    },
    getNodeColor(label) {
      if (!(label in this.labelColors)) {
        this.labelColors[label] = '#' + Math.floor(Math.random()*16777215).toString(16);
      }
      return this.labelColors[label];
    }
  }
};
</script>

<style>
.graph-container {
  position: relative; /* 容器相对定位 */
  width: 100%; /* 根据需要调整宽度 */
  height: 800px; /* 根据需要调整高度 */
}
#cy {
  width: 100%;
  height: 800px;
}
</style>
