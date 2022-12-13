// 引入模块
import { load, isLogin } from '/code/web_js_project/admin/util/LoadView.js'

load('sidemenu-home') // 加载topbar、sidemenu

let user = JSON.parse(isLogin())
let categoryList = ['最新动态', '典型案例', '通知公告']

// console.log(user)
// <pre> 元素表示预定义格式文本 
document.querySelector('.userprofile').innerHTML = `
  <img src="${user.photo}" style="width: 100px;"/>
  <div>
    <div>${user.username}</div>
    <div><pre>${user.introduction || '这个人很懒'}</pre></div>
  </div>
`

async function analyseList() {
  let res = await fetch('http://localhost:3000/news?author=' + user.username).then(res => res.json())
  // console.log(res)
  // console.log(_.groupBy(res, item => item.category))
  let obj = _.groupBy(res, item => item.category)

  let arr = []
  for (let i in obj) {
    arr.push({
      value: obj[i].length,
      name: categoryList[i]
    })
  }
  // console.log(arr)

  renderEcharts(arr)
}

analyseList()

function renderEcharts(data) {
  // 基于准备好的dom，初始化echarts实例
  let myChart = echarts.init(document.getElementById('main'))

  // 指定图表的配置项和数据
  let option = {
    title: {
      text: '当前用户发布的新闻',
      subtext: '不同类型占比',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '类别',
        type: 'pie',
        radius: '50%',
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option)
}