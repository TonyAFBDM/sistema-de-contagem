let itensGerente = JSON.parse(localStorage.getItem('itens')) || [
  { nome: 'Coca-Cola Lata', categoria: 'Bebidas' },
  { nome: 'Guaraná 2L', categoria: 'Bebidas' },
  { nome: 'Hambúrguer Picanha', categoria: 'Cozinha' }
];

let categoriasSalvas = JSON.parse(localStorage.getItem('categorias')) || ['Bebidas', 'Cozinha'];

let contagemAtual = {};

function toTitleCase(str) {
  return str.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function atualizarSelectCategorias() {
  const select = document.getElementById('novaCategoria');
  select.innerHTML = '';
  categoriasSalvas.forEach(cat => {
    select.innerHTML += `<option value="${cat}">${cat}</option>`;
  });
}

function abrirAreaFuncionario() {
  document.getElementById('menuInicial').classList.add('hidden');
  document.getElementById('formularioInicial').classList.remove('hidden');
}

function abrirMenuGerente() {
  document.getElementById('menuInicial').classList.add('hidden');
  document.getElementById('menuGerente').classList.remove('hidden');
}

function abrirGerenciarItens() {
  document.getElementById('menuGerente').classList.add('hidden');
  document.getElementById('gerenciarItens').classList.remove('hidden');
  montarListaGerente();
  atualizarSelectCategorias();
}

function abrirDadosContagem() {
  document.getElementById('menuGerente').classList.add('hidden');
  document.getElementById('dadosContagem').classList.remove('hidden');
  mostrarTabelaHistorico();
  gerarGraficoGerente();
}

function voltarMenu() {
  location.reload();
}

function voltarGerente() {
  document.getElementById('gerenciarItens').classList.add('hidden');
  document.getElementById('dadosContagem').classList.add('hidden');
  document.getElementById('menuGerente').classList.remove('hidden');
}

function iniciarContagem() {
  const nome = document.getElementById('nome').value;
  const data = document.getElementById('data').value;

  if (!nome || !data) {
    alert('Preencha seu nome e a data!');
    return;
  }

  localStorage.setItem('responsavel', nome);
  localStorage.setItem('dataContagem', data);

  document.getElementById('formularioInicial').classList.add('hidden');
  document.getElementById('telaContagem').classList.remove('hidden');

  montarListaContagem();
}

function montarListaContagem() {
  const lista = document.getElementById('listaItens');
  lista.innerHTML = '';

  contagemAtual = {};

  const categorias = [...new Set(itensGerente.map(item => item.categoria))];

  categorias.forEach(categoria => {
    lista.innerHTML += `<div class="categoriaTitulo">${categoria}</div>`;

    itensGerente.filter(item => item.categoria === categoria).forEach(item => {
      contagemAtual[item.nome] = 0;
      lista.innerHTML += `
        <div class="item">
          <span>${item.nome}</span>
          <div>
            <button onclick="alterarQuantidadeContagem('${item.nome}', -1)">-</button>
            <input type="number" id="input_${item.nome}" value="0" min="0" onchange="atualizarQuantidadeDireta('${item.nome}')" style="width:50px; text-align:center;">
            <button onclick="alterarQuantidadeContagem('${item.nome}', 1)">+</button>
          </div>
        </div>
      `;
    });
  });
}

function alterarQuantidadeContagem(nome, valor) {
  contagemAtual[nome] += valor;
  if (contagemAtual[nome] < 0) contagemAtual[nome] = 0;
  document.getElementById(`input_${nome}`).value = contagemAtual[nome];
}

function atualizarQuantidadeDireta(nome) {
  let valor = parseInt(document.getElementById(`input_${nome}`).value);
  if (isNaN(valor) || valor < 0) valor = 0;
  contagemAtual[nome] = valor;
}

function salvarContagem() {
  const historico = JSON.parse(localStorage.getItem('historico')) || [];

  historico.push({
    data: localStorage.getItem('dataContagem'),
    responsavel: localStorage.getItem('responsavel'),
    itens: { ...contagemAtual }
  });

  localStorage.setItem('historico', JSON.stringify(historico));
  alert('Contagem salva com sucesso!');
  location.reload();
}

function montarListaGerente() {
  const lista = document.getElementById('listaGerente');
  lista.innerHTML = '';

  itensGerente.forEach((item, index) => {
    lista.innerHTML += `<li>${item.nome} (${item.categoria}) <button onclick="removerItemGerente(${index})">Remover</button></li>`;
  });
}

function adicionarItemGerente() {
  let nome = document.getElementById('novoItem').value;
  let categoriaSelecionada = document.getElementById('novaCategoria').value;
  let categoriaPersonalizada = document.getElementById('novaCategoriaPersonalizada').value;

  if (!nome) {
    alert('Preencha o nome do item!');
    return;
  }

  nome = toTitleCase(nome);

  let categoria = categoriaPersonalizada ? toTitleCase(categoriaPersonalizada) : categoriaSelecionada;

  if (!categoria) {
    alert('Selecione ou digite uma categoria!');
    return;
  }

  if (!categoriasSalvas.includes(categoria)) {
    categoriasSalvas.push(categoria);
    localStorage.setItem('categorias', JSON.stringify(categoriasSalvas));
  }

  itensGerente.push({ nome, categoria });
  localStorage.setItem('itens', JSON.stringify(itensGerente));

  document.getElementById('novoItem').value = '';
  document.getElementById('novaCategoriaPersonalizada').value = '';

  montarListaGerente();
  atualizarSelectCategorias();
}

function removerItemGerente(index) {
  itensGerente.splice(index, 1);
  localStorage.setItem('itens', JSON.stringify(itensGerente));
  montarListaGerente();
}

function mostrarTabelaHistorico() {
  const historico = JSON.parse(localStorage.getItem('historico')) || [];
  const tabela = document.getElementById('tabelaHistorico');

  tabela.innerHTML = '<tr><th>Data</th><th>Responsável</th><th>Ações</th></tr>';

  historico.forEach((registro, index) => {
    tabela.innerHTML += `
      <tr>
        <td>${registro.data}</td>
        <td>${registro.responsavel}</td>
        <td><button onclick="mostrarDetalhesDia(${index})">Ver Detalhes</button></td>
      </tr>
    `;
  });
}

function mostrarTabelaHistorico() {
  const historico = JSON.parse(localStorage.getItem('historico')) || [];
  const tabela = document.getElementById('tabelaHistorico');

  tabela.innerHTML = '<tr><th>Data</th><th>Responsável</th><th>Ações</th></tr>';

  historico.forEach((registro, index) => {
    tabela.innerHTML += `
      <tr>
        <td>${registro.data}</td>
        <td>${registro.responsavel}</td>
        <td><button onclick="mostrarDetalhesDia(${index})">Ver Detalhes</button></td>
      </tr>
    `;
  });
}

function mostrarDetalhesDia(index) {
  const historico = JSON.parse(localStorage.getItem('historico')) || [];
  const registro = historico[index];

  let detalhes = `<h4>Data: ${registro.data} - Responsável: ${registro.responsavel}</h4>`;

  const categoriasSalvas = JSON.parse(localStorage.getItem('categorias')) || [];

  categoriasSalvas.forEach(categoria => {
    detalhes += `<h5>${categoria}</h5>`;
    detalhes += '<table border="1" cellpadding="5" cellspacing="0"><tr><th>Item</th><th>Quantidade</th></tr>';

    itensGerente.filter(item => item.categoria === categoria).forEach(produto => {
      const qtd = registro.itens[produto.nome] || 0;
      detalhes += `<tr><td>${produto.nome}</td><td>${qtd}</td></tr>`;
    });

    detalhes += '</table><br>';
  });

  const popup = window.open('', '_blank', 'width=600,height=600');
  popup.document.write('<html><head><title>Detalhes da Contagem</title></head><body>' + detalhes + '</body></html>');
}

// Função para remover categoria e os itens associados
function removerCategoriaGerente(nomeCategoria) {
  if (confirm(`Deseja realmente remover a categoria "${nomeCategoria}"? Todos os itens dessa categoria também serão removidos.`)) {
    itensGerente = itensGerente.filter(item => item.categoria !== nomeCategoria);

    let categoriasSalvas = JSON.parse(localStorage.getItem('categorias')) || [];
    categoriasSalvas = categoriasSalvas.filter(cat => cat !== nomeCategoria);
    localStorage.setItem('categorias', JSON.stringify(categoriasSalvas));
    localStorage.setItem('itens', JSON.stringify(itensGerente));

    montarListaGerente();
    atualizarSelectCategorias();
    listarCategoriasGerente();
  }
}

// Função para listar categorias com botão de remoção
function listarCategoriasGerente() {
  const categoriasDiv = document.getElementById('categoriasGerente');
  categoriasDiv.innerHTML = '';

  const categoriasSalvas = JSON.parse(localStorage.getItem('categorias')) || [];

  categoriasSalvas.forEach(cat => {
    categoriasDiv.innerHTML += `<div>${cat} <button onclick="removerCategoriaGerente('${cat}')">Remover Categoria</button></div>`;
  });
}
