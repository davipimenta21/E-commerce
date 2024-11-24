import { useState, useEffect } from "react";
import API from "../services/api";

function Admin() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await API.get("/products");
      setProducts(response.data);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
    }
  };

  const handleAddProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      formData.append("price", newProduct.price);
      formData.append("stock", newProduct.stock);
      if (newProduct.image) formData.append("image", newProduct.image);

      await API.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Produto adicionado com sucesso!");
      setNewProduct({ name: "", description: "", price: "", stock: "", image: null });
      fetchProducts();
    } catch (err) {
      console.error("Erro ao adicionar produto:", err);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editingProduct.name);
      formData.append("description", editingProduct.description);
      formData.append("price", editingProduct.price);
      formData.append("stock", editingProduct.stock);
      if (editingProduct.image) formData.append("image", editingProduct.image);

      await API.put(`/products/${editingProduct.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Produto atualizado com sucesso!");
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error("Erro ao atualizar produto:", err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await API.delete(`/products/${id}`);
        alert("Produto excluído com sucesso!");
        fetchProducts();
      } catch (err) {
        console.error("Erro ao excluir produto:", err);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Administração</h1>
      <div className="mb-4">
        <h2>Adicionar Produto</h2>
        <form>
          <div className="mb-3">
            <label className="form-label">Nome</label>
            <input
              type="text"
              className="form-control"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Descrição</label>
            <textarea
              className="form-control"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Preço</label>
            <input
              type="number"
              className="form-control"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Estoque</label>
            <input
              type="number"
              className="form-control"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Imagem</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) =>
                setNewProduct({ ...newProduct, image : e.target.files[0] })
              }
            />
          </div>
          <button type="button" className="btn btn-primary" onClick={handleAddProduct}>
            Adicionar Produto
          </button>
        </form>
      </div>

      <div>
        <h2>Lista de Produtos</h2>
        <ul className="list-group">
          {products.map((product) => (
            <li key={product.id} className="list-group-item mb-5">
              <h5>{product.name}</h5>
              <p>{product.description}</p>
              <p>Preço: R$ {product.price}</p>
              <p>Estoque: {product.stock}</p>
              <button
                className="btn btn-warning "
                onClick={() => setEditingProduct(product)}
              >
                Editar
              </button>
              <button
                className="btn btn-danger mx-2"
                onClick={() => handleDeleteProduct(product.id)}
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </div>

      {editingProduct && (
        <div className="my-4">
          <h2>Editar Produto</h2>
          <form>
            <div className="mb-3">
              <label className="form-label">Nome</label>
              <input
                type="text"
                className="form-control"
                value={editingProduct.name}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, name: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Descrição</label>
              <textarea
                className="form-control"
                value={editingProduct.description}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, description: e.target.value })
                }
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Preço</label>
              <input
                type="number"
                className="form-control"
                value={editingProduct.price}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, price: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Estoque</label>
              <input
                type="number"
                className="form-control"
                value={editingProduct.stock}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, stock: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Imagem</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, image: e.target.files[0] })
                }
              />
            </div>
            <button type="button" className="btn btn-success" onClick={handleUpdateProduct}>
              Atualizar Produto
            </button>
            <button type="button" className="btn btn-secondary mx-2" onClick={() => setEditingProduct(null)}>
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Admin;