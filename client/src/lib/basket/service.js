import { apiClientBackground, apiClientWithSpinner } from '$lib/share/request';
import { get, readonly, writable } from 'svelte/store';

/**
 * @type {import("svelte/store").Writable<Basket | null>}
 */
const _basket = writable(null);
/**
 * @type {import("svelte/store").Writable<BasketTotals | null>}
 */
const _basketTotals = writable(null);
const BASKET_KEY_NAME = 'basket_id';

const basketTotals = readonly(_basketTotals);
const basket = readonly(_basket);

/**
 * @param {string} id
 */
async function getBasket(id) {
	/**
	 * @type {Basket}
	 */
	const newBasket = (await apiClientBackground.get(`basket?id=${id}`)).data;
	_basket.update(() => newBasket);
	calculateTotals();
}

/**
 * @param {Basket} basket
 */
async function setBasket(basket) {
	const response = await apiClientWithSpinner.post(`basket/`, basket);
	/**
	 * @type {Basket}
	 */
	const newBasket = response.data;
	_basket.update(() => newBasket);
	calculateTotals();
}

/**
 * @param {Basket} basket
 */
async function deleteBasket(basket) {
	const response = await apiClientWithSpinner.delete(`basket?id=${basket.id}`);

	if (response.status === 200) {
		_basket.update(() => null);
		_basketTotals.update(() => null);
		return;
	}
}

/**
 * @param {BasketItem[]} items
 * @param {BasketItem} itemToAdd
 * @param {number} quantity
 */
function addOrUpdateItem(items, itemToAdd, quantity) {
	const item = items.find((i) => i.id === itemToAdd.id);
	if (item) item.quantity += quantity;
	else {
		itemToAdd.quantity = quantity;
		items.push(itemToAdd);
	}
	return items;
}

function createBasket() {
	/**
	 * @type {Basket}
	 */
	// TODO: set key here
	const basket = {
		id: 'basket1',
		items: []
	};
	localStorage.setItem(BASKET_KEY_NAME, basket.id);
	return basket;
}

/**
 * @param {Product} item
 * @returns {BasketItem}
 */
function mapProductItemToBasketItem(item) {
	return {
		id: item.id,
		product_name: item.name,
		price: item.price,
		quantity: 0,
		picture_url: item.picture_url,
		brand: item.product_brand,
		type: item.product_type
	};
}

/**
 * @param {BasketItem | Product} item
 * @returns {item is Product}
 */
function isProduct(item) {
	return Object.hasOwn(item, 'product_brand');
}

function calculateTotals() {
	const basket = get(_basket);
	if (!basket) return;
	const shipping = 0;
	const subtotal = basket.items.reduce((total, item) => total + item.price * item.quantity, 0);
	const total = subtotal + shipping;
	_basketTotals.update(() => ({ shipping, subtotal, total }));
}

async function loadBasketBackground() {
	const basketId = localStorage.getItem(BASKET_KEY_NAME);
	if (basketId) await getBasket(basketId);
}

/**
 * @param {BasketItem | Product} item
 * @param {number} quantity
 */
async function addItemToBasket(item, quantity = 1) {
	if (isProduct(item)) item = mapProductItemToBasketItem(item);

	const basket = get(_basket) ?? createBasket();
	basket.items = addOrUpdateItem(basket.items, item, quantity);
	await setBasket(basket);
}

/**
 * @param {number} id
 */
function removeItemFromBasket(id, quantity = 1) {
	const basket = get(_basket);
	if (!basket) return;
	const item = basket.items.find((i) => i.id === id);
	if (item) {
		item.quantity -= quantity;
		if (item.quantity <= 0) {
			basket.items = basket.items.filter((i) => i.id !== id);
		}
		if (basket.items.length > 0) setBasket(basket);
		else deleteBasket(basket);
	}
}

const BasketService = {
	removeItemFromBasket,
	addItemToBasket,
	loadBasketBackground,
	basketTotals,
	basket
};

export default BasketService;
