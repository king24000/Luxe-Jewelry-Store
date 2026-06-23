"""Categories router — public read, admin write."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth import require_admin
from database import get_db
from models import Category, Product
from schemas import CategoryCreate, CategoryOut

router = APIRouter(prefix="/api/categories", tags=["categories"])


@router.get("", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return db.query(Category).order_by(Category.name).all()


@router.post("", response_model=CategoryOut, status_code=201)
def create_category(payload: CategoryCreate, db: Session = Depends(get_db),
                    _: object = Depends(require_admin)):
    slug = payload.name.strip().lower().replace(" ", "-")
    if db.query(Category).filter((Category.slug == slug) | (Category.name == payload.name)).first():
        raise HTTPException(status_code=400, detail="Category already exists")
    cat = Category(name=payload.name, slug=slug, description=payload.description or "",
                   image_url=payload.image_url or "")
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


@router.put("/{category_id}", response_model=CategoryOut)
def update_category(category_id: int, payload: CategoryCreate, db: Session = Depends(get_db),
                    _: object = Depends(require_admin)):
    cat = db.get(Category, category_id)
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    cat.name = payload.name
    cat.slug = payload.name.strip().lower().replace(" ", "-")
    cat.description = payload.description or ""
    cat.image_url = payload.image_url or ""
    db.commit()
    db.refresh(cat)
    return cat


@router.delete("/{category_id}", status_code=204)
def delete_category(category_id: int, db: Session = Depends(get_db),
                    _: object = Depends(require_admin)):
    cat = db.get(Category, category_id)
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    if db.query(Product).filter(Product.category_id == category_id).first():
        raise HTTPException(status_code=400, detail="Cannot delete: products use this category")
    db.delete(cat)
    db.commit()
