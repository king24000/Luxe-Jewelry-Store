"""Cart router — per-user cart items (auth required)."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import CartItem, Product, User
from schemas import CartItemCreate, CartItemOut, CartItemUpdate
from sqlalchemy.orm import joinedload

router = APIRouter(prefix="/api/cart", tags=["cart"])


@router.get("", response_model=list[CartItemOut])
def list_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return (
        db.query(CartItem)
        .options(joinedload(CartItem.product))
        .filter(CartItem.user_id == current_user.id)
        .all()
    )


@router.post("", response_model=CartItemOut, status_code=201)
def add_to_cart(payload: CartItemCreate, current_user: User = Depends(get_current_user),
                db: Session = Depends(get_db)):
    product = db.get(Product, payload.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.stock < payload.quantity:
        raise HTTPException(status_code=400, detail=f"Only {product.stock} in stock")

    item = (
        db.query(CartItem)
        .filter(CartItem.user_id == current_user.id, CartItem.product_id == payload.product_id)
        .first()
    )
    if item:
        item.quantity += payload.quantity
        if item.quantity > product.stock:
            raise HTTPException(status_code=400, detail=f"Only {product.stock} in stock")
    else:
        item = CartItem(user_id=current_user.id, product_id=payload.product_id,
                        quantity=payload.quantity)
        db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{item_id}", response_model=CartItemOut)
def update_cart_item(item_id: int, payload: CartItemUpdate,
                     current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.get(CartItem, item_id)
    if not item or item.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Cart item not found")
    product = db.get(Product, item.product_id)
    if product and payload.quantity > product.stock:
        raise HTTPException(status_code=400, detail=f"Only {product.stock} in stock")
    item.quantity = payload.quantity
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=204)
def remove_cart_item(item_id: int, current_user: User = Depends(get_current_user),
                     db: Session = Depends(get_db)):
    item = db.get(CartItem, item_id)
    if not item or item.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Cart item not found")
    db.delete(item)
    db.commit()


@router.delete("", status_code=204)
def clear_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    db.commit()
