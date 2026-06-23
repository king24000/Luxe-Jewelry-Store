"""Orders router — create from cart, list own/admin, status update (admin)."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from auth import get_current_user, require_admin
from database import get_db
from models import CartItem, Order, OrderItem, Product, User
from schemas import OrderCreate, OrderOut, OrderStatusUpdate, OrderItemOut

router = APIRouter(prefix="/api/orders", tags=["orders"])

ALLOWED_STATUSES = {"pending", "shipped", "delivered", "cancelled"}


@router.post("", response_model=OrderOut, status_code=201)
def create_order(payload: OrderCreate, current_user: User = Depends(get_current_user),
                 db: Session = Depends(get_db)):
    """Checkout: convert the user's cart into an order (mock payment)."""
    cart_items = (
        db.query(CartItem)
        .options(joinedload(CartItem.product))
        .filter(CartItem.user_id == current_user.id)
        .all()
    )
    if not cart_items:
        raise HTTPException(status_code=400, detail="Your cart is empty")

    total = 0.0
    order_items = []
    for ci in cart_items:
        product = ci.product
        if not product:
            continue
        if product.stock < ci.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {product.name} (only {product.stock} left)",
            )
        total += product.price * ci.quantity
        order_items.append(OrderItem(
            product_id=product.id,
            product_name=product.name,
            quantity=ci.quantity,
            price=product.price,
        ))
        product.stock -= ci.quantity

    order = Order(
        user_id=current_user.id,
        total=round(total, 2),
        status="pending",
        shipping_address=payload.shipping_address,
    )
    db.add(order)
    db.flush()  # get order.id
    for oi in order_items:
        oi.order_id = order.id
        db.add(oi)

    # clear the cart
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    db.commit()
    db.refresh(order)
    return order


@router.get("", response_model=list[OrderOut])
def list_orders(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    query = db.query(Order).options(joinedload(Order.items))
    if current_user.role != "admin":
        query = query.filter(Order.user_id == current_user.id)
    return query.order_by(Order.created_at.desc()).all()


@router.get("/{order_id}", response_model=OrderOut)
def get_order(order_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    order = (
        db.query(Order)
        .options(joinedload(Order.items))
        .filter(Order.id == order_id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if current_user.role != "admin" and order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")
    return order


@router.put("/{order_id}/status", response_model=OrderOut)
def update_order_status(order_id: int, payload: OrderStatusUpdate,
                        db: Session = Depends(get_db), _: User = Depends(require_admin)):
    if payload.status not in ALLOWED_STATUSES:
        raise HTTPException(status_code=400, detail=f"Status must be one of {ALLOWED_STATUSES}")
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = payload.status
    db.commit()
    db.refresh(order)
    return order


@router.get("/admin/all", response_model=list[OrderOut])
def admin_list_orders(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(Order).options(joinedload(Order.items)).order_by(Order.created_at.desc()).all()
