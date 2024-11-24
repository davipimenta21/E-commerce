import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/api";

const Home = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (id) => {
    navigate(`/products/${id}`);
  };

  return (
    <div>
      <div className="text-white text-center pb-5" style={{ height: "45vh", overflow: "hidden" }}>
        <img
          src="https://imgnike-a.akamaihd.net/branding/home-sbf/touts/Banner-Black-Friday-18-11-24-desk.jpg"
          alt="Black Friday Banner"
        />
      </div>
      <div className="container my-4">
        <h2 className="text-center mb-4">Confira nossos produtos</h2>
        <div className="row">
          {products.map((product) => (
            <div
              key={product.id}
              className="col-md-3 mb-4"
              onClick={() => handleProductClick(product.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="card h-100">
                <img
                  src={`http://localhost:5000${product.image}`}
                  className="card-img-top"
                  alt={product.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="text-success">
                    <strong>R$ {product.price.toFixed(2)}</strong>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
