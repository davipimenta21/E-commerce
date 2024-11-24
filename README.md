
# Projeto E-commerce

Este projeto é uma aplicação de e-commerce composta por um back-end (server) e um front-end (client). 
A aplicação permite que os usuários naveguem, façam login, cadastrem-se e gerenciem produtos.

## Estrutura do Projeto

- **client/**: Código do front-end (React.js com Vite).
- **server/**: Código do back-end (Node.js com banco SQLite).

## Pré-requisitos

- Node.js (>=16.0.0)
- NPM ou Yarn
- SQLite3

## Instalação

1. Clone o repositório e navegue até o diretório do projeto.

   ```bash
   git clone https://github.com/davipimenta21/E-commerce
   ```

2. Instale as dependências para o front-end e back-end:

   **Front-end**:

   ```bash
   cd client
   npm install
   ```

   **Back-end**:

   ```bash
   cd ../server
   npm install
   ```

## Configuração

### Back-end

Certifique-se de que o arquivo `ecommerce.db` esteja na pasta `server`. Esse arquivo é o banco de dados da aplicação.

Se necessário, ajuste as configurações no arquivo `server/index.js`.

### Front-end

O arquivo `vite.config.js` pode ser ajustado caso seja necessário mudar o endereço da API.

## Uso

1. Inicie o servidor back-end:

   ```bash
   cd server
   npm start
   ```

   O servidor será iniciado em: `http://localhost:3000`.

2. Inicie o front-end:

   ```bash
   cd ../client
   npm run dev
   ```

   O front-end será iniciado em: `http://localhost:5173`.

3. Abra o navegador e acesse: `http://localhost:5173`.

## Estrutura de Pastas

### Client

- `src/`: Código fonte do front-end.
  - `pages/`: Páginas da aplicação.
  - `components/`: Componentes reutilizáveis.
  - `services/api.js`: Configuração para comunicação com o back-end.

### Server

- `uploads/`: Arquivos enviados (imagens, etc.).
- `index.js`: Ponto de entrada do servidor.
- `ecommerce.db`: Banco de dados SQLite.




