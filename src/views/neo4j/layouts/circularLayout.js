export const circularLayoutOption = (graphData) => {
    // 预处理节点，例如设置标签的显示
    graphData.nodes.forEach(node => {
        node.label = {
            show: node.symbolSize > 30 // 根据需要调整
        };
    });

    // 构建类别信息，如果您的数据包含类别
    const categories = graphData.categories || [];

    // ECharts 环形布局配置
    return {
        title: {
            text: 'Customized Graph',
            subtext: 'Circular layout',
            top: 'bottom',
            left: 'right'
        },
        tooltip: {},
        legend: [{
            data: categories.map(category => category.name)
        }],
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [{
            name: 'Customized Graph',
            type: 'graph',
            layout: 'circular',
            circular: {
                rotateLabel: true
            },
            data: graphData.nodes,
            links: graphData.edges, // 确保这里使用您的数据结构中的边
            categories: categories,
            roam: true,
            label: {
                position: 'right',
                formatter: '{b}'
            },
            lineStyle: {
                color: 'source',
                curveness: 0.3
            }
        }]
    };
};
