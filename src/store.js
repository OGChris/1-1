/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    currentReport: null,
  },
  mutations: {
    setUser(state, value) {
      state.user = value;
    },
    setCurrentReport(state, value) {
      state.currentReport = value;
    },
    // setFirebaseApp(state, value) {
    //   state.firebaseApp = value;
    // },
  },
});
