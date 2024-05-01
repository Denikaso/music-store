import { createStore } from 'vuex';

export default createStore({
  state: {
    isAuthenticated: !!localStorage.getItem('jwtToken'),
  },
  mutations: {
    login(state) {
      state.isAuthenticated = true;
    },
  },
  getters: {

  },
  actions: {
    
  },
  modules: {
    
  }
});
