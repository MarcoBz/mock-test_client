import Vue from 'vue'
import Router from 'vue-router'
import MockTestPage from '../components/MockTestPage'
// import Results from '../components/Results'
// import Table from '../components/Table'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
    },
    {
      path: '/MockTestPage',
      name: 'MockTestPage',
      component: MockTestPage,
      props: true
      // children: [
      //   {
      //     path: '/MockTest/Results',
      //     name: 'Results',
      //     props: true,
      //     component: Results
      //   }
      // ]
    },
    // {
    //   path: '/Table',
    //   name: 'Table',      
    //   component: Table,
    //   props: true
    // }
  ]
})
