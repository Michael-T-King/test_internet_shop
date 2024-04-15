let products = document.querySelector('.products');
let category = document.querySelectorAll('.nav__items');
let sortPrice = document.querySelector('select');

let flagBtn = 'all';
let sort = 'default';
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
            <button class ="card__buy-btn">Buy</button>
            </div>
            </div> `;
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
    showProducts()
});
showProducts();

