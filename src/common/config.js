export const ACCEPT_CONFIG = {
  image: ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
  video: ['.mp4', '.rmvb', '.mkv', '.wmv', '.flv'],
  document: ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.txt', '.tif', '.tiff', '.rar', '.zip'],
  getAll() {
    return [...this.image, ...this.video, ...this.document]
  }
}
// 下拉框大数据表名列表
export const BIG_DATA_TABLE = ['ZBGC_ZBGC', 'ZCHJ_HHSHJ']

