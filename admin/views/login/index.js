const loginform = document.querySelector('#loginform')
loginform.onsubmit = async function (evt) {
  loginwarning.style.display = 'none'
  // alert('1111')
  // console.log('submit')
  evt.preventDefault()

  console.log(username.value, password.value)

  // 正常 post请求
  /* fetch('http://localhost:3000/users', {
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      username: 'aaa',
      password: 123
    })
  })
    .then(res => res.json())
    .then(res => {
      console.log(res)
    }) */
  // json-server get获取，post添加，put修改，delete删除
  let res = await fetch(`http://localhost:3000/users?username=${username.value}&password=${password.value}`)
    .then(res => res.json())
  // console.log(res)
  if (res.length > 0) {
    localStorage.setItem('token', JSON.stringify({
      ...res[0],
      password: '****'
    }))
    // 登录成功，跳转至首页
    location.href = '/code/web_js_project/admin/views/home/index.html'
  } else {
    // 登录失败
    console.log('失败')
    loginwarning.style.display = 'block'
  }
}