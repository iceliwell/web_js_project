async function load(id) {
  // topbar
  let topbarText = await fetch('/code/web_js_project/web/components/topbar/index.html')
    .then(res => res.text())
  document.querySelector('.topbar').innerHTML = topbarText

  if (id) {
    document.querySelector(`#${id}`).style.color = '#0d6efd'
  }
}

export { load } // 加载topbar