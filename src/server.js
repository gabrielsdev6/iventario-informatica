const express = require('express');
const path = require('path');
const equipamentoRoutes = require('./routes/equipamentoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/equipamentos', equipamentoRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse o Dashboard em: http://localhost:${PORT}`);
});