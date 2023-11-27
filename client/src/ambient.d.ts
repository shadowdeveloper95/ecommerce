// https://www.reddit.com/r/sveltejs/comments/11fr6oe/where_do_you_put_your_shared_custom_types_for/

type Products = Product[];

type Product = {
	price: number;
	picture_url: string;
	name: string;
	description: string;
	id: number;
	product_type: string;
	product_brand: string;
};

type Page<T> = {
	page_number: number;
	page_size: number;
	total_items: number;
	data: T[];
};

type ShopParams = {
	page_number: number;
	page_size: number;
	sort: string;
	search: string | undefined;
	brand_id: number;
	type_id: number;
};

type ProductBrand = {
	id: number;
	name: string;
};

type ProductType = {
	id: number;
	name: string;
};

type Basket = {
	id: string;
	items: BasketItem[];
};

type BasketItem = {
	id: number;
	product_name: string;
	price: number;
	quantity: number;
	picture_url: string;
	brand: string;
	type: string;
};

type BasketTotals = {
	shipping: number;
	subtotal: number;
	total: number;
};

type Login = {
	email: string;
	password: string;
};

type LoginSuccess = {
	display_name: string;
	email: string;
	token: string;
};

type TextFieldValidation = {
	dirty: boolean;
	valid: boolean;
	value: string;
	validationMessage: string | null | undefined;
	successMessage: string | null | undefined;
	validation: Validation[]
};

type Validation = {
	validator: Validator;
	errorMessage: string | null | undefined;
};

type Validator = (inputField: TextFieldValidation) => boolean;
