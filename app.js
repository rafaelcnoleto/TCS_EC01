// ===== Armazenamento em memória (array de instâncias de Aluno) =====
const alunos = [];
let indiceEdicao = null; // null = modo cadastro; número = editando esse índice

// ===== Referências do DOM =====
const inputNome = document.getElementById("nome");
const inputIdade = document.getElementById("idade");
const selectCurso = document.getElementById("curso");
const inputNota = document.getElementById("nota");
const btnSalvar = document.getElementById("btn-salvar");
const btnCancelar = document.getElementById("btn-cancelar");
const tabela = document.getElementById("tabela-alunos");
const relatorio = document.getElementById("relatorio");

// ===== Funções auxiliares (arrow functions) =====
const lerFormulario = () =>
  new Aluno(
    inputNome.value.trim(),
    Number(inputIdade.value),
    selectCurso.value,
    Number(inputNota.value)
  );

const formularioValido = () =>
  inputNome.value.trim() !== "" &&
  inputIdade.value !== "" && Number(inputIdade.value) >= 0 &&
  inputNota.value !== "" && Number(inputNota.value) >= 0 && Number(inputNota.value) <= 10;

const limparFormulario = () => {
  inputNome.value = "";
  inputIdade.value = "";
  selectCurso.selectedIndex = 0;
  inputNota.value = "";
  indiceEdicao = null;
  btnSalvar.textContent = "Cadastrar";
  btnCancelar.hidden = true;
};

const adicionarAluno = (aluno) => alunos.push(aluno);
const atualizarAluno = (indice, aluno) => { alunos[indice] = aluno; };
const removerAluno = (indice) => alunos.splice(indice, 1);

// ===== Renderização da tabela =====
const criarCelula = (texto) => {
  const td = document.createElement("td");
  td.textContent = texto; // textContent evita injeção de HTML
  return td;
};

const renderizarTabela = () => {
  tabela.innerHTML = "";

  alunos.forEach((aluno, indice) => {
    const tr = document.createElement("tr");
    tr.appendChild(criarCelula(aluno.nome));
    tr.appendChild(criarCelula(aluno.idade));
    tr.appendChild(criarCelula(aluno.curso));
    tr.appendChild(criarCelula(aluno.notaFinal.toFixed(1)));
    tr.appendChild(criarCelula(aluno.isAprovado() ? "Aprovado" : "Reprovado"));

    const tdAcoes = document.createElement("td");

    const btnEditar = document.createElement("button");
    btnEditar.type = "button";
    btnEditar.textContent = "Editar";
    btnEditar.addEventListener("click", function () {
      inputNome.value = aluno.nome;
      inputIdade.value = aluno.idade;
      selectCurso.value = aluno.curso;
      inputNota.value = aluno.notaFinal;
      indiceEdicao = indice;
      btnSalvar.textContent = "Salvar alterações";
      btnCancelar.hidden = false;
      console.log(`Editando aluno: ${aluno.toString()}`);
    });

    const btnExcluir = document.createElement("button");
    btnExcluir.type = "button";
    btnExcluir.textContent = "Excluir";
    btnExcluir.addEventListener("click", function () {
      if (confirm(`Excluir o aluno ${aluno.nome}?`)) {
        removerAluno(indice);
        if (indiceEdicao !== null) limparFormulario();
        renderizarTabela();
        alert(`Aluno "${aluno.nome}" excluído com sucesso.`);
        console.log(`Aluno excluído: ${aluno.toString()}`);
      }
    });

    tdAcoes.appendChild(btnEditar);
    tdAcoes.appendChild(btnExcluir);
    tr.appendChild(tdAcoes);
    tabela.appendChild(tr);
  });
};

// ===== Eventos do formulário =====
btnSalvar.addEventListener("click", function () {
  if (!formularioValido()) {
    alert("Preencha todos os campos corretamente (nota entre 0 e 10).");
    return;
  }

  const aluno = lerFormulario();

  if (indiceEdicao === null) {
    adicionarAluno(aluno);
    alert(`Aluno "${aluno.nome}" cadastrado com sucesso!`);
    console.log(`Aluno cadastrado: ${aluno.toString()}`);
  } else {
    atualizarAluno(indiceEdicao, aluno);
    alert(`Aluno "${aluno.nome}" atualizado com sucesso!`);
    console.log(`Aluno editado: ${aluno.toString()}`);
  }

  limparFormulario();
  renderizarTabela();
});

btnCancelar.addEventListener("click", function () {
  limparFormulario();
  console.log("Edição cancelada.");
});

// ===== Relatórios =====
const mostrarRelatorio = (titulo, linhas) => {
  relatorio.innerHTML = "";

  const h3 = document.createElement("h3");
  h3.textContent = titulo;
  relatorio.appendChild(h3);

  const ul = document.createElement("ul");
  linhas.forEach((linha) => {
    const li = document.createElement("li");
    li.textContent = linha;
    ul.appendChild(li);
  });
  relatorio.appendChild(ul);
};

const semAlunos = () => {
  if (alunos.length === 0) {
    mostrarRelatorio("Relatório", ["Nenhum aluno cadastrado."]);
    return true;
  }
  return false;
};

// filter + map
document.getElementById("btn-aprovados").addEventListener("click", () => {
  if (semAlunos()) return;
  const aprovados = alunos.filter((a) => a.isAprovado()).map((a) => a.toString());
  mostrarRelatorio(
    "Alunos aprovados (nota >= 7)",
    aprovados.length ? aprovados : ["Nenhum aluno aprovado."]
  );
});

// map + reduce
document.getElementById("btn-media-notas").addEventListener("click", () => {
  if (semAlunos()) return;
  const media = alunos.map((a) => a.notaFinal).reduce((soma, n) => soma + n, 0) / alunos.length;
  mostrarRelatorio("Média das notas finais", [media.toFixed(2)]);
});

// map + reduce
document.getElementById("btn-media-idades").addEventListener("click", () => {
  if (semAlunos()) return;
  const media = alunos.map((a) => a.idade).reduce((soma, i) => soma + i, 0) / alunos.length;
  mostrarRelatorio("Média das idades", [`${media.toFixed(1)} anos`]);
});

// map + sort
document.getElementById("btn-alfabetica").addEventListener("click", () => {
  if (semAlunos()) return;
  const nomes = alunos.map((a) => a.nome).sort((a, b) => a.localeCompare(b, "pt-BR"));
  mostrarRelatorio("Nomes em ordem alfabética", nomes);
});

// reduce + forEach
document.getElementById("btn-por-curso").addEventListener("click", () => {
  if (semAlunos()) return;
  const contagem = alunos.reduce((acc, a) => {
    acc[a.curso] = (acc[a.curso] || 0) + 1;
    return acc;
  }, {});

  const linhas = [];
  Object.entries(contagem).forEach(([curso, qtd]) => {
    linhas.push(`${curso}: ${qtd} aluno(s)`);
  });
  mostrarRelatorio("Quantidade de alunos por curso", linhas);
});

renderizarTabela();
