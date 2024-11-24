const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const port = 5000;


app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const db = new sqlite3.Database("./ecommerce.db", (err) => {
  if (err) console.error("Erro ao conectar ao banco de dados:", err);
  else console.log("Conectado ao SQLite");
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT CHECK(role IN ('user', 'admin')) DEFAULT 'user'
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      price REAL,
      stock INTEGER DEFAULT 0
    )
  `);

  db.all("PRAGMA table_info(products)", (err, rows) => {
    if (err) {
      console.error("Erro ao verificar tabela 'products':", err);
    } else {
      const columnNames = rows.map((col) => col.name); // Extrai os nomes das colunas
      if (!columnNames.includes("image")) {
        db.run("ALTER TABLE products ADD COLUMN image TEXT", (err) => {
          if (err) {
            console.error("Erro ao adicionar coluna 'image':", err);
          } else {
            console.log("Coluna 'image' adicionada com sucesso!");
          }
        });
      }
    }
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token não fornecido" });

  const token = authHeader.split(" ")[1]; 
  jwt.verify(token, "secret", (err, user) => {
    if (err) {
      console.error("Erro na verificação do token:", err);
      return res.status(403).json({ error: "Token inválido ou expirado" });
    }
    req.user = user;
    next();
  });
};

const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Acesso negado. Você não é admin." });
  }
  next();
};

app.post("/api/register", async (req, res) => {
  const { username, password, role = "user" } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Usuário e senha são obrigatórios." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, hashedPassword, role],
      function (err) {
        if (err) {
          console.error("Erro ao registrar usuário:", err);
          return res.status(400).json({ error: "Usuário já existe." });
        }
        res.status(201).json({ message: "Usuário registrado com sucesso!" });
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Erro no registro do usuário." });
  }
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
    if (err || !user) {
      console.error("Usuário não encontrado ou erro no banco:", err);
      return res.status(401).json({ error: "Usuário ou senha inválidos" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: "Usuário ou senha inválidos" });

    const token = jwt.sign({ id: user.id, role: user.role }, "secret", { expiresIn: "1h" });
    res.json({ token, role: user.role });
  });
});

app.get("/api/products", (req, res) => {
  db.all(`SELECT * FROM products`, [], (err, products) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar produtos" });
    res.json(products);
  });
});

app.post("/api/products", verifyToken, verifyAdmin, upload.single("image"), (req, res) => {
  const { name, description, price, stock } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  db.run(
    `INSERT INTO products (name, description, price, image, stock) VALUES (?, ?, ?, ?, ?)`,
    [name, description, price, imageUrl, stock || 0],
    (err) => {
      if (err) {
        console.error("Erro ao adicionar produto:", err);
        return res.status(500).json({ error: "Erro ao adicionar produto" });
      }
      res.json({ message: "Produto adicionado com sucesso" });
    }
  );
});

app.put("/api/products/:id", verifyToken, verifyAdmin, upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  db.run(
    `UPDATE products SET name = ?, description = ?, price = ?, stock = ?, image = COALESCE(?, image) WHERE id = ?`,
    [name, description, price, stock, imageUrl, id],
    function (err) {
      if (err) {
        console.error("Erro ao atualizar produto:", err);
        return res.status(500).json({ error: "Erro ao atualizar produto" });
      }
      if (this.changes === 0) return res.status(404).json({ error: "Produto não encontrado" });
      res.json({ message: "Produto atualizado com sucesso" });
    }
  );
});

app.delete("/api/products/:id", verifyToken, verifyAdmin, (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM products WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: "Erro ao excluir produto" });
    if (this.changes === 0) return res.status(404).json({ error: "Produto não encontrado" });
    res.json({ message: "Produto excluído com sucesso" });
  });
});

app.get("/api/verify-admin", verifyToken, verifyAdmin, (req, res) => {
  res.json({ message: "Usuário autorizado como admin" });
});

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
