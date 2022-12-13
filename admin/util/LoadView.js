function isLogin() {
  return localStorage.getItem('token')
}

function renderTopbar(user) {
  console.log(user)
  let photo = document.querySelector('#topbar-photo')
  let currentUsername = document.querySelector('#currentUsername')
  let exit = document.querySelector('#exit')

  photo.src = user.photo
  currentUsername.innerHTML = user.username

  exit.onclick = function () {
    localStorage.removeItem('token')
    location.href = '/code/web_js_project/admin/views/login/index.html'
  }
}

function renderSidemenu(user, id) {
  // 点击切换，高亮显示
  document.querySelector('#' + id).style.color = '#0d6efd'
  // 判断用户身份，是否具有管理员权限
  if (JSON.parse(user).role !== 'admin') {
    document.querySelector('.user-manage-item').remove()
  }
}

async function load(id) {
  let user = isLogin()
  if (user) {
    // topbar
    let topbarText = await fetch('/code/web_js_project/admin/components/topbar/index.html')
      .then(res => res.text())
    document.querySelector('.topbar').innerHTML = topbarText

    renderTopbar(JSON.parse(user))
    // sidemenu
    let sidemenuText = await fetch('/code/web_js_project/admin/components/sidemenu/index.html')
      .then(res => res.text())
    document.querySelector('.sidemenu').innerHTML = sidemenuText

    renderSidemenu(user, id)
  } else {
    location.href = '/code/web_js_project/admin/views/login/index.html'
  }
}

export { load, isLogin } // 加载topbar和sidemenu