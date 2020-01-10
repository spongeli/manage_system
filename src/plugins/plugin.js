
import Vue from "vue"
// 折叠table插件
import TreeTable from 'vue-table-with-tree-grid'

// 富文本编辑器插件
import VueQuillEditor from "vue-quill-editor"
import 'quill/dist/quill.snow.css'

Vue.use(VueQuillEditor)
Vue.component("tree-table", TreeTable)
