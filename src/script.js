let row, col
let cellWidth = 40;
let store = {}
let currentLv = 'low'
let flag = true
let GAMESTAUTS = 'gaming'
let level = {
  low: {
    row: 10,
    col: 20,
    thunders: 20,
    flags: 20
  },
  mid: {
    row: 12,
    col: 12,
    thunders: 30,
    flags: 30
  },
  max: {
    row: 15,
    col: 30,
    thunders: 50,
    flags: 50
  }
}

let bg = document.querySelector('.bg')
let flagEl = document.getElementById('flags')
let thunderEl = document.getElementById('thunders')

let score = {
  flagNum: level[currentLv].flags,
  thunderNum: level[currentLv].thunders,
  get flags() {
    return this.flagNum
  },
  set flags(newVal) {
    if (newVal >= 0) {
      flagEl.textContent = newVal
      this.flagNum = newVal
    }
  },
  get thunders() {
    return this.thunderNum
  },
  set thunders(newVal) {
    if (newVal >= 0) {
      thunderEl.textContent = newVal
      this.thunderNum = newVal
    }
  }
}

function init() {
  renderDom(level[currentLv].row, level[currentLv].col)
  if (flag) {
    flag = false
    addEvent()
  }
  randomThunder(
    level[currentLv].thunders,
    level[currentLv].col,
    level[currentLv].row
  )
}
function changeDom(lv) {
  if (lv != currentLv || GAMESTAUTS === 'over') {
    store = {}
    row = level[lv].row
    col = level[lv].col
    currentLv = lv
    score.flagNum = level[lv].flags
    score.thunderNum = level[lv].thunders
    init()
  }
}
function addEvent() {
  bg.addEventListener('click', (e) => {
    let target = e.target
    let targetName = target.nodeName.toLowerCase()
    if (target.classList.contains('flag-bg')) return
    if (targetName === 'li') {
      let key = target.id
      isOver(key, target)
    }
  })
  bg.addEventListener('contextmenu', (e) => {
    rightClick(e)
  })
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault()
  })
}
function isOver(key, target) {
  if (store[key].isOver) {
    overFn()
    return true
  }
  leftClick(target, key)
  return false
}
function randomThunder(num, col, row) {
  let x, y, key
  while (num) {
    x = Math.floor(Math.random() * col)
    y = Math.floor(Math.random() * row)
    key = store[`${y}-${x}`].isOver
    if (!key) {
      store[`${y}-${x}`].isOver = true
      num--
    }
  }
}
function renderDom(row, col) {
  let html = ``
  for (let y = 0; y < row; y++) {
    for (let x = 0; x < col; x++) {
      html += `<li id=${y}-${x}></li>`
      store[`${y}-${x}`] = { isOver: false }
    }
  }
  flagEl.textContent = score.flags
  thunderEl.textContent = score.thunders
  bg.style.width = (cellWidth + 1) * col + 'px'
  bg.innerHTML = html
}
function overFn() {
  var len = bg.childElementCount
  GAMESTAUTS = 'over'
  Array.from(bg.children).forEach(el => {
    let key = el.id
    if (store[key].isOver) {
      el.className = 'thunder-bg'
    } else {
      el.className = 'show-bg'
    }
  })
  setTimeout(() => {
    let conf = confirm("Game Over");
    console.log(conf)
    conf && changeDom(currentLv)
  }, 300)
}
function leftClick(dom) {
  let n = 0
  let posArr = dom.id.split('-')
  let posX = +posArr[1]
  let posY = +posArr[0]
  let arr = []
  dom.classList.add('show-bg')
  for (let y = posY - 1; y <= posY + 1; y++) {
    for (let x = posX - 1; x <= posX + 1; x++) {
      let dom = document.getElementById(`${y}-${x}`)
      if (dom && store[`${y}-${x}`].isOver) {
        n++
      }
    }
  }
  dom && (dom.textContent = n)
  if (n === 0) {
    for (let y = posY - 1; y <= posY + 1; y++) {
      for (let x = posX - 1; x <= posX + 1; x++) {
        let dom = document.getElementById(`${y}-${x}`)
        if (dom) {
          if (!dom.classList.contains('check')) {
            dom.classList.add('check')
            leftClick(dom)
          }
        }
      }
    }
  }
}
function rightClick(e) {
  let target = e.target
  let isLei = store[target.id].isOver
  if (score.flags <= 0) {
    if (target.classList.contains('flag-bg')) {
      target.classList.remove('flag-bg')
      score.flags++
    }
    return
  }
  let isFlag = target.classList.toggle('flag-bg')
  if (isLei && isFlag) {
    score.flags--
    score.thunders--
  } else if (!isLei && !isFlag) {
    score.flags++
  } else if (isLei && !isFlag) {
    score.flags++
    score.thunders++
  } else if (!isLei && isFlag) {
    score.flags--
  }
}
init()