// ==========================================
// 1. CARREGAR PÁGINA INICIAL (index.html)
// ==========================================
async function carregarIndex() {
    const lista2020 = document.getElementById('lista-2020');
    if (!lista2020) return;

    try {
        // Carrega os alunos para identificar os anos cadastrados
        const resposta = await fetch('alunos.json');
        const alunos = await resposta.json();

        // Extrai apenas os anos únicos (ex: 2020, 2023, 2024) sem duplicados
        const anosUnicos = [...new Set(alunos.map(a => String(a.ano).trim()))]
            .filter(ano => ano && ano !== 'undefined' && ano !== '')
            .sort((a, b) => parseInt(a) - parseInt(b));

        lista2020.innerHTML = '';

        if (anosUnicos.length === 0) {
            lista2020.innerHTML = '<li>Nenhuma turma cadastrada.</li>';
            return;
        }

        // Gera apenas o link da Turma para cada ano encontrado
        anosUnicos.forEach(ano => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="turma.html?ano=${encodeURIComponent(ano)}">Turma de ${ano}</a>`;
            lista2020.appendChild(li);
        });

    } catch (error) {
        console.error('Erro ao carregar a página inicial:', error);
        lista2020.innerHTML = '<li style="color: red;">Erro ao carregar turmas. Certifique-se de ter rodado o script Python.</li>';
    }
}

// ==========================================
// 2. CARREGAR PÁGINA DA TURMA (turma.html)
// ==========================================
async function carregarTurma() {
    const urlParams = new URLSearchParams(window.location.search);
    const anoTurma = urlParams.get('ano');

    const tituloEl = document.getElementById('turma-titulo');
    const listaAlunos = document.getElementById('lista-alunos');

    if (!listaAlunos) return;

    if (!anoTurma) {
        listaAlunos.innerHTML = '<p>Nenhuma turma selecionada.</p>';
        return;
    }

    const anoTarget = String(anoTurma).trim();

    if (tituloEl) {
        tituloEl.textContent = `Turma de ${anoTarget}`;
    }

    try {
        const respAlunos = await fetch('alunos.json');
        const todosAlunos = await respAlunos.json();

        // Filtra os alunos que pertencem estritamente a este ano
        const alunosDaTurma = todosAlunos
            .filter(a => String(a.ano).trim() === anoTarget)
            .sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));

        listaAlunos.innerHTML = '';

        if (alunosDaTurma.length === 0) {
            listaAlunos.innerHTML = '<p class="sem-alunos">Nenhum aluno cadastrado para esta turma.</p>';
            return;
        }

        // Monta os cartões expansíveis (Accordion) apenas para a turma aberta
        alunosDaTurma.forEach(aluno => {
            const item = document.createElement('div');
            item.className = 'aluno-card';

            const linkLinkedin = aluno.linkedin && String(aluno.linkedin).trim()
                ? `<a href="${aluno.linkedin}" target="_blank" rel="noopener noreferrer" class="btn-social linkedin">LinkedIn</a>`
                : '';

            const linkLattes = aluno.lattes && String(aluno.lattes).trim()
                ? `<a href="${aluno.lattes}" target="_blank" rel="noopener noreferrer" class="btn-social lattes">Lattes</a>`
                : '';

            const emailContato = aluno.email && String(aluno.email).trim()
                ? `<p class="aluno-email"><strong>E-mail:</strong> <a href="mailto:${aluno.email}">${aluno.email}</a></p>`
                : '<p class="aluno-email"><strong>E-mail:</strong> Não informado</p>';

            item.innerHTML = `
                <details class="aluno-details">
                    <summary class="aluno-header">
                        <span class="aluno-nome">${aluno.nome}</span>
                    </summary>
                    <div class="aluno-corpo">
                        ${emailContato}
                        <div class="aluno-links">
                            ${linkLinkedin}
                            ${linkLattes}
                        </div>
                    </div>
                </details>
            `;

            listaAlunos.appendChild(item);
        });

    } catch (error) {
        console.error('Erro ao carregar dados da turma:', error);
        listaAlunos.innerHTML = '<p style="color: red;">Erro ao carregar a lista de alunos.</p>';
    }
}
