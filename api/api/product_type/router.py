from typing import Annotated
from fastapi import APIRouter, Depends

from api.product_type.repository import ProductTypeRepository


product_type_router = APIRouter(prefix="/products/types", tags=["Product Types"])


@product_type_router.get("/")
def get_products_types(
    repo: Annotated[ProductTypeRepository, Depends(ProductTypeRepository)]
):
    return repo.get_all()