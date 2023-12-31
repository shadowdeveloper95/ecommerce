from datetime import datetime
import enum
from typing import List
from sqlalchemy import BigInteger, Integer, String, DateTime, Numeric, Enum, ForeignKey
from sqlalchemy.orm import mapped_column, Mapped, relationship
from pydantic import BaseModel, Field

from share.model import BaseORM


class CustomerAddress(BaseModel):
    fullName: str
    email: str
    phoneNumber: str
    address: str
    address2: str | None = Field(default=None)
    country: str
    state: str
    zipCode: str


class DeliveryMethodDTO(BaseModel):
    id: int
    shortName: str
    deliveryTime: str
    price: float


class CustomerOrder(BaseModel):
    basketId: str
    billingAddress: CustomerAddress
    shippingAddress: CustomerAddress | None = Field(default=None)
    deliveryMethodId: int
    paymentType: str


class OrderItem(BaseORM):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    product_name: Mapped[str] = mapped_column(String, nullable=False)
    price: Mapped[float] = mapped_column(Numeric(precision=10, scale=2), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    picture_url: Mapped[str] = mapped_column(String, nullable=False)
    brand: Mapped[str] = mapped_column(String, nullable=False)
    type: Mapped[str] = mapped_column(String, nullable=False)

    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"))
    order: Mapped["Order"] = relationship(back_populates="items")


class BillingAddress(BaseORM):
    __tablename__ = "billing_addresses"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    full_name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, nullable=False)
    phone_number: Mapped[str] = mapped_column(String, nullable=False)
    address: Mapped[str] = mapped_column(String, nullable=False)
    address2: Mapped[str | None] = mapped_column(String, nullable=True)
    country: Mapped[str] = mapped_column(String, nullable=False)
    state: Mapped[str] = mapped_column(String, nullable=False)
    zip_code: Mapped[str] = mapped_column(String, nullable=False)


class ShippingAddress(BaseORM):
    __tablename__ = "shipping_addresses"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    full_name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, nullable=False)
    phone_number: Mapped[str] = mapped_column(String, nullable=False)
    address: Mapped[str] = mapped_column(String, nullable=False)
    address2: Mapped[str | None] = mapped_column(String, nullable=True)
    country: Mapped[str] = mapped_column(String, nullable=False)
    state: Mapped[str] = mapped_column(String, nullable=False)
    zip_code: Mapped[str] = mapped_column(String, nullable=False)


class DeliveryMethod(BaseORM):
    __tablename__ = "delivery_methods"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    short_name: Mapped[str] = mapped_column(String, nullable=False)
    delivery_time: Mapped[str] = mapped_column(String, nullable=False)
    price: Mapped[float] = mapped_column(Numeric(precision=10, scale=2), nullable=False)


class OrderStatus(BaseORM):
    __tablename__ = "order_statuses"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    normalized_name: Mapped[str] = mapped_column(String, nullable=False)


class MetaEnum(enum.EnumMeta):
    def __contains__(cls, item):
        try:
            cls(item)
        except ValueError:
            return False
        return True


class PaymentType(enum.Enum, metaclass=MetaEnum):
    CASH = "CASH"
    CREDIT_CARD = "CREDIT_CARD"
    DEBIT_CARD = "DEBIT_CARD"


class Order(BaseORM):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    buyer_email: Mapped[str] = mapped_column(String, nullable=False)
    payment_type: Mapped[str] = mapped_column(Enum(PaymentType), nullable=False)
    delivery_price: Mapped[float] = mapped_column(
        Numeric(precision=10, scale=2), nullable=False
    )
    subtotal: Mapped[float] = mapped_column(
        Numeric(precision=10, scale=2), nullable=False
    )
    created_date: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow(), nullable=False
    )

    items: Mapped[List[OrderItem]] = relationship(back_populates="order")
    billing_address_id: Mapped[int] = mapped_column(ForeignKey("billing_addresses.id"))
    billing_address: Mapped[BillingAddress] = relationship()
    shipping_address_id: Mapped[int] = mapped_column(
        ForeignKey("shipping_addresses.id")
    )
    shipping_address: Mapped[ShippingAddress] = relationship()
    status_id: Mapped[int] = mapped_column(ForeignKey("order_statuses.id"))
    status: Mapped[OrderStatus] = relationship()
    delivery_method_id: Mapped[int] = mapped_column(ForeignKey("delivery_methods.id"))
    delivery_method: Mapped[DeliveryMethod] = relationship()

    def get_total(self):
        return self.subtotal + self.delivery_price
