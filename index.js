// 3.變數宣告
const menu = document.getElementById('menu')
const cart = document.getElementById('cart')
const totalAmount = document.getElementById('total-amount')
const subButton = document.getElementById('submit-button')
const clearButton = document.getElementById('delete-button')

let cartItems = {}
let total = 0
let productData

// 4.GET API 菜單產品資料
axios.get('https://ac-w3-dom-pos.firebaseio.com/products.json')
  .then(function(res) {
    console.log(res.data)
    productData = res.data
    displayProduct(res.data)
  })
  .catch(function(err) {
    console.log(err)
  })
// 5.將產品資料加入菜單區塊
function displayProduct(products) {
   products.forEach(product => {
     menu.innerHTML += `
      <div class="col-3">
       <div class="card" id=${product.id}>
          <img id=${product.id} src=${product.imgUrl} class="card-img-top" alt="...">
          <div id=${product.id} class="card-body">
            <h5 id=${product.id} class="card-title">${product.name}</h5>
            <p id=${product.id} class="card-text">${product.price}</p>
            <a id=${product.id} href="#" class="btn btn-primary">加入購物車</a>
          </div>
        </div>
      </div>
     `
   })
}

// 6.加入購物車
function addToCart(event) {
  // 找到觸發event的node元素，並得到其產品id
  const menuItem = event.target
  const id = menuItem.id
  // 在productData的資料裡，找到點擊的產品資訊 name, price
  const addedProduct = productData.find(product => product.id === id)
  const name = addedProduct.name
  const price = addedProduct.price
  
  // 加入購物車變數cartItems 分：有按過、沒按過
  //有按過
  if (cartItems[id]) {
      cartItems[id].quantity += 1
      cartItems[id].price += price
  } else { //沒按過
    cartItems[id] = {
      name, //name: name
      price,
      quantity: 1
    }
  }
  
  // 畫面顯示購物車清單 //map find 用在array專屬
  cart.innerHTML = Object.values(cartItems).map(item =>
  `<li class="list-group-item d-flex justify-content-between">${item.name} X ${item.quantity} 小計:${item.price}<i id='trash-icon' class="delete fa fa-trash-o fa-lg"></i></li>`).join('\n')
  // 計算總金額
  caculateTotal (price)
}

// 7.計算總金額
function caculateTotal (amount) {
  total += amount
  totalAmount.innerHTML = total
}
// 8.送出訂單
function submit() {
  let confirmation = confirm(`感謝購買\n${cart.textContent}\n共${totalAmount.textContent}元\n\n請再次確認購物車金額是否正確?`)
  if (confirmation === true) {
    let confirmation = confirm(`荷包要失血囉~~~再給你一次機會`)
    if (confirmation === true) {
      alert('送出的訂單就像潑出去的水，收不回來了!')
      reset()
    } else {
      alert('衝動是魔鬼!')
    }
  } else {
  alert('又幫助了一位差點送出訂單的買家!')
  }
}

// 9.重置資料
function reset() {
  let confirmation = confirm(`是否要清空購物車?`)
  if (confirmation === true) {
  cart.innerHTML = ``
  cartItems = {}
  total = 0
  totalAmount.innerHTML = `--`
  alert(`清得乾乾淨淨!`)
  } else {
  alert('又幫助了一位差點清空購物車的買家!')
  }
}

// 10. 加入事件監聽
menu.addEventListener ('click', addToCart)
subButton.addEventListener ('click', submit)
clearButton.addEventListener ('click', reset)
cart.addEventListener ('click', deleteCart)

// 11. 刪除購物車品項
function deleteCart(event) {
  if (event.target.classList.contains("fa-trash-o")) {
  console.log(event.target)
    let li = event.target.parentElement
    let numStart = li.textContent.indexOf(':') + 1
    let number = Number(li.textContent.substring(numStart))
    let nameEnd = li.textContent.indexOf(' ')
    let name = li.textContent.substring(0, nameEnd)
    
    li.remove()
    let value = Object.values(cartItems).find(product => product.name === name)
    let delId = findKey(cartItems, value)
    delete cartItems[delId]
    total -= number
    totalAmount.innerHTML = total
  }
}

//從cartItems尋找符合刪除項目value的key
function findKey (obj, value, compare = (a, b) => a === b) {
  return Object.keys(obj).find(k => compare(obj[k], value))  
}