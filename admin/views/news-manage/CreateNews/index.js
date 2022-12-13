// 引入模块
import { load, isLogin } from '/code/web_js_project/admin/util/LoadView.js'

load('sidemenu-addNews')

let content = ''
let cover = ''

const { createEditor, createToolbar } = window.wangEditor

const editorConfig = {
  placeholder: 'Type here...',
  onChange(editor) {
    const html = editor.getHtml()
    // console.log('editor content', html)
    // 也可以同步到 <textarea>
    // 收集文章内容
    content = html
  }
}

const editor = createEditor({
  selector: '#editor-container',
  html: '<p><br></p>',
  config: editorConfig,
  mode: 'default', // or 'simple'
})

const toolbarConfig = {}

const toolbar = createToolbar({
  editor,
  selector: '#toolbar-container',
  config: toolbarConfig,
  mode: 'default', // or 'simple'
})

// 上传封面图片，转base64格式存储
coverfile.onchange = function (evt) {
  // console.log(evt.target.files[0])
  // ====>base64

  let reader = new FileReader()
  reader.readAsDataURL(evt.target.files[0])
  reader.onload = function (e) {
    // console.log(e.target.result) // result : base64转换结果
    cover = e.target.result
  }
}

addNewsForm.onsubmit = async function (evt) {
  evt.preventDefault()

  await fetch('http://localhost:3000/news', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      title: title.value,
      content,
      category: category.value,
      cover,
      author: JSON.parse(isLogin()).username //作者
    })
  }).then(res => res.json())

  location.href = '/code/web_js_project/admin/views/news-manage/NewsList/index.html'
}