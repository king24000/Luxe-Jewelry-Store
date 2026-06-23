import { Link } from 'react-router-dom'
import '../styles/footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand brand-footer">Luxe<span>&amp;</span>Co</div>
          <p>Curated jewelry, beauty &amp; accessories from world-class brands. Crafted to make every day feel a little more luxe.</p>
        </div>
        <div>
          <h4>Shop</h4>
          <ul>
            <li><Link to="/shop?category=jewelry">Jewelry</Link></li>
            <li><Link to="/shop?category=makeup">Makeup</Link></li>
            <li><Link to="/shop?category=perfume">Perfume</Link></li>
            <li><Link to="/shop?category=accessories">Accessories</Link></li>
          </ul>
        </div>
        <div>
          <h4>Help</h4>
          <ul>
            <li><a href="#">Shipping &amp; Returns</a></li>
            <li><a href="#">Track Order</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4>Company</h4>
          <ul>
            <li><a href="#">About</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Terms</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          © {new Date().getFullYear()} Luxe &amp; Co. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
