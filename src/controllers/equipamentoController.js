const pool = require('../config/db');

const STATUS_VALIDOS = ['Disponível', 'Em uso', 'Em manutenção'];

exports.listar = async (req, res) => {
  try {
    const { search, categoria, status } = req.query;

    let query = 'SELECT * FROM equipamentos WHERE 1=1';
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND nome ILIKE $${params.length}`;
    }

    if (categoria) {
      params.push(categoria);
      query += ` AND categoria = $${params.length}`;
    }

    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    query += ' ORDER BY id DESC';

    const { rows } = await pool.query(query, params);
    return res.json(rows);
  } catch (error) {
    console.error('Erro ao listar equipamentos:', error);
    return res.status(500).json({ error: 'Erro interno ao consultar o banco de dados.' });
  }
};

exports.criar = async (req, res) => {
  try {
    const { nome, quantidade, categoria, status } = req.body;

    if (!nome || !categoria || !status || quantidade === undefined || quantidade === null) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    if (Number(quantidade) < 0) {
      return res.status(400).json({ error: 'A quantidade não pode ser negativa.' });
    }

    if (!STATUS_VALIDOS.includes(status)) {
      return res.status(400).json({ 
        error: `Status inválido. Escolha entre: ${STATUS_VALIDOS.join(', ')}` 
      });
    }

    const query = `
      INSERT INTO equipamentos (nome, quantidade, categoria, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [nome.trim(), Number(quantidade), categoria.trim(), status];

    const { rows } = await pool.query(query, values);
    return res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Erro ao cadastrar equipamento:', error);
    return res.status(500).json({ error: 'Erro interno ao salvar no banco de dados.' });
  }
};


exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, quantidade, categoria, status } = req.body;

    if (!nome || !categoria || !status || quantidade === undefined) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios para edição.' });
    }

    if (Number(quantidade) < 0) {
      return res.status(400).json({ error: 'A quantidade não pode ser negativa.' });
    }

    if (!STATUS_VALIDOS.includes(status)) {
      return res.status(400).json({ error: 'Status informado é inválido.' });
    }

    const query = `
      UPDATE equipamentos
      SET nome = $1, quantidade = $2, categoria = $3, status = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *;
    `;
    const values = [nome.trim(), Number(quantidade), categoria.trim(), status, id];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Equipamento não encontrado para atualização.' });
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar equipamento:', error);
    return res.status(500).json({ error: 'Erro interno ao atualizar equipamento.' });
  }
};

exports.excluir = async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'DELETE FROM equipamentos WHERE id = $1 RETURNING id;';
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Equipamento não encontrado para exclusão.' });
    }

    return res.json({ message: 'Equipamento excluído com sucesso!', id: rows[0].id });
  } catch (error) {
    console.error('Erro ao excluir equipamento:', error);
    return res.status(500).json({ error: 'Erro interno ao excluir equipamento.' });
  }
};