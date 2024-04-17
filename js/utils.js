"use strict"

// Вывод ошибки
export function showErrorMessage(message) {
    const h1 = document.querySelector('.wrapper h1')
    const msg = 
        `<div class="error">
            <p>${message}</p>
            <p><a href="/">Перейти к списку товаров!</a></p>
        </div>`;
    h1.insertAdjacentHTML('afterend', msg);
}

// Получение id из LS
export function getBasketLocalStorage() {
    const cartDataJSON = localStorage.getItem('basket');
    return cartDataJSON ? JSON.parse(cartDataJSON) : [];
}

// Запись id товаров в LS
export function setBasketLocalStorage(basket) {
    const basketCount = document.querySelector('.basket__count');
    localStorage.setItem('basket', JSON.stringify(basket));
    basketCount.textContent = basket.length;
}
