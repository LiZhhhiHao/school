import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sidelis:''
  },
  mutations: {
    setsidelis(state, sidelis){
      state.sidelis = sidelis;
    }
  },
  actions: {
  },
  modules: {
  }
})
