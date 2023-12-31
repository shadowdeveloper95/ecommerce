import { AccountService, currentUser } from "./_account";
import { BasketService, basket, basketTotals } from "./_basket";
import { OrderService } from "./_order";
import { ProductService } from "./_product";

async function init() {
    await Promise.all([AccountService.loadUser(), BasketService.loadBasket()]);
}

export {
    init,
    AccountService,
    currentUser,
    BasketService,
    basket,
    basketTotals,
    OrderService,
    ProductService
}