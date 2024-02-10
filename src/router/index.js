import {createRouter, createWebHistory} from "vue-router";



const router =createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes:[
        {
            path:"/",
            name:"home",
            component:()=>import("../components/layout/AppLayout.vue"),
            children:[
                {
                    path:'',
                    component:()=>import("../views/Home.vue")
                },
                {
                    path:'neo4j',
                    component:()=>import("../views/findNeo4j/index.vue")
                },
                {
                    path:'findNeo4j',
                    component:()=>import("../views/neo4j/index_ec.vue")
                },
                {
                    path:'data',
                    component:()=>import("../views/dataView/index.vue")
                },
                {
                    path:'questions',
                    component:()=>import("../views/questions/index.vue")
                },
                {
                    path: 'questionId',
                    name: 'QuestionDetails',
                    component: () => import('../views/questions/QuestionDetails.vue')
                }

            ]
        },

    ],

});


//导出路由
export default router;
