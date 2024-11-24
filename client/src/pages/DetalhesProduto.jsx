import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

function DetalhesProduto() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await API.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Erro ao buscar produto:", err);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <div>Carregando...</div>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">{product.name}</h1>
      <div className="row">
        <div className="col-md-6">
          {product.image && (
            <img
              src={`http://localhost:5000${product.image}`}
              alt={product.name}
              className="img-fluid"
            />
          )}
        </div>
        <div className="col-md-6">
          <p><strong>Descrição:</strong> {product.description}</p>
          <p><strong>Preço:</strong> R$ {product.price.toFixed(2)}</p>
          <p><strong>Estoque:</strong> {product.stock}</p>
        </div>
      </div>
    </div>
  );
}

export default DetalhesProduto;
