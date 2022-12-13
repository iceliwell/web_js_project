// 引入模块
import { load } from '/code/web_js_project/admin/util/LoadView.js'

load('sidemenu-userList')

let myEditModal = new bootstrap.Modal(document.getElementById('editModal'))
let myDelModal = new bootstrap.Modal(document.getElementById('delModal'))
let list = []
let updateId = 0
let photodata = '' // 当前用户要改的头像

async function render() {
  list = await fetch('http://localhost:3000/users')
    .then(res => res.json())

  console.log(list)
  listbody.innerHTML = list.map(item => `
    <tr>
      <th scope="row">${item.username}</th>
      <td>
        <img src="${item.photo}" style="width: 50px; border-radius: 50%;" />
      </td>
      <td>
        <button type="button" class="btn btn-primary btn-edit" ${item.default ? 'disabled' : ''} data-myid="${item.id}">编辑</button>
        <button type="button" class="btn btn-danger btn-del" ${item.default ? 'disabled' : ''} data-myid="${item.id}">删除</button>
      </td>
    </tr>
  `).join('')
}

render()

// 事件委托
listbody.onclick = function (evt) {
  // console.log(evt.target)

  if (evt.target.className.includes('btn-edit')) {
    // console.log('edit', evt.target.dataset.myid)
    updateId = evt.target.dataset.myid
    // console.log(list.filter(item => item.id == updateId))
    // 显示Modal
    myEditModal.toggle()
    // 预填Modal
    let { username, password, introduction, photo } = list.filter(item => item.id == updateId)[0]

    document.querySelector('#username').value = username
    document.querySelector('#password').value = password
    document.querySelector('#introduction').value = introduction

    photodata = photo
  } else if (evt.target.className.includes('btn-del')) {
    // console.log('del')
    myDelModal.toggle()
    updateId = evt.target.dataset.myid
  }
}
// 编辑
editConfirm.onclick = async function () {
  // console.log(document.querySelector('#username').value)
  // console.log(document.querySelector('#password').value)
  // console.log(document.querySelector('#introduction').value)
  // console.log(photodata)
  await fetch(`http://localhost:3000/users/${updateId}`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      username: document.querySelector('#username').value,
      password: document.querySelector('#password').value,
      introduction: document.querySelector('#introduction').value,
      photo: photodata
    })
  }).then(res => res.json())

  // 隐藏Modal
  myEditModal.toggle()
  // location.reload() // 这会重新渲染html，css，js，影响性能
  render()
}

// 上传头像，转base64格式存储
photofile.onchange = function (evt) {
  // console.log(evt.target.files[0])
  // ====>base64

  let reader = new FileReader()
  reader.readAsDataURL(evt.target.files[0])
  reader.onload = function (e) {
    // console.log(e.target.result)
    photodata = e.target.result
  }
}

// 删除
delConfirm.onclick = async function () {
  await fetch(`http://localhost:3000/users/${updateId}`, {
    method: 'DELETE'
  }).then(res => res.json())
  myDelModal.toggle()
  render()
}