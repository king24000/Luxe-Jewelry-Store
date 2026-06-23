"""Products router — public list/detail with filtering, admin CRUD."""
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from auth import require_admin
from database import get_db
from models import Brand, Category, Product
from schemas import ProductCreate, ProductOut, ProductUpdate

router = APIRouter(prefix="/api/products", tags=["products"])


def _apply_filters(query, category, brand, search, min_price, max_price):
    if category:
        # category can be slug or id
        if category.isdigit():
            query = query.filter(Product.category_id == int(category))
        else:
            query = query.join(Category).filter(Category.slug == category)
    if brand:
        if brand.isdigit():
            query = query.filter(Product.brand_id == int(brand))
        else:
            query = query.join(Brand).filter(Brand.slug == brand)
    if search:
        pattern = f"%{search}%"
        query = query.filter(or_(Product.name.ilike(pattern), Product.description.ilike(pattern)))
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    return query


@router.get("", response_model=list[ProductOut])
def list_products(
    category: Optional[str] = None,
    brand: Optional[str] = None,
    search: Optional[str] = None,
    min_price: Optional[float] = Query(default=None, ge=0),
    max_price: Optional[float] = Query(default=None, ge=0),
    featured: Optional[int] = None,
    sort: Optional[str] = Query(default="new", pattern="^(new|price_asc|price_desc|name)$"),
    limit: int = Query(default=100, ge=1, le=200),
    db: Session = Depends(get_db),
):
    query = db.query(Product).options(joinedload(Product.category), joinedload(Product.brand))
    query = _apply_filters(query, category, brand, search, min_price, max_price)
    if featured is not None:
        query = query.filter(Product.featured == featured)

    if sort == "price_asc":
        query = query.order_by(Product.price.asc())
    elif sort == "price_desc":
        query = query.order_by(Product.price.desc())
    elif sort == "name":
        query = query.order_by(Product.name.asc())
    else:
        query = query.order_by(Product.created_at.desc())

    return query.limit(limit).all()


@router.get("/{slug}", response_model=ProductOut)
def get_product(slug: str, db: Session = Depends(get_db)):
    query = db.query(Product).options(joinedload(Product.category), joinedload(Product.brand))
    product = query.filter((Product.slug == slug) | (Product.id == slug if slug.isdigit() else False)).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("", response_model=ProductOut, status_code=201)
def create_product(payload: ProductCreate, db: Session = Depends(get_db),
                   _: object = Depends(require_admin)):
    if not db.get(Category, payload.category_id):
        raise HTTPException(status_code=400, detail="Invalid category_id")
    if not db.get(Brand, payload.brand_id):
        raise HTTPException(status_code=400, detail="Invalid brand_id")
    slug = payload.name.strip().lower().replace(" ", "-")
    if db.query(Product).filter(Product.slug == slug).first():
        raise HTTPException(status_code=400, detail="Product slug already exists")
    product = Product(
        name=payload.name, slug=slug, description=payload.description or "",
        price=payload.price, stock=payload.stock, category_id=payload.category_id,
        brand_id=payload.brand_id, image_url=payload.image_url or "",
        featured=payload.featured or 0,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/{product_id}", response_model=ProductOut)
def update_product(product_id: int, payload: ProductUpdate, db: Session = Depends(get_db),
                   _: object = Depends(require_admin)):
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    data = payload.model_dump(exclude_unset=True)
    if "category_id" in data and not db.get(Category, data["category_id"]):
        raise HTTPException(status_code=400, detail="Invalid category_id")
    if "brand_id" in data and not db.get(Brand, data["brand_id"]):
        raise HTTPException(status_code=400, detail="Invalid brand_id")
    if "name" in data:
        data["slug"] = data["name"].strip().lower().replace(" ", "-")
    for key, value in data.items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=204)
def delete_product(product_id: int, db: Session = Depends(get_db),
                   _: object = Depends(require_admin)):
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
