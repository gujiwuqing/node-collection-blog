window.onload = function () {
  const progress = document.body.querySelector('.progress')
  let screenHeight = window.innerHeight
  let screenWidth = window.innerWidth
  let bodyHeight = document.body.offsetHeight - screenHeight
  let timer = null
  const handleScroll = function (e) {
    // @ts-ignore
    progress.style.width = Math.floor((e.currentTarget.scrollY / bodyHeight) * screenWidth) + 'px'
  }
  window.addEventListener('resize', function (e) {
    screenHeight = window.innerHeight
    screenWidth = window.innerWidth
    bodyHeight = document.body.offsetHeight - screenHeight
    handleScroll(e)
  })
  window.addEventListener('scroll', function (e) {
    handleScroll(e)
  }, false)
  
  const dateNode = document.body.querySelector('#date')
  const renderDate = function () {
    // @ts-ignore
    dateNode.innerHTML = dayjs().format('YYYY-MM-DD HH:mm:ss')
  }
  renderDate()
  if (timer) clearInterval(timer)
  timer = setInterval(renderDate, 1000)
}