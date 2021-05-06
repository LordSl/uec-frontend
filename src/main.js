import Vue from 'vue'
import VueRouter from "vue-router"
import home from './component/home'

const routes = [
  { path: '/', name: 'home', component: home },
]

const router = new VueRouter({
  routes: routes,// （缩写）相当于 routes: routes
  mode: 'history'
})

Vue.use(VueRouter)

new Vue({
  el: '#app',
  render: h => h(home),
  router
})
