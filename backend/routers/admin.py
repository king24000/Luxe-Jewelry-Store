"""Admin stats + user management router (admin only)."""
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from auth import require_admin
from database import get_db
from models import Order, Product, User
from schemas import AdminStats, UserOut

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/stats", response_model=AdminStats)
def admin_stats(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    products = db.query(func.count(Product.id)).scalar() or 0
    orders = db.query(func.count(Order.id)).scalar() or 0
    users = db.query(func.count(User.id)).scalar() or 0
    revenue = db.query(func.coalesce(func.sum(Order.total), 0.0)).filter(
        Order.status != "cancelled"
    ).scalar() or 0.0
    pending = db.query(func.count(Order.id)).filter(Order.status == "pending").scalar() or 0
    return AdminStats(
        products=products, orders=orders, users=users,
        revenue=round(float(revenue), 2), pending_orders=pending,
    )


@router.get("/users", response_model=list[UserOut])
def list_users(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(User).order_by(User.created_at.desc()).all()
