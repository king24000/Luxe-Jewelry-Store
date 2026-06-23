"""Seed the database with demo categories, brands, products, and users.

Run:  python seed.py
Idempotent — safe to run repeatedly; existing rows are kept.
"""
from database import Base, SessionLocal, engine
from auth import hash_password
from models import (
    Brand, CartItem, Category, Order, OrderItem, Product, User, WishlistItem,
)

# Create all tables first
Base.metadata.create_all(bind=engine)


def _slug(name: str) -> str:
    return name.strip().lower().replace(" ", "-")


def seed():
    db = SessionLocal()
    try:
        # --- Users ---
        if not db.query(User).filter(User.email == "admin@store.com").first():
            db.add(User(
                name="Store Admin", email="admin@store.com",
                password_hash=hash_password("admin123"), role="admin",
            ))
            print("  + admin user: admin@store.com / admin123")
        else:
            print("  = admin user already exists")

        if not db.query(User).filter(User.email == "demo@user.com").first():
            db.add(User(
                name="Demo Customer", email="demo@user.com",
                password_hash=hash_password("demo123"), role="customer",
            ))
            print("  + demo user: demo@user.com / demo123")
        else:
            print("  = demo user already exists")
        db.commit()

        # --- Categories ---
        categories_data = [
            ("Jewelry", "Necklaces, rings, earrings and bracelets.", "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600"),
            ("Makeup", "Lipsticks, foundations, palettes and more.", "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600"),
            ("Perfume", "Signature fragrances for every occasion.", "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600"),
            ("Accessories", "Bags, sunglasses and finishing touches.", "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600"),
        ]
        cat_map = {}
        for name, desc, img in categories_data:
            cat = db.query(Category).filter(Category.slug == _slug(name)).first()
            if not cat:
                cat = Category(name=name, slug=_slug(name), description=desc, image_url=img)
                db.add(cat)
                db.commit()
                db.refresh(cat)
                print(f"  + category: {name}")
            cat_map[name] = cat

        # --- Brands ---
        brands_data = [
            ("Toops", "Trend-forward beauty and accessories.", "https://images.unsplash.com/photo-1620916566398-39f1143ab4be?w=600"),
            ("Aurelle", "Luxury fine jewelry crafted in gold.", "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600"),
            ("Lumiere", "Radiant makeup for every skin tone.", "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600"),
            ("Velvet Co.", "Bold, romantic fragrances.", "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600"),
            ("Maison Noir", "Modern minimalist accessories.", "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600"),
        ]
        brand_map = {}
        for name, desc, img in brands_data:
            brand = db.query(Brand).filter(Brand.slug == _slug(name)).first()
            if not brand:
                brand = Brand(name=name, slug=_slug(name), description=desc, image_url=img)
                db.add(brand)
                db.commit()
                db.refresh(brand)
                print(f"  + brand: {name}")
            brand_map[name] = brand

        # --- Products ---
        products_data = [
            # name, price, stock, category, brand, image, featured, desc
            ("Gold Pendant Necklace", 89.99, 25, "Jewelry", "Aurelle",
             "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600", 1,
             "18k gold-plated pendant on a delicate 45cm chain."),
            ("Diamond Stud Earrings", 129.00, 18, "Jewelry", "Aurelle",
             "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600", 1,
             "Brilliant-cut cubic zirconia studs in sterling silver."),
            ("Silver Stackable Rings (Set of 3)", 45.50, 40, "Jewelry", "Maison Noir",
             "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600", 0,
             "Minimalist stacking rings in brushed silver."),
            ("Pearl Drop Bracelet", 59.00, 22, "Jewelry", "Aurelle",
             "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600", 0,
             "Freshwater pearls on a gold-fill chain."),

            ("Matte Liquid Lipstick Set", 32.00, 60, "Makeup", "Lumiere",
             "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600", 1,
             "Six long-wear matte shades in one gift set."),
            ("Silk Foundation SPF 20", 38.50, 35, "Makeup", "Lumiere",
             "https://images.unsplash.com/photo-1631214540242-3cd8c4b0b3b6?w=600", 0,
             "Buildable medium coverage with sun protection."),
            ("Nude Eyeshadow Palette", 49.00, 28, "Makeup", "Toops",
             "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600", 1,
             "12 warm nude shades, buttery soft and blendable."),
            ("Setting Mist", 22.00, 50, "Makeup", "Toops",
             "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600", 0,
             "Weightless mist that locks makeup in for 12 hours."),

            ("Rose Oud Eau de Parfum", 95.00, 20, "Perfume", "Velvet Co.",
             "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600", 1,
             "Warm rose and oud with amber undertones. 50ml."),
            ("Citrus Bloom EDT", 58.00, 30, "Perfume", "Velvet Co.",
             "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600", 0,
             "Fresh bergamot and neroli for daytime wear. 75ml."),
            ("Vanilla Musk Rollerball", 24.00, 45, "Perfume", "Toops",
             "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600", 0,
             "Pocket-sized vanilla musk for touch-ups. 10ml."),

            ("Leather Crossbody Bag", 110.00, 15, "Accessories", "Maison Noir",
             "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600", 1,
             "Compact vegan-leather crossbody with adjustable strap."),
            ("Cat-Eye Sunglasses", 36.00, 33, "Accessories", "Toops",
             "https://images.unsplash.com/photo-1577803645773-f96470509666?w=600", 0,
             "UV400 cat-eye frames in tortoiseshell."),
            ("Gold Hoop Earrings (set)", 28.00, 50, "Accessories", "Maison Noir",
             "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600", 0,
             "Three sizes of classic gold hoops."),
        ]

        added = 0
        for name, price, stock, cat_name, brand_name, img, featured, desc in products_data:
            slug = _slug(name)
            if db.query(Product).filter(Product.slug == slug).first():
                continue
            db.add(Product(
                name=name, slug=slug, description=desc, price=price, stock=stock,
                category_id=cat_map[cat_name].id, brand_id=brand_map[brand_name].id,
                image_url=img, featured=featured,
            ))
            added += 1
        db.commit()
        print(f"  + products: {added} added")

        print("\nSeed complete. Admin login: admin@store.com / admin123")
    finally:
        db.close()


if __name__ == "__main__":
    print("Seeding database...")
    seed()
