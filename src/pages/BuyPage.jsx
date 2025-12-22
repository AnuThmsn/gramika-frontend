import React, { useState, useEffect } from 'react';
import CategoryButton from '../components/CategoryButton';
import ProductCard from '../components/ProductCard';
import Cart from './cart.jsx';
import { FaCarrot, FaAppleAlt, FaHome } from 'react-icons/fa';
import { GiMeatCleaver, GiMilkCarton, GiManualMeatGrinder } from "react-icons/gi";
import { CiSearch } from "react-icons/ci";

function BuyPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // 🔥 FETCH PRODUCTS FROM BACKEND
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  // ADD TO CART
  const handleAddToCart = (product) => {
    setCartItems([...cartItems, product]);
    console.log(`${product.quantity} × ${product.name} added to cart`);
  };

  // CATEGORY ICONS
  const getCategoryIcon = (category) => {
    switch (category) {
      case "Poultry & Meat":
        return <GiMeatCleaver />;
      case "Vegetables":
        return <FaCarrot />;
      case "Fruits":
        return <FaAppleAlt />;
      case "Dairy & Beverages":
        return <GiMilkCarton />;
      case "Bakery & Snacks":
        return <GiManualMeatGrinder />;
      case "Homemade Essentials":
        return <FaHome />;
      default:
        return null;
    }
  };

  // STYLES
  const categoryButtonStyle = {
    backgroundColor: '#1a3c22ff',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '24px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    fontFamily: '"Lato", sans-serif',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  return (
    <div>
      <div style={{ padding: '32px 0', maxWidth: '1200px', margin: '0 auto' }}>

        {/* SEARCH + SORT */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'flex',
            width: '80%',
            background: '#f7f7f7',
            borderRadius: '32px'
          }}>
            <div style={{ position: 'relative', flexGrow: 1 }}>
              <span style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)'
              }}>
                <CiSearch />
              </span>
              <input
                type="text"
                placeholder="Search Products"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '16px 16px 16px 50px',
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent'
                }}
              />
            </div>

            <div
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              style={{
                padding: '16px 24px',
                cursor: 'pointer',
                borderLeft: '1px solid #ddd'
              }}
            >
              Sort ▼
            </div>
          </div>
        </div>

        {/* SORT OPTIONS */}
        {sortDropdownOpen && (
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <button onClick={() => setSortOption('priceLowHigh')}>Price Low → High</button>
            <button onClick={() => setSortOption('priceHighLow')}>Price High → Low</button>
            <button onClick={() => setSortOption('nameAZ')}>Name A → Z</button>
          </div>
        )}

        {/* CATEGORY FILTER */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '32px' }}>
          {["All", "Poultry & Meat", "Vegetables", "Fruits", "Dairy & Beverages", "Bakery & Snacks", "Homemade Essentials"].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                ...categoryButtonStyle,
                backgroundColor: selectedCategory === category ? '#63c959' : '#1a3c34',
                color: selectedCategory === category ? '#1a3c34' : '#fff'
              }}
            >
              {getCategoryIcon(category)}
              {category}
            </button>
          ))}
        </div>

        {/* PRODUCT GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '32px'
        }}>
          {products
            .filter(item =>
              (selectedCategory === 'All' || item.category === selectedCategory) &&
              item.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => {
              if (sortOption === 'priceLowHigh') return a.price - b.price;
              if (sortOption === 'priceHighLow') return b.price - a.price;
              if (sortOption === 'nameAZ') return a.name.localeCompare(b.name);
              return 0;
            })
            .map((item) => (
              <ProductCard
                key={item._id}
                image={item.image}     // ✅ Base64 image from MongoDB
                name={item.name}
                price={item.price}
                stock={item.quantity}
                onAddToCart={(qty) =>
                  handleAddToCart({ ...item, quantity: qty })
                }
              />
            ))}
        </div>

      </div>
    </div>
  );
}

export default BuyPage;
