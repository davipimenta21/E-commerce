import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login({ setUser  }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const toggleForm = () => setIsRegister(!isRegister);

  const handleSubmit = async () => {
    try {
      if (isRegister) {
        await API.post("/register", { username, password });
        alert("Registro realizado com sucesso!");
      } else {
        const { data } = await API.post("/login", { username, password });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({ username, role: data.role })); 
        setUser ({ username, role: data.role });
        navigate("/");
      }
    } catch (err) {
      alert("Erro ao realizar a operação!");
    }
  };

  return (
    <div className="container mt-5">
      <h2>{isRegister ? "Registrar" : "Login"}</h2>
      <form>
        <div className="mb-3">
          <label className="form-label">Usuário</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Senha</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={handleSubmit}>
          {isRegister ? "Registrar" : "Entrar"}
        </button>
      </form>
      <button className="btn btn-link" onClick={toggleForm}>
        {isRegister ? "Já tem conta? Login" : "Não tem conta? Registrar"}
      </button>
    </div>
  );
}

export default Login;