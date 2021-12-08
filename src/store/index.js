import { createStore } from 'vuex';

export default createStore({
  state: {
    memoryLimit: 0,
    queueTasks: [],
    currentTasks: [],
    doneTasks: [],
    lostTasks: [],
  },
  getters: {
    memoryUsage(state) {
      return state.currentTasks.reduce((acc, el) => acc + el.size, 0);
    },

    freeMemory(state, getters) {
      return state.memoryLimit - getters.memoryUsage;
    },

  },
  mutations: {
    setCurrentTasks(state, val) {
      state.currentTasks = val;
    },

    setDoneTasks(state, val) {
      state.doneTasks = val;
    },

    setQueueTasks(state, val) {
      state.queueTasks = val;
    },

    setLostTasks(state, val) {
      state.lostTasks = val;
    },

    setMemoryLimit(state, val) {
      state.memoryLimit = val;
    },
  },
});
