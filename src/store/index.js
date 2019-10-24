import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    spreadsheetData: []
  },
  mutations: {
    setSpreadsheetData(state, payload) {
      state.spreadsheetData = payload;
    }
  },
  actions: {
    commitSepreadsheetData({ commit, state }, data) {
      const spreadsheetData = [...state.spreadsheetData, data];
      commit("setSpreadsheetData", spreadsheetData);
    }
  }
});
