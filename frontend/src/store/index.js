import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    orders: [],
    categories: [],
    loading: false,
    host: 'http://192.168.1.50:3000',
    static: 'http://192.168.1.50:3000/static/images/'
  },
  getters: {
  },
  mutations: {
    setOrders(state, orders) {
      state.orders = orders
    },
    addOrder(state, order) {
      state.orders.unshift(order)
    },
    setLoading(state, value) {
      state.loading = value
    }
  },
  actions: {
    async getOrderList({state, commit}) {
      try {
        commit('setLoading', false)
        
        const response = await axios.get(`${state.host}/orders`)
        console.log(response.data)
        state.orders = response.data
        
        commit('setLoading', true)
      } catch (err) {
        console.log(err)
      }
    }
  },
  modules: {
  }
})
