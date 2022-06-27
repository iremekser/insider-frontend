import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FixtureView from '@/views/FixtureView'
import SimulationView from '@/views/SimulationView'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/fixture',
    name: 'fixture',
    component: FixtureView
  },
  {
    path: '/simulation',
    name: 'simulation',
    component: SimulationView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
