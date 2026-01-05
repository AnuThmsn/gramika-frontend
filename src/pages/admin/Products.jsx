import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Table,
  Button,
  Badge,
  Form,
  InputGroup
} from "react-bootstrap";
import { BsSearch, BsTrash } from "react-icons/bs";

const Products = () => {
  const [searchParams] = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const [searchTerm, setSearchTerm] = useState(initialQ);

  const lightGreen = "#e8f5e8";
  const darkGreen = "#1a622bff";

  // -------------------- STATE --------------------
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // -------------------- FETCH DATA --------------------
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();

      const mapped = data.map(p => ({
        _id: p._id,
        name: p.name,
        category: p.category || "Uncategorized",
        seller: p.seller || "Local Seller",
        price: p.price,
        stock: p.quantity,
        status: p.quantity > 0 ? "Live" : "Out of Stock"
      }));

      setProducts(mapped);
    } catch (err) {
      console.error("Fetch products failed:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/categories");
      const data = await res.json();
      setCategories(data); // array of category names
    } catch (err) {
      console.error("Fetch categories failed:", err);
    }
  };

  // -------------------- ACTIONS --------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;

    try {
      await fetch(`http://localhost:5000/api/products/${id}`, { method: "DELETE" });
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // -------------------- FILTER LOGIC --------------------
  const filteredProducts = products.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.seller.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const liveItemsCount = products.filter(p => p.stock > 0).length;

  // -------------------- UI --------------------
  return (
    <div style={{ padding: "24px", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <h2 className="mb-4">Product Management</h2>

      {/* STATS */}
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="shadow-sm border-0" style={{ borderLeft: `4px solid ${darkGreen}` }}>
            <Card.Body>
              <h6>Total Products</h6>
              <h3>{products.length}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="shadow-sm border-0" style={{ borderLeft: "4px solid #198754" }}>
            <Card.Body>
              <h6>Live Items</h6>
              <h3>{liveItemsCount}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* FILTERS */}
      <Card className="mb-4 shadow-sm border-0">
        <Card.Body>
          <Row className="g-3 align-items-center">
            <Col md={5}>
              <InputGroup>
                <InputGroup.Text><BsSearch /></InputGroup.Text>
                <Form.Control
                  placeholder="Search products or sellers..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>

            <Col md={4}>
              <Form.Select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* TABLE */}
      <Card className="shadow-sm border-0">
        <Table hover responsive className="mb-0">
          <thead style={{ backgroundColor: lightGreen }}>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Seller</th>
              <th>Price / Stock</th>
              <th>Status</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map(item => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.seller}</td>
                  <td>₹{item.price} / {item.stock}</td>
                  <td>
                    <Badge bg={item.stock > 0 ? "success" : "secondary"}>
                      {item.stock > 0 ? "Live" : "Out of Stock"}
                    </Badge>
                  </td>
                  <td className="text-end">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(item._id)}
                    >
                      <BsTrash />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};

export default Products;
