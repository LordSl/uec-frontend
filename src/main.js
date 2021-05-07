import Vue from 'vue'
import VueRouter from "vue-router"
import login from './component/ChatRoom'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

const routes = [
  { path: '/', name: 'login', component: login },
]

const router = new VueRouter({
  routes: routes,// （缩写）相当于 routes: routes
  mode: 'history'
})

Vue.use(VueRouter)

Vue.use(ElementUI)

new Vue({
  el: '#app',
  render: h => h(login),
  // router
})
