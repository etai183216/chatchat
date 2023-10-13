import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/Home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/Chat',
    name: 'chat',
    component: () => import('../views/ChatView.vue')
  },
  {
    path:'/Login',
    name:'login',
    component:() => import('../views/LoginView.vue')
  },
  {
    path:'/CreateChatRoom',
    name:'CreateChatRoom',
    component:() =>import('../views/CreateChatRoomView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
