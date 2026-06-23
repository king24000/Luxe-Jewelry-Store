"""FastAPI application entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routers import admin, auth, brands, cart, categories, orders, products, wishlist

# Create tables on startup (idempotent)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Jewelry & Beauty E-Commerce API",
    description="Backend for the React storefront + Vue admin (jewelry, makeup, multi-brand).",
    version="1.0.0",
)

# CORS — allow both frontends during local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # React storefront
        "http://localhost:5174",   # Vue admin
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health():
    return {"status": "ok", "service": "jewelry-ecommerce-api", "docs": "/docs"}


# Register routers
app.include_router(auth.router)
app.include_router(categories.router)
app.include_router(brands.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(wishlist.router)
app.include_router(admin.router)
