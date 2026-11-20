const origemAPI = location.protocol === "file:" ||
    (["localhost", "127.0.0.1"].includes(location.hostname) && location.port === "5500")
  ? "http://127.0.0.1:3000"
  : location.origin;

async function consultarAPI(caminho, signal) {
  const resposta = await fetch(origemAPI + "/api" + caminho, { signal });
  if (!resposta.ok) throw new Error("Falha na consulta à API.");
  return resposta.json();
}


const formatadorData = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit", month: "short", year: "numeric", timeZone: "UTC"
});

function formatarData(data) {
  return data ? formatadorData.format(new Date(data + "T00:00:00Z")).replace(/\.| de /g, " ").replace(/\s+/g, " ").trim() : "—";
}

function tipoTexto(tipo) {
  return tipo === "perdido" ? "Perdido" : "Encontrado";
}

function preencherTipo(elemento, tipo) {
  elemento.dataset.type = tipo;
  elemento.textContent = tipoTexto(tipo);
}

function preencherOpcoes(select, opcoes, chaveId) {
  select.append(...opcoes.map((valor) => new Option(valor.nome || "Sem nome", valor[chaveId])));
}

function iniciarMenu() {
  const botao = document.querySelector(".menu-button");
  const menu = document.querySelector(".main-nav");
  const compacto = window.matchMedia("(max-width: 760px)");

  function atualizarMenu(aberto) {
    botao.setAttribute("aria-expanded", String(aberto));
    menu.toggleAttribute("data-open", aberto);
  }

  botao.addEventListener("click", () => atualizarMenu(!menu.hasAttribute("data-open")));
  compacto.addEventListener("change", () => atualizarMenu(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.hasAttribute("data-open")) {
      atualizarMenu(false);
      botao.focus();
    }
  });
}

function iniciarArquivo(arquivo) {
  const pesquisa = document.getElementById("archive-search");
  const categoriasFiltro = document.getElementById("category-filters");
  const local = document.getElementById("location-filter");
  const lista = document.getElementById("records");
  const contador = document.getElementById("result-count");
  const vazio = document.getElementById("empty-state");
  const modelo = document.getElementById("record-template");
  const dialogo = document.getElementById("record-details");
  const avisoFiltros = document.createElement("p");
  avisoFiltros.role = "status";
  arquivo.querySelector(".filters").append(avisoFiltros);

  const mais = document.createElement("button");
  mais.type = "button";
  mais.className = "button load-more";
  mais.textContent = "Carregar mais";
  mais.hidden = true;
  lista.after(mais);

  let categoria = "";
  let buscaPendente;
  let carregamento;
  let detalhes;

  function numeroFicha(id) {
    return "Nº " + String(id).padStart(4, "0");
  }

  async function abrirDetalhes(id) {
    detalhes?.abort();
    const controle = new AbortController();
    detalhes = controle;
    const campos = dialogo.querySelector(".details-meta");
    const titulo = document.getElementById("details-title");
    const descricao = document.getElementById("details-description");
    document.getElementById("details-number").textContent = numeroFicha(id);
    titulo.textContent = "Carregando ficha…";
    descricao.textContent = "";
    campos.hidden = true;
    dialogo.showModal();

    try {
      const registro = await consultarAPI("/objetos/" + id, controle.signal);
      if (controle.signal.aborted) return;
      titulo.textContent = registro.titulo || "Objeto sem título";
      descricao.textContent = registro.descricao || "Sem descrição.";
      document.getElementById("details-type").textContent = tipoTexto(registro.tipo);
      document.getElementById("details-category").textContent = registro.categoria || "—";
      document.getElementById("details-location").textContent = registro.local || "—";
      document.getElementById("details-date").textContent = formatarData(registro.data_ocorrencia);
      campos.hidden = false;
    } catch {
      if (!controle.signal.aborted) titulo.textContent = "Não foi possível carregar a ficha.";
    }
  }

  dialogo.addEventListener("close", () => detalhes?.abort());

  function criarFicha(registro) {
    const ficha = modelo.content.cloneNode(true);
    const botao = ficha.querySelector(".record-open");
    const titulo = registro.titulo || "Objeto sem título";
    ficha.querySelector(".record-number").textContent = numeroFicha(registro.id_objeto);
    ficha.querySelector(".record-title").textContent = titulo;
    ficha.querySelector(".record-location").textContent = registro.local || "—";
    preencherTipo(ficha.querySelector(".record-type"), registro.tipo);
    const data = ficha.querySelector("time");
    if (registro.data_ocorrencia) data.dateTime = registro.data_ocorrencia;
    data.textContent = formatarData(registro.data_ocorrencia);
    botao.setAttribute("aria-label", "Ver ficha: " + titulo);
    botao.addEventListener("click", () => abrirDetalhes(registro.id_objeto));
    return ficha;
  }

  function selecionarCategoria(id) {
    categoria = id;
    categoriasFiltro.querySelectorAll("button").forEach((botao) => {
      botao.setAttribute("aria-pressed", String(botao.value === categoria));
    });
    atualizar();
  }

  Promise.allSettled([consultarAPI("/categorias"), consultarAPI("/locais")]).then(([categorias, locais]) => {
    if (categorias.status === "fulfilled") {
      for (const registro of categorias.value) {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.value = registro.id_categoria;
        botao.textContent = registro.nome || "Categoria sem nome";
        botao.setAttribute("aria-pressed", "false");
        botao.addEventListener("click", () => selecionarCategoria(categoria === botao.value ? "" : botao.value));
        categoriasFiltro.append(botao);
      }
      if (!categorias.value.length) categoriasFiltro.textContent = "Nenhuma categoria cadastrada.";
    }
    if (locais.status === "fulfilled") preencherOpcoes(local, locais.value, "id_local");
    if (categorias.status === "rejected" || locais.status === "rejected") {
      avisoFiltros.textContent = "Alguns filtros não puderam ser carregados.";
    }
  });

  async function atualizar(proximaPagina = 1) {
    clearTimeout(buscaPendente);
    carregamento?.abort();
    const controle = new AbortController();
    carregamento = controle;
    const params = new URLSearchParams({ pagina: String(proximaPagina) });
    const filtros = {
      busca: pesquisa.value.trim(),
      tipo: arquivo.querySelector('[name="tipo"]:checked').value,
      id_categoria: categoria,
      id_local: local.value
    };
    for (const [chave, valor] of Object.entries(filtros)) {
      if (valor) params.set(chave, valor);
    }

    if (proximaPagina === 1) lista.replaceChildren();
    contador.textContent = "Carregando registros…";
    vazio.hidden = true;
    mais.disabled = true;
    if (proximaPagina === 1) mais.hidden = true;

    try {
      const resultado = await consultarAPI("/objetos?" + params, controle.signal);
      if (controle.signal.aborted) return;
      lista.append(...resultado.dados.map(criarFicha));
      mais.dataset.pagina = String(resultado.pagina + 1);
      mais.textContent = "Carregar mais";
      const quantidade = lista.childElementCount;
      contador.textContent = quantidade + (quantidade === 1 ? " registro exibido" : " registros exibidos");
      vazio.hidden = quantidade > 0;
      mais.hidden = !resultado.temProximaPagina;
    } catch {
      if (!controle.signal.aborted) {
        contador.textContent = "Não foi possível carregar os registros.";
        mais.dataset.pagina = String(proximaPagina);
        mais.textContent = "Tentar novamente";
        mais.hidden = false;
      }
    } finally {
      if (!controle.signal.aborted) mais.disabled = false;
    }
  }

  mais.addEventListener("click", () => atualizar(Number(mais.dataset.pagina)));
  document.getElementById("search-form").addEventListener("submit", (event) => {
    event.preventDefault();
    atualizar();
  });
  pesquisa.maxLength = 150;
  pesquisa.addEventListener("input", () => {
    clearTimeout(buscaPendente);
    carregamento?.abort();
    mais.disabled = true;
    buscaPendente = setTimeout(atualizar, 250);
  });
  arquivo.querySelector(".type-filters").addEventListener("change", () => atualizar());
  local.addEventListener("change", () => atualizar());
  document.getElementById("reset-filters").addEventListener("click", () => {
    pesquisa.value = "";
    local.value = "";
    arquivo.querySelector('[name="tipo"][value=""]').checked = true;
    selecionarCategoria("");
    pesquisa.focus();
  });
  atualizar();
}

function iniciarConta(formulario) {
  const opcoes = document.querySelectorAll("[data-account]");
  const campoNome = document.getElementById("account-name");
  const nome = campoNome.querySelector("input");
  const senha = formulario.elements.senha;
  const botao = document.getElementById("account-submit");
  const aviso = document.getElementById("account-feedback");

  opcoes.forEach((opcao) => opcao.addEventListener("click", () => {
    const cadastro = opcao.dataset.account === "signup";
    opcoes.forEach((outra) => outra.setAttribute("aria-pressed", String(outra === opcao)));
    campoNome.hidden = !cadastro;
    nome.disabled = !cadastro;
    nome.required = cadastro;
    senha.autocomplete = cadastro ? "new-password" : "current-password";
    senha.value = "";
    botao.textContent = cadastro ? "Criar conta" : "Entrar";
    aviso.textContent = "";
  }));

  formulario.addEventListener("submit", (event) => {
    event.preventDefault();
    senha.value = "";
    aviso.textContent = "A área de conta ainda não está conectada ao servidor.";
  });
}

function iniciarRegistro(formulario) {
  const previa = document.getElementById("register-preview");
  const campos = formulario.elements;
  const imagem = previa.querySelector("img");
  const semFoto = previa.querySelector(".no-photo");
  const aviso = document.getElementById("register-feedback");
  const dicaFoto = document.getElementById("photo-hint");
  let fotoUrl;

  const botaoPublicar = formulario.querySelector('[type="submit"]');
  botaoPublicar.disabled = true;
  campos.categoria.disabled = true;
  campos.local.disabled = true;
  aviso.textContent = "Carregando categorias e locais…";

  Promise.all([consultarAPI("/categorias"), consultarAPI("/locais")]).then(([categorias, locais]) => {
    campos.categoria.append(new Option("Selecione uma categoria", ""));
    campos.local.append(new Option("Selecione um local", ""));
    preencherOpcoes(campos.categoria, categorias, "id_categoria");
    preencherOpcoes(campos.local, locais, "id_local");
    campos.categoria.disabled = categorias.length === 0;
    campos.local.disabled = locais.length === 0;
    botaoPublicar.disabled = !categorias.length || !locais.length;
    aviso.textContent = botaoPublicar.disabled
      ? "Cadastre categorias e locais no banco para preencher a ficha."
      : "A ficha pode ser visualizada antes da publicação.";
    atualizar();
  }).catch(() => {
    aviso.textContent = "Não foi possível carregar categorias e locais. Recarregue a página para tentar novamente.";
  });

  const hoje = new Date();
  campos.data.value = [
    hoje.getFullYear(), String(hoje.getMonth() + 1).padStart(2, "0"), String(hoje.getDate()).padStart(2, "0")
  ].join("-");
  campos.data.max = campos.data.value;

  function atualizar() {
    preencherTipo(previa.querySelector(".record-type"), campos.tipo.value);
    previa.querySelector(".record-title").textContent = campos.titulo.value.trim() || "Nome do objeto";
    previa.querySelector('[data-preview="local"]').textContent = campos.local.value ? campos.local.selectedOptions[0].textContent : "—";
    previa.querySelector('[data-preview="data"]').textContent = formatarData(campos.data.value);
    previa.querySelector('[data-preview="categoria"]').textContent = campos.categoria.value ? campos.categoria.selectedOptions[0].textContent : "—";
    previa.querySelector('[data-preview="cor"]').textContent = campos.cor.value.trim() || "—";
  }

  function limparFoto() {
    if (fotoUrl) URL.revokeObjectURL(fotoUrl);
    fotoUrl = undefined;
    imagem.removeAttribute("src");
    imagem.hidden = true;
    semFoto.hidden = false;
    dicaFoto.textContent = "JPG ou PNG, até 5 MB.";
  }

  campos.foto.addEventListener("change", () => {
    limparFoto();
    const arquivo = campos.foto.files[0];
    if (!arquivo) return;
    if (!["image/jpeg", "image/png"].includes(arquivo.type) || arquivo.size > 5 * 1024 * 1024) {
      campos.foto.value = "";
      aviso.textContent = "Escolha uma imagem JPG ou PNG de até 5 MB.";
      return;
    }
    fotoUrl = URL.createObjectURL(arquivo);
    imagem.src = fotoUrl;
    imagem.hidden = false;
    semFoto.hidden = true;
    dicaFoto.textContent = arquivo.name;
  });

  imagem.addEventListener("error", () => {
    campos.foto.value = "";
    limparFoto();
    aviso.textContent = "Não foi possível abrir a foto selecionada.";
  });

  formulario.addEventListener("input", atualizar);
  formulario.addEventListener("submit", (event) => {
    event.preventDefault();
    aviso.textContent = "Prévia pronta. A publicação será disponibilizada quando a API estiver integrada.";
  });
  atualizar();
}

document.querySelectorAll("[data-year]").forEach((elemento) => {
  elemento.textContent = new Date().getFullYear();
});
iniciarMenu();

const arquivo = document.getElementById("archive");
const conta = document.getElementById("account-form");
const registro = document.getElementById("register-form");
if (arquivo) iniciarArquivo(arquivo);
if (conta) iniciarConta(conta);
if (registro) iniciarRegistro(registro);
