let products = document.querySelector('.products');
let category = document.querySelectorAll('.nav__items');
let sortPrice = document.querySelector('select');
let cartBtn = document.querySelector('.cart');
let counterCart = document.querySelector('.counter__cart');
let cartBox = document.querySelector('.cart__box');

let cart = [];
let flagBtn = 'all';
let sort = 'default';
let productCounter = 0;
let same = 0;
let counterCheck =0;
let totalPriceSum =0;
let totalPriceArr = [];

let putProductToCart = () => {
    cartBox.innerHTML = ` 
    <div class="cart__box-header">
    <input type="checkbox" class="cart__checkbox-all">
    <button class="close__cart">Close</button>
    </div>
    <div class="cart__product-box"></div>
    <div class="cart__box-footer">
    <h3 class="count__product"><span class="count__product-number">0</span>:товаров к оформлению</h3>
    <h2>общая сумма: <span class="total__price">0$</span></h2>
    <div class = "buttons__cart-order">
    <button class="order">оформить заказ</button>
    <button class="delete__order">delete</button>
    </div>
    </div>
    `;

    counterCart.textContent = cart.length;
    let cartClose = document.querySelector('.close__cart');
    cartClose.addEventListener('click', ()=>{
        cartBox.classList.remove('active');
    });

    const cartProductContainer = document.querySelector('.cart__product-box');

    cart.forEach((el) => {
    cartProductContainer.innerHTML += `
        <div class="cart__product">
        <input type="checkbox" class="cart__checkbox" data-id="${el.id}" ${el.checked ? 'checked' : ''}>
        <a href="oneCard.html#${el.id}">
        <img src="${el.image}" class="cart__product-img" alt="image">
        </a>
        <a href="oneCard.html#${el.id}" class = "oneCardCart">
        <h2 class="cart__product-title">${el.title}</h2>
        <h2 class="cart__product-price">${el.price.toFixed(2)}$</h2>
        </a>
        <div class="product__counter-box">
        <btn class="product__counter-less btns__counter" data-id="${el.id}">-</btn>
        <h2 class="product__counter">${el.productCounter}</h2>
        <btn class="product__counter-more btns__counter" data-id="${el.id}">+</btn>
        </div>
        </div>
    `;
    });

  

    let counterLess = document.querySelectorAll('.product__counter-less');
    let counterMore = document.querySelectorAll('.product__counter-more');

    counterLess.forEach((item) => {
    item.addEventListener('click', () => {
        let productId = parseInt(item.dataset.id);
        let product = cart.find((el) => el.id === productId);
        if (product) {
        if (product.productCounter > 1) {
            let previousCounter = product.productCounter;
            product.productCounter--;
            product.price = (product.price / previousCounter) * product.productCounter;
            putProductToCart();
            }
        }
    });
});
    counterMore.forEach((item) => {
    item.addEventListener('click', () => {
        let productId = parseInt(item.dataset.id);
        let product = cart.find((el) => el.id === productId);
        if (product) {
        let previousCounter = product.productCounter;
        product.productCounter++;
        product.price = (product.price * product.productCounter) / previousCounter;
        putProductToCart();
            }
        });
    });

    let cartCheckboxAll = document.querySelector('.cart__checkbox-all');
    let cartCheckbox = document.querySelectorAll('.cart__checkbox');
    let countProductNumber = document.querySelector('.count__product-number');
    let totalPrice = document.querySelector('.total__price');

    let deleteOrder = document.querySelector('.delete__order');
    cartCheckbox.forEach(item => {
        let productId = parseInt(item.dataset.id);
        let product = cart.find(el => el.id === productId);
        item.addEventListener('change', (event) => {
            event.preventDefault();
            if (event.target.checked) {
                if (product) {                    
                    counterCheck++;
                    product.checked = true;
                    countProductNumber.textContent = counterCheck;
                    totalPriceArr.push(product.price);
                    totalPriceSum = totalPriceArr.reduce((acc, el) => acc + el, 0);
        totalPrice.textContent = `${totalPriceSum}$`;
                    deleteOrder.addEventListener('click',()=>{
                        cart = cart.filter(item => item.id !== productId);
                        putProductToCart();
                    });
                }
            } else {
                if (product) {
                    product.checked = false;
                    counterCheck--;
                    countProductNumber.textContent = counterCheck;
                    totalPriceArr = totalPriceArr.filter(price => price !== product.price);
                    totalPriceSum = totalPriceArr.reduce((acc, el) => acc + el, 0);
                    totalPrice.textContent = `${totalPriceSum}$`;
                }
            }
            const cartCheckboxToArray = [...cartCheckbox];
            if(cartCheckboxToArray.some(item => !item.checked)){
                cartCheckboxAll.checked = !cartCheckboxToArray.some(item => !item.checked);
            }
                else if (cartCheckboxToArray.every(item => item.checked)) {
                    cartCheckboxAll.checked = cartCheckboxToArray.every(item => item.checked);
            }
        });
    });

    cartCheckboxAll.addEventListener('change', (event) => {
        const isChecked = event.target.checked;
    
        cartCheckbox.forEach(item => {
            item.checked = isChecked;
            let productId = parseInt(item.dataset.id);
            let product = cart.find(el => el.id === productId);
    
            if (isChecked) {
                if (product && !product.checked) {
                    counterCheck++;
                    product.checked = true;
                    totalPriceArr.push(product.price);
                }
            } else {
                if (product && product.checked) {
                    counterCheck--;
                    product.checked = false;
                    totalPriceArr = totalPriceArr.filter(price => price !== product.price);
                }
            }
        });
    
        deleteOrder.addEventListener('click', () => {
            let checkedProducts = cart.filter(item => item.checked);
            cart = cart.filter(item => !item.checked);
            putProductToCart();
        });
    
        countProductNumber.textContent = counterCheck;
        totalPriceSum = totalPriceArr.reduce((acc, el) => acc + el, 0);
        totalPrice.textContent = `${totalPriceSum}$`;
    });

};

let showProducts = () => {
    fetch (`https://fakestoreapi.com/products${flagBtn === 'all' ? '': '/category/'+flagBtn}`)
    .then ((res) => res.json())
    .then((json) =>{
        products.innerHTML = '';
        
        json.sort((a,b)=>{
            if(sort === 'default') {
                return json;
            }
            if (sort === 'asc') {
                return a.price - b.price;
            }

            else {
                return b.price - a.price;
            }

        }).forEach((el) => {
            products.innerHTML += `
            <div class = "card">
            <a href ="oneCard.html#${el.id}">
            <img src ="${el.image}" class ="card__img" alt = "image">
            </a>
            <h2 class ="card__title">${el.title}</h2>
            <div class = "card__price">
            <h3 class = "card__category">${el.category}</h3>
            <h2 class="card__price-price">${el.price}$</h2>
            <button data-id = "${el.id}" class ="card__buy-btn">Buy</button>
            </div>
            </div> `;
        });

        let addToCart = document.querySelectorAll('.card__buy-btn');

        addToCart.forEach((el) => {
            let find = json.find(item => item.id === +el.dataset.id);        
            let sameID = cart.find(item => item.id === find.id);           
            el.addEventListener('click', () => {

            if (sameID) {
                sameID.productCounter = (sameID.productCounter || 1) + 1;
            } else {
                find.productCounter = 1;
                cart.push(find);
            }
            
            putProductToCart();
            showProducts();
            });
            
        });
    });
}

category.forEach((el)=>{
    el.addEventListener('click', ()=>{
    flagBtn = el.textContent;
    console.log(flagBtn);    
    showProducts();
    });
});
sortPrice.addEventListener('change',(event)=>{
    sort = event.target.value
    console.log(sort)
    showProducts();
});

cartBtn.addEventListener('click',()=>{
    cartBox.classList.toggle('active');
})

showProducts();
putProductToCart();


let left = document.querySelector('.left__img');
let right = document.querySelector('.right__img');
let paralaxContainer = document.querySelector('.paralax__container');
let titleImg = document.querySelector('.title__img');


window.addEventListener('scroll',(e)=>{
    let scroll = window.scrollY;
    let darkness = Math.min(scroll / 500, 1);
    let darknessblack = 10;
     darknessblack = darknessblack - Math.max(scroll /100, 1);
     if(darknessblack < 0) darknessblack =0;
    let colorBack =  "#777777" + Math.round(darknessblack *10) + "1";
    let color = "#777777" + Math.round(darkness * 10) + "1";
    console.log(scroll);
    

    if(scroll < 550){

//console.log(scroll);
    left.style.left = -scroll + 685   +'px';
    left.style.top = scroll + 100  +'px'
    left.style.width = (scroll/40) + 20 + 'em';
    right.style.right = -scroll + 685  + 'px';
    right.style.top = scroll + 100  +'px';
    right.style.width = (scroll/40) + 20 + 'em';

    titleImg.style.opacity = (scroll/5)/100;
    titleImg.style.top = scroll + 180  +'px';
    paralaxContainer.style.backgroundColor = color;
    }

    let  cartMove = document.querySelector(".cart__move");
    if (scroll >= 550) {
        cartMove.classList.add("animate");
      } else {
        cartMove.classList.remove("animate");
      }

    if(scroll >=650){
        paralaxContainer.style.backgroundColor = colorBack;
        right.style.opacity = `0.${darknessblack}`;
        left.style.opacity = `0.${darknessblack}`;
    }
    else {
        right.style.opacity = '1';
        left.style.opacity =  '1';
    }


    

});