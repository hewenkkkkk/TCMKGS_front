// treeLayout.js
import * as d3 from 'd3';

export function buildTree(graphData, container) {
    // 定义树形布局的尺寸
    const width = 800;
    const height = 600;

    // 创建树形布局
    const treeLayout = d3.tree().size([height, width]);

    // 将 graphData 转换为 d3 的层次数据结构
    const root = d3.hierarchy(graphData, (d) => d.children);

    // 计算树节点和连接线
    const treeData = treeLayout(root);

    // 创建 SVG 容器
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(40,0)'); // 将树形图稍微向右移动

    // 创建连接线
    const links = svg.append('g')
        .selectAll('path')
        .data(treeData.links())
        .enter()
        .append('path')
        .attr('d', d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x));

    // 创建节点
    const nodes = svg.append('g')
        .selectAll('g')
        .data(treeData.descendants())
        .enter()
        .append('g')
        .attr('transform', d => `translate(${d.y},${d.x})`);

    // 添加圆形标记每个节点
    nodes.append('circle')
        .attr('r', 5)
        .attr('fill', 'steelblue');

    // 添加标签
    nodes.append('text')
        .attr('dx', d => d.children ? -8 : 8)
        .attr('dy', 3)
        .style('text-anchor', d => d.children ? 'end' : 'start')
        .text(d => d.data.name);
}

