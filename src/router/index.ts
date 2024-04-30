import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import PageNotFound from '@/views/PageNotFound.vue'
import ProductCatalog from '@/views/ProductCatalog.vue'
import ProductCard from '@/views/ProductCard.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/:catchAll(.*)*',
    name: 'PageNotFound',
    component: PageNotFound
  },
  {
    path: '/category/:categoryId',
    name: 'Catalog',
    component: ProductCatalog,
    props: true
  },
  {
    path: '/product/:productId',
    name: 'Product',
    component: ProductCard,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
