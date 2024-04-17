import { COUNT_SHOW_CARDS_CLICK, ERROR_SERVER} from "./constant.js";
import { 
    setBasketLocalStorage,
    getBasketLocalStorage,
} from './utils.js';


let productsData = [];
const cards = document.querySelector('.cards');


getProducts();
async function getProducts() {
    try {
        if (!productsData.length) {
            const res = await fetch('../data/items.json');
            if (!res.ok) {
                throw new Error (res.statusText);
            }
            productsData = await res.json();
        }
        renderStartPage(productsData);
    } catch(err) {  
        console.log(ERROR_SERVER);
    }
};


function renderStartPage (data) {
    if (!data || !data.length) {
        return;
    };

    const arrCards = data.slice(0, COUNT_SHOW_CARDS_CLICK);
    createCards (arrCards);

    const basket = getBasketLocalStorage();
    checkingActiveButtons(basket);
}


// Рендер карточки
function createCards(data) {
    cards.innerHTML = '';
    data.forEach(card => {
        // const { id, url, name, old_price, current_price} = card;
        const {id, image, name, price} = card;
        const {old_price, current_price} = price;
        const {url} = image;

		const cardItem = 
			`
                <div class="card" data-product-id="${id}">
                    <div class="card__top">
                        <div id=${id}" class="card__image">
                            <img
                                src="./${url}"
                                alt="${name}"
                            />
                        </div>
                        <div class="card__label">${'Скидка'}</div>
                    </div>
                    <div class="card__bottom">
                        <div class="card__prices">
                            <div class="card__price card__price--discount">${current_price}</div>
                            <div class="card__price card__price--common">${old_price}</div>
                        </div>
                        <div id=${id}" class="card__title">${name}</div>
                        <button class="card__add">В корзину</button>
                    </div>
                </div>
            `
        cards.insertAdjacentHTML('beforeend', cardItem);
     
        const disabledDiv = document.querySelectorAll('.card__price--common');
        disabledDiv.forEach((element)=> {
           if (element.textContent == 'null') {
           element.style = "display: none;";
           console.log(element)
        }});
	});

};


//фильтр по цене с условиями

function sortByPrice (data) {
    console.log(priceSort.value);

    const copyData = JSON.parse(JSON.stringify(data));

    if (priceSort.value == 'lowPrice') {
        copyData.sort((a, b) => a.price.current_price > b.price.current_price ? -1: 1);
    } else {
        copyData.sort((a, b) => a.price.current_price > b.price.current_price ? 1: -1);
    }
    cards.innerHTML = '';
    createCards(copyData);
    }


const priceSort = document.querySelector('.price__sort');
priceSort.addEventListener('change', (event) => {
    event.preventDefault();
    sortByPrice(productsData);
});


//фильтр по материалу
function sortByMaterial (data) {
    const copyData1 = JSON.parse(JSON.stringify(data));
    let  newArr = [];

        console.log(materialSort.value);
    if(materialSort.value == 'wood'){
        newArr = copyData1.filter((arr) => arr.material == '1')
    } else {
        newArr = copyData1.filter((arr) => arr.material == '2')
    }
    cards.innerHTML = '';
    createCards(newArr);
};


const materialSort = document.querySelector('.material__sort');
materialSort.addEventListener('change', (event) => {
    event.preventDefault();
    sortByMaterial(productsData);
});



// добавление товаров в корзину
function handleCardClick(event) {
    const targetButton = event.target.closest('.card__add');
    if (!targetButton) return;

    const card = targetButton.closest('.card');
    const id = card.dataset.productId;
    const basket = getBasketLocalStorage();

    if(basket.includes(id)) return;

    basket.push(id);
    setBasketLocalStorage(basket); 
    checkingActiveButtons(basket); 
}

cards.addEventListener('click', handleCardClick);


function checkingActiveButtons(basket) {
    const buttons = document.querySelectorAll('.card__add');
    buttons.forEach(btn => {
        const card = btn.closest('.card');
        const id = card.dataset.productId;
        const isInBasket = basket.includes(id);

        btn.disabled = isInBasket;
        btn.classList.toggle('active', isInBasket);
        btn.textContent = isInBasket? 'В корзине': 'В корзину';
    })
};
