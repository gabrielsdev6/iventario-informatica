// URL base da API
const API_URL = '/api/equipamentos';

const tableBody = document.getElementById('equipamentos-table-body');
const emptyState = document.getElementById('empty-state');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const form = document.getElementById('form-equipamento');

const inputId = document.getElementById('equipamento-id');
const inputNome = document.getElementById('input-nome');
const inputQuantidade = document.getElementById('input-quantidade');
const inputCategoria = document.getElementById('input-categoria');
const inputStatus = document.getElementById('input-status');

const filterSearch = document.getElementById('filter-search');
const filterCategoria = document.getElementById('filter-categoria');
const filterStatus = document.getElementById('filter-status');

const statTotal = document.getElementById('stat-total');
const statDisponivel = document.getElementById('stat-disponivel');
const statEmUso = document.getElementById('stat-em-uso');
const statManutencao = document.getElementById('stat-manutencao');

let equipamentosAtuais = [];

document.addEventListener('DOMContentLoaded', () => {
  carregarEquipamentos();

  filterSearch.addEventListener('input', debounce(carregarEquipamentos, 300));
  filterCategoria.addEventListener('change', carregarEquipamentos);
  filterStatus.addEventListener('change', carregarEquipamentos);

  document.getElementById('btn-novo').addEventListener('click', openModal);
  document.getElementById('btn-limpar').addEventListener('click', resetFilters);
  document.getElementById('btn-fechar-modal').addEventListener('click', closeModal);
  document.getElementById('btn-cancelar').addEventListener('click', closeModal);
  form.addEventListener('submit', handleFormSubmit);

  tableBody.addEventListener('click', (event) => {
    const botao = event.target.closest('button[data-action]');
    if (!botao) return;

    const id = Number(botao.dataset.id);
    const item = equipamentosAtuais.find((e) => e.id === id);
    if (!item) return;

    if (botao.dataset.action === 'editar') abrirModalEdicao(item);
    if (botao.dataset.action === 'excluir') excluirEquipamento(item.id, item.nome);
  });
});

async function carregarEquipamentos() {
  try {
    const params = new URLSearchParams();
    if (filterSearch.value.trim()) params.append('search', filterSearch.value.trim());
    if (filterCategoria.value) params.append('categoria', filterCategoria.value);
    if (filterStatus.value) params.append('status', filterStatus.value);

    const response = await fetch(`${API_URL}?${params.toString()}`);
    const equipamentos = await response.json();

    equipamentosAtuais = equipamentos;
    renderizarTabela(equipamentos);
    atualizarMetricas(equipamentos);
  } catch (error) {
    console.error('Erro ao buscar equipamentos:', error);
  }
}

function renderizarTabela(itens) {
  tableBody.innerHTML = '';

  if (itens.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  itens.forEach((item) => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition-colors';

    let badgeColor = '';
    let dotColor = '';

    if (item.status === 'Disponível') {
      badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      dotColor = 'bg-emerald-500';
    } else if (item.status === 'Em uso') {
      badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
      dotColor = 'bg-amber-500';
    } else {
      badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
      dotColor = 'bg-rose-500';
    }

    tr.innerHTML = `
      <td class="px-6 py-4 font-medium text-slate-900">${escapeHtml(item.nome)}</td>
      <td class="px-6 py-4 text-slate-600">
        <span class="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-medium text-slate-600">${escapeHtml(item.categoria)}</span>
      </td>
      <td class="px-6 py-4 font-semibold text-slate-700">${item.quantidade}</td>
      <td class="px-6 py-4">
        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeColor}">
          <span class="w-1.5 h-1.5 rounded-full ${dotColor} mr-1.5"></span>
          ${item.status}
        </span>
      </td>
      <td class="px-6 py-4 text-right space-x-2">
        <button data-action="editar" data-id="${item.id}" class="text-indigo-600 hover:text-indigo-900 text-xs font-semibold px-2 py-1 hover:bg-indigo-50 rounded transition-colors">
          Editar
        </button>
        <button data-action="excluir" data-id="${item.id}" class="text-rose-600 hover:text-rose-900 text-xs font-semibold px-2 py-1 hover:bg-rose-50 rounded transition-colors">
          Excluir
        </button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

function atualizarMetricas(itens) {
  const total = itens.reduce((acc, curr) => acc + curr.quantidade, 0);
  const disponivel = itens.filter(i => i.status === 'Disponível').reduce((acc, curr) => acc + curr.quantidade, 0);
  const emUso = itens.filter(i => i.status === 'Em uso').reduce((acc, curr) => acc + curr.quantidade, 0);
  const manutencao = itens.filter(i => i.status === 'Em manutenção').reduce((acc, curr) => acc + curr.quantidade, 0);

  statTotal.textContent = total;
  statDisponivel.textContent = disponivel;
  statEmUso.textContent = emUso;
  statManutencao.textContent = manutencao;
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const id = inputId.value;
  const payload = {
    nome: inputNome.value.trim(),
    quantidade: Number(inputQuantidade.value),
    categoria: inputCategoria.value,
    status: inputStatus.value,
  };

  try {
    const isEdit = Boolean(id);
    const url = isEdit ? `${API_URL}/${id}` : API_URL;
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(`Erro: ${err.error || 'Falha ao salvar'}`);
      return;
    }

    closeModal();
    carregarEquipamentos();
  } catch (error) {
    console.error('Erro na requisição:', error);
    alert('Erro de conexão ao salvar equipamento.');
  }
}

async function excluirEquipamento(id, nome) {
  if (!confirm(`Deseja realmente excluir o equipamento "${nome}"?`)) {
    return;
  }

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      alert('Erro ao excluir equipamento.');
      return;
    }
    carregarEquipamentos();
  } catch (error) {
    console.error('Erro ao excluir:', error);
    alert('Erro ao excluir equipamento.');
  }
}

function openModal() {
  form.reset();
  inputId.value = '';
  modalTitle.textContent = 'Novo Equipamento';
  modal.classList.remove('hidden');
  inputNome.focus();
}

function abrirModalEdicao(item) {
  inputId.value = item.id;
  inputNome.value = item.nome;
  inputQuantidade.value = item.quantidade;
  inputCategoria.value = item.categoria;
  inputStatus.value = item.status;

  modalTitle.textContent = 'Editar Equipamento';
  modal.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
}

function resetFilters() {
  filterSearch.value = '';
  filterCategoria.value = '';
  filterStatus.value = '';
  carregarEquipamentos();
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, function (m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
  });
}