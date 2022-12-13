// 引入模块
import { load, isLogin } from '/code/web_js_project/admin/util/LoadView.js'

load('sidemenu-newsList')
// 创建模态框
let myPreviewModal = new bootstrap.Modal(document.getElementById('previewModal'))
let myDelModal = new bootstrap.Modal(document.getElementById('delModal'))

let list = []
let categoryList = ['最新动态', '典型案例', '通知公告']
let updateId = 0

async function render() {
  let username = JSON.parse(isLogin()).username
  list = await fetch(`http://localhost:3000/news?author=${username}`).then(res => res.json())
  // console.log(list)

  listbody.innerHTML = list.map(item => `
    <tr>
      <th scope="row">${item.title}</th>
      <td>${categoryList[item.category]}</td>
      <td>
        <button type="button" class="btn btn-success btn-preview" data-myid="${item.id}">预览</button>
        <button type="button" class="btn btn-primary btn-edit" data-myid="${item.id}">编辑</button>
        <button type="button" class="btn btn-danger btn-del" data-myid="${item.id}">删除</button>
      </td>
    </tr>
  `).join('')
}

render()

listbody.onclick = function (evt) {
  // console.log(evt.target.className)
  if (evt.target.className.includes('btn-preview')) {
    // console.log('预览', evt.target.dataset.myid)
    myPreviewModal.toggle()

    let obj = list.filter(item => item.id == evt.target.dataset.myid)[0]
    // console.log(obj)
    renderPreviewModal(obj)
  }
  if (evt.target.className.includes('btn-edit')) {
    // console.log('编辑')
    location.href = '/code/web_js_project/admin/views/news-manage/EditNews/index.html?id='
      + evt.target.dataset.myid // 带上id
  }
  if (evt.target.className.includes('btn-del')) {
    // console.log('删除')
    updateId = evt.target.dataset.myid

    // 显示删除模态框
    myDelModal.toggle()
  }
}

function renderPreviewModal(obj) {
  previewModalTitle.innerHTML = obj.title
  previewModalContent.innerHTML = obj.content
}

delConfirm.onclick = async function () {
  await fetch(`http://localhost:3000/news/${updateId}`, {
    method: 'DELETE'
  }).then(res => res.json())
  // 隐藏删除动态框
  myDelModal.toggle()
  render()
}