/* =====================================================
   BANCO DE QUESTÕES
===================================================== */

const questoes = [];


/* =====================================================
   ELEMENTOS
===================================================== */

const content = document.getElementById("content");

const menuItems = document.querySelectorAll(".menu-item");

const searchInput = document.getElementById("searchInput");

const filterPanel = document.getElementById("filterPanel");

const filterOverlay = document.getElementById("filterOverlay");

const closeFilterButton = document.getElementById("closeFilter");

const clearFiltersButton = document.getElementById("clearFilters");

const applyFiltersButton = document.getElementById("applyFilters");

const filterInputs = document.querySelectorAll(".filter-input");

const topSimuladoButton =
    document.getElementById("topSimuladoButton");


/* =====================================================
   FILTROS
===================================================== */

function abrirFiltros() {

    filterPanel.classList.add("open");

    filterOverlay.classList.add("open");

}


function fecharFiltros() {

    filterPanel.classList.remove("open");

    filterOverlay.classList.remove("open");

}


function obterFiltros() {

    const filtros = {

        ano: [],
        area: [],
        vertente: [],
        materia: [],
        tri: []

    };


    filterInputs.forEach(input => {

        if (input.checked) {

            filtros[input.dataset.type].push(
                input.value
            );

        }

    });


    return filtros;

}


/* =====================================================
   COMPATIBILIDADE
===================================================== */

const compatibilidade = {

    exatas: [
        "natureza",
        "matematica"
    ],

    humanas: [
        "humanas",
        "linguagens"
    ]

};


function atualizarCompatibilidade() {

    const areasSelecionadas = [

        ...document.querySelectorAll(
            'input[data-type="area"]:checked'
        )

    ].map(input => input.value);


    const vertentes = document.querySelectorAll(
        'input[data-type="vertente"]'
    );


    vertentes.forEach(vertente => {

        if (areasSelecionadas.length === 0) {

            vertente.disabled = false;

            return;

        }


        const permitido = areasSelecionadas.some(
            area => compatibilidade[area]
                ?.includes(vertente.value)
        );


        vertente.disabled = !permitido;


        if (!permitido) {

            vertente.checked = false;

        }

    });


    const vertentesSelecionadas = [

        ...document.querySelectorAll(
            'input[data-type="vertente"]:checked'
        )

    ].map(input => input.value);


    const areas = document.querySelectorAll(
        'input[data-type="area"]'
    );


    areas.forEach(area => {

        if (vertentesSelecionadas.length === 0) {

            area.disabled = false;

            return;

        }


        const permitido = vertentesSelecionadas.some(
            vertente =>
                compatibilidade[area.value]
                    ?.includes(vertente)
        );


        area.disabled = !permitido;


        if (!permitido) {

            area.checked = false;

        }

    });

}


filterInputs.forEach(input => {

    input.addEventListener(
        "change",
        atualizarCompatibilidade
    );

});


/* =====================================================
   FILTRAR QUESTÕES
===================================================== */

function filtrarQuestoes() {

    const filtros = obterFiltros();

    const pesquisa = searchInput.value
        .trim()
        .toLowerCase();


    return questoes.filter(questao => {

        if (
            filtros.ano.length > 0 &&
            !filtros.ano.includes(
                String(questao.ano)
            )
        ) {

            return false;

        }


        if (
            filtros.area.length > 0 &&
            !filtros.area.includes(questao.area)
        ) {

            return false;

        }


        if (
            filtros.vertente.length > 0 &&
            !filtros.vertente.includes(
                questao.vertente
            )
        ) {

            return false;

        }


        if (
            filtros.materia.length > 0 &&
            !filtros.materia.includes(
                questao.materia
            )
        ) {

            return false;

        }


        if (
            filtros.tri.length > 0 &&
            !filtros.tri.includes(questao.tri)
        ) {

            return false;

        }


        if (pesquisa) {

            const texto = `

                ${questao.enunciado || ""}

                ${questao.materia || ""}

                ${questao.vertente || ""}

                ${questao.ano || ""}

            `.toLowerCase();


            if (!texto.includes(pesquisa)) {

                return false;

            }

        }


        return true;

    });

}


/* =====================================================
   PÁGINA QUESTÕES
===================================================== */

function mostrarQuestoes() {

    const resultados = filtrarQuestoes();


    content.innerHTML = `

        <div class="page-header">

            <h1 class="page-title">
                Questões do ENEM
            </h1>

            <p class="page-description">
                Encontre questões organizadas por área,
                vertente, matéria e dificuldade.
            </p>

        </div>


        <div class="question-toolbar">

            <div class="question-search">

                <span>⌕</span>

                <input
                    type="text"
                    id="questionSearch"
                    placeholder="Buscar por palavra-chave..."
                    value="${searchInput.value}"
                >

            </div>


            <button
                class="filter-button"
                id="openFilters"
            >
                ⚲
                Filtros
            </button>

        </div>


        <div class="question-counter">
            ${resultados.length} questões encontradas
        </div>


        ${
            resultados.length === 0

            ?

            `
                <div class="empty-state">

                    <div class="empty-icon">
                        ▤
                    </div>

                    <h3>
                        Nenhuma questão disponível
                    </h3>

                    <p>
                        As questões serão adicionadas ao banco
                        posteriormente.
                    </p>

                </div>
            `

            :

            resultados.map(questao => `

                <article class="prova-card">

                    <h3>
                        ENEM ${questao.ano}
                    </h3>

                    <p>
                        ${questao.materia}
                    </p>

                </article>

            `).join("")
        }

    `;


    const localSearch =
        document.getElementById("questionSearch");


    localSearch.addEventListener(
        "input",
        event => {

            searchInput.value = event.target.value;

            mostrarQuestoes();

        }
    );


    document
        .getElementById("openFilters")
        .addEventListener(
            "click",
            abrirFiltros
        );

}


/* =====================================================
   PÁGINA PROVAS
===================================================== */

function mostrarProvas() {

    content.innerHTML = `

        <h1 class="page-title">
            Provas
        </h1>

        <p class="page-description">
            Acesse as provas completas e regulares do ENEM.
        </p>


        <div class="empty-state">

            <div class="empty-icon">
                ▤
            </div>

            <h3>
                Nenhuma prova disponível
            </h3>

            <p>
                As provas serão adicionadas posteriormente.
            </p>

        </div>

    `;

}


/* =====================================================
   PÁGINA SIMULADOS
===================================================== */

function mostrarSimulados() {

    content.innerHTML = `

        <div class="simulado-header">

            <div>

                <h1 class="page-title">
                    Simulados
                </h1>

                <p class="page-description">
                    Crie simulados personalizados
                    com as questões do ENEM.
                </p>

            </div>


            <button
                class="new-simulado-button"
                id="newSimuladoButton"
            >
                + Novo simulado
            </button>

        </div>


        <div class="empty-state">

            <div class="empty-icon">
                ▤
            </div>

            <h3>
                Nenhum simulado criado
            </h3>

            <p>
                Crie seu primeiro simulado personalizado.
            </p>

        </div>

    `;


    document
        .getElementById("newSimuladoButton")
        .addEventListener(
            "click",
            mostrarCriadorSimulado
        );

}


/* =====================================================
   CRIADOR DE SIMULADO
===================================================== */

function mostrarCriadorSimulado() {

    content.innerHTML = `

        <div class="simulado-creator">


            <div class="simulado-creator-header">

                <h2>
                    Criar novo simulado
                </h2>

                <p>
                    Configure como as questões
                    serão selecionadas.
                </p>

            </div>


            <!-- NOME -->

            <div class="form-section">

                <h3>
                    Nome do simulado
                </h3>

                <input
                    class="form-input"
                    id="simuladoName"
                    type="text"
                    placeholder="Ex.: Simulado ENEM - Matemática"
                >

            </div>


            <!-- MÉTODO -->

            <div class="form-section">

                <h3>
                    Seleção das questões
                </h3>


                <div class="selection-methods">


                    <label class="selection-method selected">

                        <input
                            type="radio"
                            name="selectionMethod"
                            value="especificas"
                            checked
                        >

                        <strong>
                            Questões específicas
                        </strong>

                        <span>
                            Escolha individualmente as questões
                            que deseja aplicar.
                        </span>

                    </label>


                    <label class="selection-method">

                        <input
                            type="radio"
                            name="selectionMethod"
                            value="filtro"
                        >

                        <strong>
                            Usar filtros
                        </strong>

                        <span>
                            Selecione critérios para encontrar
                            questões automaticamente.
                        </span>

                    </label>


                    <label class="selection-method">

                        <input
                            type="radio"
                            name="selectionMethod"
                            value="ambos"
                        >

                        <strong>
                            Os dois
                        </strong>

                        <span>
                            Escolha questões específicas e
                            utilize filtros.
                        </span>

                    </label>


                </div>

            </div>


            <!-- QUANTIDADE -->

            <div class="form-section">

                <h3>
                    Número de questões
                </h3>

                <div class="question-count">

                    <input
                        id="questionCount"
                        type="number"
                        min="1"
                        value="20"
                    >

                    <span>
                        questões
                    </span>

                </div>

            </div>


            <!-- QUESTÕES ESPECÍFICAS -->

            <div
                class="question-selection-area"
                id="specificQuestionsArea"
            >

                <h4>
                    Selecionar questões
                </h4>

                <p>
                    As questões disponíveis aparecerão
                    aqui quando forem adicionadas ao banco.
                </p>

            </div>


            <!-- FILTROS -->

            <div
                class="simulado-filter-area"
                id="simuladoFilterArea"
                style="display: none;"
            >

                <h4>
                    Filtros do simulado
                </h4>

                <p>
                    Configure os critérios que serão
                    utilizados para selecionar as questões.
                </p>


                <div class="simulado-filter-grid">

                    <div class="simulado-filter-box">

                        <strong>
                            Data
                        </strong>

                        <span>
                            Todos os anos
                        </span>

                    </div>


                    <div class="simulado-filter-box">

                        <strong>
                            Área
                        </strong>

                        <span>
                            Todas as áreas
                        </span>

                    </div>


                    <div class="simulado-filter-box">

                        <strong>
                            Vertente
                        </strong>

                        <span>
                            Todas as vertentes
                        </span>

                    </div>


                    <div class="simulado-filter-box">

                        <strong>
                            Matéria
                        </strong>

                        <span>
                            Todas as matérias
                        </span>

                    </div>


                    <div class="simulado-filter-box">

                        <strong>
                            TRI
                        </strong>

                        <span>
                            Todas as dificuldades
                        </span>

                    </div>

                </div>

            </div>


            <!-- BOTÕES -->

            <div class="simulado-actions">

                <button
                    class="cancel-button"
                    id="cancelSimulado"
                >
                    Cancelar
                </button>


                <button
                    class="create-button"
                    id="createSimulado"
                >
                    Criar simulado
                </button>

            </div>


        </div>

    `;


    configurarCriadorSimulado();

}


/* =====================================================
   CONTROLES DO CRIADOR
===================================================== */

function configurarCriadorSimulado() {

    const methods =
        document.querySelectorAll(
            'input[name="selectionMethod"]'
        );


    const specificArea =
        document.getElementById(
            "specificQuestionsArea"
        );


    const filterArea =
        document.getElementById(
            "simuladoFilterArea"
        );


    methods.forEach(method => {

        method.addEventListener(
            "change",
            () => {

                document
                    .querySelectorAll(
                        ".selection-method"
                    )
                    .forEach(card => {

                        card.classList.remove(
                            "selected"
                        );

                    });


                method
                    .closest(".selection-method")
                    .classList.add("selected");


                if (
                    method.value === "especificas"
                ) {

                    specificArea.style.display =
                        "block";

                    filterArea.style.display =
                        "none";

                }


                if (
                    method.value === "filtro"
                ) {

                    specificArea.style.display =
                        "none";

                    filterArea.style.display =
                        "block";

                }


                if (
                    method.value === "ambos"
                ) {

                    specificArea.style.display =
                        "block";

                    filterArea.style.display =
                        "block";

                }

            }
        );

    });


    document
        .getElementById("cancelSimulado")
        .addEventListener(
            "click",
            mostrarSimulados
        );


    document
        .getElementById("createSimulado")
        .addEventListener(
            "click",
            criarSimulado
        );

}


/* =====================================================
   CRIAR SIMULADO
===================================================== */

function criarSimulado() {

    const name =
        document
            .getElementById("simuladoName")
            .value
            .trim();


    const count =
        Number(
            document
                .getElementById("questionCount")
                .value
        );


    if (!name) {

        alert(
            "Digite um nome para o simulado."
        );

        return;

    }


    if (!count || count < 1) {

        alert(
            "Digite uma quantidade válida de questões."
        );

        return;

    }


    alert(
        `Simulado "${name}" criado com ${count} questões.`
    );

}


/* =====================================================
   OUTRAS PÁGINAS
===================================================== */

function mostrarPagina(page) {

    if (page === "questoes") {

        mostrarQuestoes();

        return;

    }


    if (page === "provas") {

        mostrarProvas();

        return;

    }


    if (page === "simulados") {

        mostrarSimulados();

        return;

    }


    const nomes = {

        historico: "Histórico",

        configuracoes: "Configurações",

        conta: "Conta"

    };


    const nome = nomes[page];


    content.innerHTML = `

        <h1 class="page-title">
            ${nome}
        </h1>

        <p class="page-description">
            Esta área ainda está em desenvolvimento.
        </p>


        <div class="empty-state">

            <div class="empty-icon">
                ▤
            </div>

            <h3>
                Nenhum conteúdo disponível
            </h3>

            <p>
                Esta página será preenchida posteriormente.
            </p>

        </div>

    `;

}


/* =====================================================
   MENU LATERAL
===================================================== */

menuItems.forEach(item => {

    item.addEventListener(
        "click",
        () => {

            const page =
                item.dataset.page;


            menuItems.forEach(menuItem => {

                menuItem.classList.remove(
                    "active"
                );

            });


            item.classList.add("active");


            fecharFiltros();


            mostrarPagina(page);

        }
    );

});


/* =====================================================
   NOVO SIMULADO DO TOPO
===================================================== */

topSimuladoButton.addEventListener(
    "click",
    () => {

        menuItems.forEach(item => {

            item.classList.remove("active");

        });


        const simuladoMenu =
            document.querySelector(
                '[data-page="simulados"]'
            );


        simuladoMenu.classList.add("active");


        fecharFiltros();


        mostrarSimulados();

    }
);


/* =====================================================
   FILTROS
===================================================== */

closeFilterButton.addEventListener(
    "click",
    fecharFiltros
);


filterOverlay.addEventListener(
    "click",
    fecharFiltros
);


applyFiltersButton.addEventListener(
    "click",
    () => {

        mostrarQuestoes();

        fecharFiltros();

    }
);


clearFiltersButton.addEventListener(
    "click",
    () => {

        filterInputs.forEach(input => {

            input.checked = false;

        });


        atualizarCompatibilidade();

        mostrarQuestoes();

    }
);


/* =====================================================
   BUSCA DO TOPO
===================================================== */

searchInput.addEventListener(
    "input",
    () => {

        const questoesAtivas =
            document.querySelector(
                '[data-page="questoes"].active'
            );


        if (questoesAtivas) {

            mostrarQuestoes();

        }

    }
);


/* =====================================================
   BOTÃO DA SIDEBAR
===================================================== */

const sidebarToggle =
    document.getElementById(
        "sidebarToggle"
    );


sidebarToggle.addEventListener(
    "click",
    () => {

        document
            .querySelector(".sidebar")
            .classList.toggle("collapsed");

    }
);


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

mostrarQuestoes();


if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./service-worker.js")
        .catch((error) => {
          console.error(
            "Erro ao registrar o Service Worker:",
            error
          );
        });
    });
  }
  