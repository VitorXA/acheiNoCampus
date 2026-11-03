/* =========================================
   ACHEI NO CAMPUS
   Interações da página inicial
========================================= */

// Dados fictícios para testar o frontend.
// Depois serão substituídos pelos dados da API.

const objetos = [
  {
    id: 1,
    titulo: "Fone de ouvido Bluetooth",
    categoria: "Eletrônicos",
    tipo: "perdido",
    descricao: "Fone sem fio preto, guardado em um estojo pequeno.",
    local: "Bloco de Engenharia",
    data: "2026-10-29",
    emoji: "🎧",
    cor: "#e9e3ff"
  },
  {
    id: 2,
    titulo: "Carteira marrom",
    categoria: "Acessórios",
    tipo: "encontrado",
    descricao: "Carteira de couro marrom encontrada próxima à cantina.",
    local: "Cantina principal",
    data: "2026-10-30",
    emoji: "👛",
    cor: "#f8e9d8"
  },
  {
    id: 3,
    titulo: "Caderno universitário",
    categoria: "Material escolar",
    tipo: "perdido",
    descricao: "Caderno azul com anotações de cálculo.",
    local: "Biblioteca",
    data: "2026-10-28",
    emoji: "📘",
    cor: "#dfeeff"
  },
  {
    id: 4,
    titulo: "Chave com chaveiro",
    categoria: "Acessórios",
    tipo: "encontrado",
    descricao: "Uma chave com chaveiro de estrela.",
    local: "Estacionamento",
    data: "2026-10-31",
    emoji: "🔑",
    cor: "#fff1cb"
  },
  {
    id: 5,
    titulo: "Calculadora científica",
    categoria: "Eletrônicos",
    tipo: "perdido",
    descricao: "Calculadora científica preta, usada em aulas de matemática.",
    local: "Bloco de Matemática",
    data: "2026-10-27",
    emoji: "🧮",
    cor: "#e5e8ef"
  },
  {
    id: 6,
    titulo: "Garrafa de água",
    categoria: "Outros",
    tipo: "encontrado",
    descricao: "Garrafa de água reutilizável de cor lilás.",
    local: "Quadra esportiva",
    data: "2026-10-31",
    emoji: "🧴",
    cor: "#f0e3ff"
  }
];

// Estado dos filtros
let filtroTipo = "todos";
let filtroCategoria = "todas";
let termoBusca = "";

// Elementos da página
const itemsGrid = document.getElementById("itemsGrid");
const emptyState = document.getElementById("emptyState");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const filterTabs = document.querySelectorAll(".filter-tab");
const quickCategories = document.querySelectorAll(".quick-category");
const clearFiltersButton = document.getElementById("clearFilters");

// Menu mobile
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

// Formata uma data para o padrão brasileiro
function formatarData(data) {
  const [ano, mes, dia] = data.split("-");

  return `${dia}/${mes}/${ano}`;
}

// Cria o card HTML de um objeto
function criarCard(objeto) {
  const statusTexto =
    objeto.tipo === "perdido" ? "Perdido" : "Encontrado";

  return `
    <article class="item-card">

      <div
        class="item-image"
        style="background-color: ${objeto.cor}"
      >
        <span class="item-status ${objeto.tipo}">
          ${statusTexto}
        </span>

        <span class="item-image-emoji" aria-hidden="true">
          ${objeto.emoji}
        </span>
      </div>

      <div class="item-card-content">

        <span class="item-category">
          ${objeto.categoria}
        </span>

        <h3>${objeto.titulo}</h3>

        <p class="item-description">
          ${objeto.descricao}
        </p>

        <div class="item-meta">
          <span>
            <span aria-hidden="true">⌖</span>
            ${objeto.local}
          </span>
        </div>

        <div class="item-card-footer">
          <span class="item-date">
            ${formatarData(objeto.data)}
          </span>

          <button
            class="item-details-button"
            type="button"
            data-item-id="${objeto.id}"
          >
            Ver detalhes →
          </button>
        </div>

      </div>
    </article>
  `;
}

// Aplica os filtros à lista de objetos
function filtrarObjetos() {
  return objetos.filter((objeto) => {
    const correspondeTipo =
      filtroTipo === "todos" || objeto.tipo === filtroTipo;

    const correspondeCategoria =
      filtroCategoria === "todas" ||
      objeto.categoria === filtroCategoria;

    const textoObjeto = `
      ${objeto.titulo}
      ${objeto.categoria}
      ${objeto.descricao}
      ${objeto.local}
      ${objeto.tipo}
    `.toLowerCase();

    const correspondeBusca =
      textoObjeto.includes(termoBusca.toLowerCase());

    return (
      correspondeTipo &&
      correspondeCategoria &&
      correspondeBusca
    );
  });
}

// Renderiza os cards na tela
function renderizarObjetos() {
  const objetosFiltrados = filtrarObjetos();

  itemsGrid.innerHTML = objetosFiltrados
    .map(criarCard)
    .join("");

  // Exibe o estado vazio quando não houver resultados
  if (objetosFiltrados.length === 0) {
    emptyState.classList.remove("hidden");
    itemsGrid.classList.add("hidden");
  } else {
    emptyState.classList.add("hidden");
    itemsGrid.classList.remove("hidden");
  }
}

// Pesquisa
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  termoBusca = searchInput.value.trim();

  renderizarObjetos();

  document.getElementById("objetos").scrollIntoView({
    behavior: "smooth"
  });
});

// Pesquisa atualiza enquanto o usuário digita
searchInput.addEventListener("input", () => {
  termoBusca = searchInput.value.trim();
  renderizarObjetos();
});

// Filtros: todos, perdidos e encontrados
filterTabs.forEach((button) => {
  button.addEventListener("click", () => {
    filtroTipo = button.dataset.filter;

    filterTabs.forEach((tab) => {
      tab.classList.toggle("active", tab === button);
    });

    renderizarObjetos();
  });
});

// Filtro por categoria
categoryFilter.addEventListener("change", () => {
  filtroCategoria = categoryFilter.value;

  renderizarObjetos();
});

// Categorias rápidas
quickCategories.forEach((button) => {
  button.addEventListener("click", () => {
    filtroCategoria = button.dataset.category;
    categoryFilter.value = filtroCategoria;

    renderizarObjetos();

    document.getElementById("objetos").scrollIntoView({
      behavior: "smooth"
    });
  });
});

// Limpa todos os filtros
clearFiltersButton.addEventListener("click", () => {
  filtroTipo = "todos";
  filtroCategoria = "todas";
  termoBusca = "";

  searchInput.value = "";
  categoryFilter.value = "todas";

  filterTabs.forEach((tab) => {
    tab.classList.toggle(
      "active",
      tab.dataset.filter === "todos"
    );
  });

  renderizarObjetos();
});

// Botão de detalhes
// Por enquanto, mostra uma mensagem de demonstração.
// Depois vamos criar a página de detalhes do objeto.
itemsGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-item-id]");

  if (!button) return;

  const itemId = Number(button.dataset.itemId);

  const objeto = objetos.find((item) => item.id === itemId);

  if (!objeto) return;

  alert(
    `Objeto: ${objeto.titulo}\n` +
    `Status: ${objeto.tipo}\n` +
    `Categoria: ${objeto.categoria}\n` +
    `Local: ${objeto.local}\n\n` +
    `A página de detalhes será implementada em uma próxima etapa.`
  );
});

// Menu mobile
menuToggle.addEventListener("click", () => {
  const menuAberto = mainNav.classList.toggle("open");

  menuToggle.setAttribute(
    "aria-expanded",
    String(menuAberto)
  );

  menuToggle.setAttribute(
    "aria-label",
    menuAberto ? "Fechar menu" : "Abrir menu"
  );
});

// Fecha o menu após clicar em um link
mainNav.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  });
});

// Ano atualizado automaticamente no rodapé
document.getElementById("currentYear").textContent =
  new Date().getFullYear();

// Inicializa a página
renderizarObjetos();