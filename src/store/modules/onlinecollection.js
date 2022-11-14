const state = {
  onlineCollectionTableData: {
    list: [],
    total: 0,
    columns: []
  },
  onlineCollectionDialogVisible: false,
  onlineCollectionUploadFormVisible: false
}
const mutations = {
  SET_OC_TABLEDATA: (state, tab) => {
    state.onlineCollectionTableData = tab
  },
  SET_OC_DIALOGVISIBLE: (state, flag) => {
    state.onlineCollectionDialogVisible = flag
  },
  SET_OC_UPLOADFORMVISIBLE: (state, flag) => {
    state.onlineCollectionUploadFormVisible = flag
  }
}
const actions = {
  setOCTableData({ commit }, data) {
    commit('SET_OC_TABLEDATA', data)
  },
  setOCDialogVisible({ commit }, data) {
    commit('SET_OC_DIALOGVISIBLE', data)
  },
  setOCUploadFormVisible({ commit }, data) {
    commit('SET_OC_UPLOADFORMVISIBLE', data)
  }
}

export default {
  state,
  mutations,
  actions
}
