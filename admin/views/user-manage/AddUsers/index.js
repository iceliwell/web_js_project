// 引入模块
import { load } from '/code/web_js_project/admin/util/LoadView.js'

load('sidemenu-addUser')

let photo = ''

addUserForm.onsubmit = async function (evt) {
  evt.preventDefault()
  /* console.log(username.value)
  console.log(password.value)
  console.log(introduction.value)
  console.log(photo) */

  await fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      username: username.value,
      password: password.value,
      introduction: introduction.value,
      photo
    })
  }).then(res => res.json())

  location.href = '/code/web_js_project/admin/views/user-manage/UserList/index.html'
}
// 上传头像，转base64格式存储
photofile.onchange = function (evt) {
  // console.log(evt.target.files[0])
  // ====>base64

  let reader = new FileReader()
  reader.readAsDataURL(evt.target.files[0])
  reader.onload = function (e) {
    // console.log(e.target.result)
    photo = e.target.result
  }
}