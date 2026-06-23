"""Wishlist router — per-user saved products (auth required)."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from auth import get_current_user
from database import get_db
from models import Product, User, WishlistItem
from schemas import WishlistItemOut

router = APIRouter(prefix="/api/wishlist", tags=["wishlist"])


@router.get("", response_model=list[WishlistItemOut])
def list_wishlist(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return (
        db.query(WishlistItem)
        .options(joinedload(WishlistItem.product))
        .filter(WishlistItem.user_id == current_user.id)
        .all()
    )


@router.post("/{product_id}", response_model=WishlistItemOut, status_code=201)
def add_to_wishlist(product_id: int, current_user: User = Depends(get_current_user),
                    db: Session = Depends(get_db)):
    if not db.get(Product, product_id):
        raise HTTPException(status_code=404, detail="Product not found")
    existing = (
        db.query(WishlistItem)
        .filter(WishlistItem.user_id == current_user.id, WishlistItem.product_id == product_id)
        .first()
    )
    if existing:
        return existing
    item = WishlistItem(user_id=current_user.id, product_id=product_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{product_id}", status_code=204)
def remove_from_wishlist(product_id: int, current_user: User = Depends(get_current_user),
                         db: Session = Depends(get_db)):
    item = (
        db.query(WishlistItem)
        .filter(WishlistItem.user_id == current_user.id, WishlistItem.product_id == product_id)
        .first()
    )
    if item:
        db.delete(item)
        db.commit()
