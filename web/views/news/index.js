// 引入模块
import { load } from '/code/web_js_project/web/util/LoadView.js'

load('topbar-news') // 加载topbar

let listGroup = document.querySelector('.list-group')
let list = []

search.oninput = async function () {
  // console.log(search.value)
  if (!search.value) {
    listGroup.style.display = 'none'
    return
  }
  listGroup.style.display = 'block'

  let res = await fetch('http://localhost:3000/news?title_like=' + search.value)
    .then(res => res.json())
  // console.log(res)
  listGroup.innerHTML = res.map(item => `
    <li class="list-group-item">
      <a href="/code/web_js_project/web/views/detail/index.html?id=${item.id}">
        ${item.title}
      </a>
    </li>
  `).join('')
}

search.onblur = function () {
  // 延迟失去焦点时间
  setTimeout(() => {
    listGroup.style.display = 'none'
  }, 300)
}

async function render() {
  await renderList()
  await renderTabbar()
}

render()

async function renderList() {
  list = await fetch('http://localhost:3000/news').then(res => res.json())
  list.reverse() // 最新新闻放在前面
  // console.log(list.slice(0, 4))
  let cardContainer = document.querySelector('.cardContainer')
  cardContainer.innerHTML = list.slice(0, 4).map(item => `
    <div class="card" data-myid="${item.id}">
      <div style="background-image: url(${item.cover});" class="imgcover"></div>
      <div class="card-body">
        <h5 class="card-title" style="font-size: 16px;">${item.title}</h5>
        <p class="card-text" style="font-size: 12px; color: gray;">作者：${item.author}</p>
      </div>
    </div>
  `).join('')

  for (let item of cardContainer.querySelectorAll('.card')) {
    // console.log(item.dataset.myid)
    item.onclick = function () {
      location.href = `/code/web_js_project/web/views/detail/index.html?id=${item.dataset.myid}`
    }
  }
}

function renderTabbar() {
  let categoryObj = _.groupBy(list, item => item.category)
  console.log(categoryObj)

  let tabs = [tab0, tab1, tab2]
  tabs.forEach((item, index) => {
    item.innerHTML = categoryObj[index]?.map(item => `
      <div class="card mb-3" data-id="${item.id}">
        <div class="row g-0" data-id="${item.id}">
          <div class="col-md-4" data-id="${item.id}">
            <div style="background-image: url(${item.cover});" class="imgcover"></div>
          </div>
          <div class="col-md-8" data-id="${item.id}">
            <div class="card-body" data-id="${item.id}">
              <h5 class="card-title" data-id="${item.id}">${item.title}</h5>
              <p class="card-text" data-id="${item.id}"><small class="text-muted" data-id="${item.id}">作者：${item.author}</p>
            </div>
          </div>
        </div>
      </div>
    `).join('') || '空空如也'

    item.onclick = function (evt) {
      // console.log('111', evt.target.dataset.id)
      location.href = `/code/web_js_project/web/views/detail/index.html?id=${evt.target.dataset.id}`
    }
  })
}