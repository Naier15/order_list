import { createRouter, createWebHistory } from 'vue-router'
import Table from '@/components/Table.vue'

const routes = [
  {
    path: '/',
    name: 'Table',
    component: Table
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
