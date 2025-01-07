import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Transfer from '@/views/Transfer.vue'
import Menu from '@/views/Menu.vue'
import Connection from '@/views/Connection.vue'
import Result from '@/views/Result.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/transfer', component: Transfer },
    { path: '/menu', component: Menu },
    { path: '/connection', component: Connection },
    { path: '/result', component: Result },
  ]
})
