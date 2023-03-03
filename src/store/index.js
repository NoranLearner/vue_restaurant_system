import axios from "axios";
import { createStore } from 'vuex';
import router from '@/router/index';

const state = {
  isUserLoggedIn: "",
  LoggedInUserId: "",
  numOfCategories: "",
  listOfCategories: [],
  listOfLocations: [],
};

const getters = {};

const mutations = {
  redirectTo(state, payload) {
    router.push({ name: payload });
  },
  isLoggedInUser(state) {
    let user = localStorage.getItem('user-info');
    if (user) {
      state.isUserLoggedIn = true;
      state.LoggedInUserId = JSON.parse(user).id;
    } else {
      state.isUserLoggedIn = false;
    }
  },
  async displayAllCategories(state, payload) {
    let result = await axios.get(`
    http://localhost:3000/categories?userId=${payload.userIdIs}&locationId=${payload.locationIdIs}
    `);
    if (result.status == 200) {
      state.listOfCategories = result.data;
      state.numOfCategories = state.listOfCategories.length;
    }
  },
  async canUserAccessThisLocation(state, payload) {
    let result = await axios.get(`
    http://localhost:3000/locations?userId=${payload.userIdIs}&id=${payload.locationIdIs}
    `);
    if (result.status == 200) {
      state.listOfLocations = result.data;
      if (state.listOfLocations.length !== 1) {
        this.commit("redirectTo", payload.redirectToPage);
      }
    }
  },
  async canUserAccessThisCategory(state, payload) {
    let result = await axios.get(`
    http://localhost:3000/categories?userId=${payload.userIdIs}&locationId=${payload.locationIdIs}&id=${payload.catIdIs}
    `);
    if (result.status == 200) {
      state.listOfCategories = result.data;
      if (state.listOfCategories.length !== 1) {
        this.commit("redirectTo", payload.redirectToPage);
      }
    }
  },
};

const actions = {
  redirectTo({ commit }, payload) {
    commit("redirectTo", payload.val);
  },
};

export default createStore({
  state,
  getters,
  mutations,
  actions,
  modules: {}
})
