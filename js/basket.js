"use strict"
//==========================================
import { ERROR_SERVER, NO_ITEMS_CART } from './constant.js';
import { 
    showErrorMessage,
    setBasketLocalStorage,
    getBasketLocalStorage,
} from './utils.js';

const cart = document.querySelector('.cart');
let productsData = [];

cart.addEventListener('click', delProductBasket);
getProducts();
async function getProducts() {
    try {
        if (!productsData.length) {
            const res = await fetch('./data/items.json');
            if (!res.ok) {
                throw new Error (res.statusText);
            }
            productsData = await res.json();
        }

        loadProductBasket(productsData);
    } catch(err) {  
        console.log(ERROR_SERVER);
    }
};

function loadProductBasket(data) {
    cart.textContent = '';

    if(!data|| !data.length) {
        showErrorMessage(ERROR_SERVER)
        return;
    }
    const basket = getBasketLocalStorage();
    if(!basket|| !basket.length) {
        showErrorMessage(NO_ITEMS_CART);
        return;
    }
    const findProducts = data.filter(item => basket.includes(String(item.id)));
    
    if (!findProducts.length) {
        console.log(NO_ITEMS_CART)
        return;
    }
    renderProductsBasket(findProducts);
}




// Рендер товаров в корзине
function renderProductsBasket(arr) {
    arr.forEach(card => {
        const {id, image, name, price} = card;
        const {current_price} = price;
        const {url} = image;

        const cardItem = 
        `
        <div class="cart__product" data-product-id="${id}">
            <div class="cart__img">
                <img src="./${url}" alt="${name}">
            </div>
            <div class="cart__title">${name}</div>
            <div class="cart__block-btns">

            </div>
            <div class="cart__price-discount">
                <span>${current_price}</span>₽
            </div>
            <div class="cart__del-card">X</div>
        </div>
        `;

        cart.insertAdjacentHTML('beforeend', cardItem);
    });
}



function delProductBasket (event) {
    const targetButton = event.target.closest('.cart__del-card');
    if (!targetButton) return;
    const card = targetButton.closest('.cart__product');
    const id = card.dataset.productId;
    const basket = getBasketLocalStorage();

    const newBasket = basket.filter (item=> item !== id);
    setBasketLocalStorage(newBasket);

    getProducts();
}
