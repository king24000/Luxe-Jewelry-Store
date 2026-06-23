"""Brands router — public read, admin write."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth import require_admin
from database import get_db
from models import Brand, Product
from schemas import BrandCreate, BrandOut

router = APIRouter(prefix="/api/brands", tags=["brands"])


@router.get("", response_model=list[BrandOut])
def list_brands(db: Session = Depends(get_db)):
    return db.query(Brand).order_by(Brand.name).all()


@router.post("", response_model=BrandOut, status_code=201)
def create_brand(payload: BrandCreate, db: Session = Depends(get_db),
                 _: object = Depends(require_admin)):
    slug = payload.name.strip().lower().replace(" ", "-")
    if db.query(Brand).filter((Brand.slug == slug) | (Brand.name == payload.name)).first():
        raise HTTPException(status_code=400, detail="Brand already exists")
    brand = Brand(name=payload.name, slug=slug, description=payload.description or "",
                  image_url=payload.image_url or "")
    db.add(brand)
    db.commit()
    db.refresh(brand)
    return brand


@router.put("/{brand_id}", response_model=BrandOut)
def update_brand(brand_id: int, payload: BrandCreate, db: Session = Depends(get_db),
                 _: object = Depends(require_admin)):
    brand = db.get(Brand, brand_id)
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    brand.name = payload.name
    brand.slug = payload.name.strip().lower().replace(" ", "-")
    brand.description = payload.description or ""
    brand.image_url = payload.image_url or ""
    db.commit()
    db.refresh(brand)
    return brand


@router.delete("/{brand_id}", status_code=204)
def delete_brand(brand_id: int, db: Session = Depends(get_db),
                 _: object = Depends(require_admin)):
    brand = db.get(Brand, brand_id)
    if not brand:
        raise HTTPException(status_code=404, detail="Brand brand not found")
    if db.query(Product).filter(Product.brand_id == brand_id).first():
        raise HTTPException(status_code=400, detail="Cannot delete: products use this brand")
    db.delete(brand)
    db.commit()
