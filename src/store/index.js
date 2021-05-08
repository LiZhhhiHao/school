import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token:'',
    userinformation:[]
  },
  mutations: {
    settoken(state, token){
      state.token = token;
    },
    setuser(state,information){
      state.userinformation = information;
    },
     deltoken(state) {
      state.token = '';
    },
  },
  actions: {
  },
  modules: {
  }
})
