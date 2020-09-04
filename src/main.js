import Vue from 'vue'
import App from './App.vue'
import Axios from 'axios'
import 'lib-flexible/flexible.js'

Vue.config.productionTip = false
window.Axios = Axios

new Vue({
  render: h => h(App),
}).$mount('#app')
