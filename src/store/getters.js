const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  onlineCollectionTableData: state => state.onlinecollection.onlineCollectionTableData,
  onlineCollectionDialogVisible: state => state.onlinecollection.onlineCollectionDialogVisible,
  onlineCollectionUploadFormVisible: state => state.onlinecollection.onlineCollectionUploadFormVisible
}
export default getters
