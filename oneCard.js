let id = window.location.hash.slice(1);

let product = document.querySelector('.box');

fetch(`https://fakestoreapi.com/products/${id}`)
    .then((res) => res.json())
    .then((json) => {
        product.innerHTML = `
        <div class = "card">
      
        <img src ="${json.image}" class ="card__img" alt = "image">
      <div class = "description__box">
        <h2 class ="card__title">${json.title}</h2>
        <h3 class = "card__category">${json.category}</h3>
        <p class = "description">${json.description}</p>
            <h2 class="card__price-price">${json.price}$</h2>
            <button class ="card__buy-btn">Buy</button>
        </div>
        `;
    });
