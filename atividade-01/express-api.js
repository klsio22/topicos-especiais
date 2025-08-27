const express = require('express');

const app = express();

app.use(express.json());

let usuarios = [
  { id: 1, nome: 'João' },
  { id: 2, nome: 'Maria' }
];

// GET /usuarios - Retorna todos os usuários
app.get('/usuarios', (req, res) => {
  res.json(usuarios);
});

// POST /usuarios - Cria um novo usuário
app.post('/usuarios', (req, res) => {
  const novoUsuario = {
    id: usuarios.length + 1,
    nome: req.body.nome
  };
  usuarios.push(novoUsuario);
  res.status(201).json(novoUsuario);
});

// PUT /usuarios/:id - Atualiza um usuário existente
app.put('/usuarios/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = usuarios.find(u => u.id === id);
  if (usuario) {
    usuario.nome = req.body.nome;
    res.json(usuario);
  } else {
    res.status(404).send('Usuário não encontrado');
  }
});

// DELETE /usuarios/:id - Remove um usuário
app.delete('/usuarios/:id', (req, res) => {
  const id = parseInt(req.params.id);
  usuarios = usuarios.filter(u => u.id !== id);
  res.status(204).send();
});

// Servidor escutando na porta 3000
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000', 'http://localhost:3000');
});
