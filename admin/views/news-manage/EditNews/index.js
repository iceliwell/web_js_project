// 引入模块
import { load, isLogin } from '/code/web_js_project/admin/util/LoadView.js'

load('sidemenu-newsList')

// 获取id
// console.log(new URL(location.href).searchParams.get('id'))
let updateId = new URL(location.href).searchParams.get('id')
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

editNewsForm.onsubmit = async function (evt) {
  evt.preventDefault()

  await fetch(`http://localhost:3000/news/${updateId}`, {
    method: 'PATCH', // patch 部分修改，put 全部修改
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      title: title.value,
      content,
      category: category.value,
      cover
    })
  }).then(res => res.json())

  location.href = '/code/web_js_project/admin/views/news-manage/NewsList/index.html'
}

async function render() {
  let obj = await fetch(`http://localhost:3000/news/${updateId}`).then(res => res.json())
  console.log(obj)
  let { title, content: mycontent, category, cover: mycover } = obj

  document.querySelector('#title').value = title
  document.querySelector('#category').value = category

  // 设置content
  editor.setHtml(mycontent)
  content = mycontent

  cover = mycover
}

render()