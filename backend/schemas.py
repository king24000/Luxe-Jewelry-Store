"""Pydantic v2 request/response schemas."""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, ConfigDict


# ---------- Auth ----------
class UserCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=6, max_length=100)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    email: EmailStr
    role: str
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ---------- Category ----------
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = ""
    image_url: Optional[str] = ""


class CategoryCreate(CategoryBase):
    pass


class CategoryOut(CategoryBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    slug: str


# ---------- Brand ----------
class BrandBase(BaseModel):
    name: str
    description: Optional[str] = ""
    image_url: Optional[str] = ""


class BrandCreate(BrandBase):
    pass


class BrandOut(BrandBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    slug: str


# ---------- Product ----------
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = ""
    price: float = Field(gt=0)
    stock: int = Field(ge=0, default=0)
    category_id: int
    brand_id: int
    image_url: Optional[str] = ""
    featured: Optional[int] = 0


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(default=None, gt=0)
    stock: Optional[int] = Field(default=None, ge=0)
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    image_url: Optional[str] = None
    featured: Optional[int] = None


class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    slug: str
    description: str
    price: float
    stock: int
    category_id: int
    brand_id: int
    image_url: str
    featured: int
    created_at: datetime
    category: Optional[CategoryOut] = None
    brand: Optional[BrandOut] = None


# ---------- Cart ----------
class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(default=1, ge=1)


class CartItemUpdate(BaseModel):
    quantity: int = Field(ge=1)


class CartItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    product_id: int
    quantity: int
    product: Optional[ProductOut] = None


# ---------- Wishlist ----------
class WishlistItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    product_id: int
    product: Optional[ProductOut] = None


# ---------- Address ----------
class AddressBase(BaseModel):
    full_name: str
    phone: str
    line1: str
    city: str
    postal_code: Optional[str] = ""


class AddressCreate(AddressBase):
    pass


class AddressOut(AddressBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int


# ---------- Order ----------
class OrderItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    product_id: int
    product_name: str
    quantity: int
    price: float


class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    total: float
    status: str
    shipping_address: str
    created_at: datetime
    items: List[OrderItemOut] = []


class OrderCreate(BaseModel):
    shipping_address: str = Field(min_length=10)


class OrderStatusUpdate(BaseModel):
    status: str  # validated in router against allowed set


# ---------- Admin stats ----------
class AdminStats(BaseModel):
    products: int
    orders: int
    users: int
    revenue: float
    pending_orders: int
