// ========================================
// AUTENTICAÇÃO E LOGIN
// ========================================

// Usuários de demo (simulados)
const demoUsers = [
  {
    id: 1,
    email: 'admin@treinamentos.com',
    password: '12345678',
    name: 'Admin',
    role: 'Administrador'
  },
  {
    id: 2,
    email: 'professor@treinamentos.com',
    password: 'professor123',
    name: 'Professor',
    role: 'Instrutor'
  },
  {
    id: 3,
    email: 'aluno@treinamentos.com',
    password: 'aluno123',
    name: 'Aluno',
    role: 'Participante'
  }
];

// Array para armazenar usuários cadastrados
let registeredUsers = [];

// Usuário autenticado atual
let currentUser = null;

/**
 * Exibe a tela de login
 */
function showLoginScreen() {
  document.getElementById('login-card').classList.remove('hidden');
  document.getElementById('register-card').classList.add('hidden');
  document.getElementById('login-form').reset();
  document.getElementById('login-email').focus();
  lucide.createIcons();
}

/**
 * Exibe a tela de cadastro
 */
function showRegisterScreen() {
  document.getElementById('login-card').classList.add('hidden');
  document.getElementById('register-card').classList.remove('hidden');
  document.getElementById('register-form').reset();
  document.getElementById('register-name').focus();
  lucide.createIcons();
}

/**
 * Realiza o login do usuário
 * @param {Event} event - Evento do formulário
 */
function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const rememberMe = document.getElementById('remember-me').checked;

  // Verifica primeiro os usuários de demo
  let user = demoUsers.find(u => u.email === email && u.password === password);

  // Se não encontrou nos demo, procura nos usuários cadastrados
  if (!user) {
    user = registeredUsers.find(u => u.email === email && u.password === password);
  }

  if (user) {
    currentUser = user;

    if (rememberMe) {
      localStorage.setItem('rememberedUser', JSON.stringify({
        email: user.email,
        name: user.name
      }));
    } else {
      localStorage.removeItem('rememberedUser');
    }

    updateUserInfo();

    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');

    renderDashboard();

    showToast(`Bem-vindo, ${user.name}!`, 'success');
  } else {
    showToast('Email ou senha incorretos!', 'error');
    document.getElementById('login-password').value = '';
    document.getElementById('login-password').focus();
  }
}

/**
 * Realiza o cadastro de novo usuário
 * @param {Event} event - Evento do formulário
 */
function handleRegister(event) {
  event.preventDefault();

  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const role = document.getElementById('register-role').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;

  if (password.length < 8) {
    showToast('A senha deve ter no mínimo 8 caracteres!', 'error');
    return;
  }

  if (password !== confirmPassword) {
    showToast('As senhas não coincidem!', 'error');
    return;
  }

  const emailExists = demoUsers.find(u => u.email === email) ||
                     registeredUsers.find(u => u.email === email);

  if (emailExists) {
    showToast('Este email já está cadastrado!', 'error');
    return;
  }

  const newUser = {
    id: registeredUsers.length + demoUsers.length + 1,
    email: email,
    password: password,
    name: name,
    role: role
  };

  registeredUsers.push(newUser);

  showToast(`Conta criada com sucesso! Bem-vindo, ${name}!`, 'success');

  currentUser = newUser;
  updateUserInfo();
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  renderDashboard();
}

/**
 * Realiza logout do sistema
 */
function logout() {
  currentUser = null;
  localStorage.removeItem('rememberedUser');

  document.getElementById('login-form').reset();
  document.getElementById('register-form').reset();

  document.getElementById('app').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
  showLoginScreen();

  showToast('Você saiu do sistema', 'info');
}

/**
 * Atualiza informações do usuário na interface
 */
function updateUserInfo() {
  if (currentUser) {
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('menu-user-email').textContent = currentUser.email;
    document.getElementById('menu-user-role').textContent = currentUser.role;
    lucide.createIcons();
  }
}

/**
 * Verifica se há usuário lembrado ao carregar a página
 */
function checkRememberedUser() {
  const remembered = localStorage.getItem('rememberedUser');
  if (remembered) {
    try {
      const userData = JSON.parse(remembered);
      document.getElementById('login-email').value = userData.email;
      document.getElementById('login-email').focus();
    } catch (e) {
      localStorage.removeItem('rememberedUser');
    }
  }
}

// ========================================
// CONFIGURAÇÃO DO SISTEMA
// ========================================

const defaultConfig = {
  system_title: 'Sistema de Gerenciamento de Treinamentos',
  welcome_message: 'Gerencie seus treinamentos de forma simples'
};

let currentConfig = { ...defaultConfig };

// Contador para gerar IDs únicos
let idCounter = 5;

// ID do treinamento a ser excluído (usado no modal de confirmação)
let trainingToDelete = null;

// ========================================
// DADOS SIMULADOS DOS TREINAMENTOS
// ========================================

let trainings = [
  {
    id: 1,
    name: 'Excel Avançado',
    description: 'Domine as principais funcionalidades do Excel, incluindo fórmulas complexas, tabelas dinâmicas e macros.',
    hours: '20 horas',
    area: 'Tecnologia',
    icon: 'table',
    color: 'from-green-600 to-emerald-600',
    lessons: [
      { id: 1, title: 'Introdução ao Excel Avançado', duration: '45 min' },
      { id: 2, title: 'Fórmulas e Funções Complexas', duration: '1h 30min' },
      { id: 3, title: 'Tabelas Dinâmicas', duration: '1h' },
      { id: 4, title: 'Macros e VBA Básico', duration: '2h' }
    ],
    materials: [
      { id: 1, name: 'Apostila Excel Avançado.pdf', type: 'pdf', size: '2.5 MB' },
      { id: 2, name: 'Planilha de Exercícios.xlsx', type: 'excel', size: '1.2 MB' },
      { id: 3, name: 'Slides da Aula.pptx', type: 'presentation', size: '5.8 MB' }
    ]
  },
  {
    id: 2,
    name: 'Liderança e Gestão de Equipes',
    description: 'Aprenda técnicas de liderança, comunicação efetiva e gestão de conflitos para liderar equipes de alta performance.',
    hours: '16 horas',
    area: 'Gestão',
    icon: 'users',
    color: 'from-purple-600 to-violet-600',
    lessons: [
      { id: 1, title: 'Fundamentos da Liderança', duration: '1h' },
      { id: 2, title: 'Estilos de Liderança', duration: '45 min' },
      { id: 3, title: 'Comunicação com a Equipe', duration: '1h 15min' },
      { id: 4, title: 'Gestão de Conflitos', duration: '1h 30min' }
    ],
    materials: [
      { id: 1, name: 'E-book Liderança.pdf', type: 'pdf', size: '3.1 MB' },
      { id: 2, name: 'Cases de Sucesso.pdf', type: 'pdf', size: '1.8 MB' }
    ]
  },
  {
    id: 3,
    name: 'Marketing Digital',
    description: 'Estratégias de marketing digital, SEO, redes sociais, Google Ads e análise de métricas.',
    hours: '24 horas',
    area: 'Marketing',
    icon: 'trending-up',
    color: 'from-pink-600 to-rose-600',
    lessons: [
      { id: 1, title: 'Introdução ao Marketing Digital', duration: '1h' },
      { id: 2, title: 'SEO - Otimização para Buscadores', duration: '2h' },
      { id: 3, title: 'Google Ads na Prática', duration: '1h 45min' },
      { id: 4, title: 'Marketing nas Redes Sociais', duration: '1h 30min' }
    ],
    materials: [
      { id: 1, name: 'Guia de SEO.pdf', type: 'pdf', size: '4.2 MB' },
      { id: 2, name: 'Templates de Posts.pptx', type: 'presentation', size: '8.5 MB' },
      { id: 3, name: 'Checklist Marketing.pdf', type: 'pdf', size: '0.5 MB' }
    ]
  },
  {
    id: 4,
    name: 'Segurança da Informação',
    description: 'Conceitos fundamentais de segurança, proteção de dados, políticas de segurança e prevenção de ataques.',
    hours: '12 horas',
    area: 'Segurança',
    icon: 'shield',
    color: 'from-blue-600 to-cyan-600',
    lessons: [
      { id: 1, title: 'Fundamentos de Segurança', duration: '1h' },
      { id: 2, title: 'Tipos de Ameaças Digitais', duration: '1h 30min' },
      { id: 3, title: 'Proteção de Dados Pessoais', duration: '45 min' },
      { id: 4, title: 'Boas Práticas de Segurança', duration: '1h' }
    ],
    materials: [
      { id: 1, name: 'Manual de Segurança.pdf', type: 'pdf', size: '2.8 MB' },
      { id: 2, name: 'Política de Senhas.docx', type: 'doc', size: '0.3 MB' }
    ]
  }
];

// ========================================
// DADOS SIMULADOS DAS AVALIAÇÕES
// ========================================

const evaluations = [
  { id: 1, trainingId: 1, name: 'Avaliação Excel - Módulo 1', questions: 15, duration: '30 min', status: 'Disponível' },
  { id: 2, trainingId: 1, name: 'Avaliação Excel - Final', questions: 25, duration: '45 min', status: 'Disponível' },
  { id: 3, trainingId: 2, name: 'Avaliação de Liderança', questions: 20, duration: '40 min', status: 'Disponível' },
  { id: 4, trainingId: 2, name: 'Estudo de Caso - Gestão', questions: 5, duration: '60 min', status: 'Disponível' },
  { id: 5, trainingId: 3, name: 'Avaliação Marketing Digital', questions: 30, duration: '50 min', status: 'Disponível' },
  { id: 6, trainingId: 3, name: 'Projeto Prático - Campanha', questions: 3, duration: '120 min', status: 'Disponível' },
  { id: 7, trainingId: 4, name: 'Quiz Segurança - Básico', questions: 10, duration: '15 min', status: 'Disponível' },
  { id: 8, trainingId: 4, name: 'Avaliação Final - Segurança', questions: 20, duration: '35 min', status: 'Disponível' }
];

// ========================================
// FUNÇÕES DE NAVEGAÇÃO
// ========================================

/**
 * Alterna a exibição do menu mobile
 */
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  menu.classList.toggle('hidden');
}

/**
 * Mostra uma seção específica e esconde as outras
 * @param {string} sectionName - Nome da seção a ser exibida
 */
function showSection(sectionName) {
  const sections = ['dashboard', 'trainings', 'evaluations', 'training-detail'];
  sections.forEach(section => {
    const el = document.getElementById(`section-${section}`);
    if (el) {
      el.classList.add('hidden');
      el.classList.remove('fade-in');
    }
  });

  const activeSection = document.getElementById(`section-${sectionName}`);
  if (activeSection) {
    activeSection.classList.remove('hidden');
    void activeSection.offsetWidth;
    activeSection.classList.add('fade-in');
  }

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('bg-white/10');
    if (btn.dataset.section === sectionName) {
      btn.classList.add('bg-white/10');
    }
  });

  if (sectionName === 'trainings') {
    renderTrainings();
  } else if (sectionName === 'evaluations') {
    renderEvaluations();
  } else if (sectionName === 'dashboard') {
    renderDashboard();
  }
}

// ========================================
// FUNÇÕES DE RENDERIZAÇÃO
// ========================================

/**
 * Renderiza o Dashboard com estatísticas e treinamentos recentes
 */
function renderDashboard() {
  document.getElementById('stat-trainings').textContent = trainings.length;
  document.getElementById('stat-lessons').textContent = trainings.reduce((acc, t) => acc + t.lessons.length, 0);
  document.getElementById('stat-materials').textContent = trainings.reduce((acc, t) => acc + t.materials.length, 0);
  document.getElementById('stat-evaluations').textContent = evaluations.length;

  const container = document.getElementById('recent-trainings');
  const recent = trainings.slice(-2).reverse();

  container.innerHTML = recent.map(training => `
    <div class="bg-slate-700/50 rounded-xl p-4 flex items-center gap-4 card-hover cursor-pointer"
         onclick="showTrainingDetail(${training.id})">
      <div class="bg-gradient-to-br ${training.color} p-3 rounded-xl">
        <i data-lucide="${training.icon}" class="w-6 h-6"></i>
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold truncate">${training.name}</h3>
        <p class="text-slate-400 text-sm">${training.area} • ${training.hours}</p>
      </div>
      <i data-lucide="chevron-right" class="w-5 h-5 text-slate-400"></i>
    </div>
  `).join('');

  lucide.createIcons();
}

/**
 * Renderiza a grade de treinamentos
 */
function renderTrainings() {
  const container = document.getElementById('trainings-grid');

  if (trainings.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12">
        <div class="bg-slate-800 rounded-2xl p-8">
          <i data-lucide="book-open" class="w-16 h-16 mx-auto text-slate-600 mb-4"></i>
          <h3 class="text-xl font-semibold text-slate-400 mb-2">Nenhum treinamento cadastrado</h3>
          <p class="text-slate-500 mb-4">Clique no botão acima para adicionar seu primeiro treinamento.</p>
        </div>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = trainings.map(training => `
    <div class="bg-slate-800 rounded-2xl overflow-hidden card-hover group">
      <div class="bg-gradient-to-r ${training.color} p-4">
        <div class="flex items-center justify-between">
          <div class="bg-white/20 p-2 rounded-lg">
            <i data-lucide="${training.icon}" class="w-6 h-6"></i>
          </div>
          <span class="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
            ${training.area}
          </span>
        </div>
      </div>
      <div class="p-5">
        <h3 class="text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors">
          ${training.name}
        </h3>
        <p class="text-slate-400 text-sm mb-4 line-clamp-2">
          ${training.description}
        </p>
        <div class="flex items-center gap-4 text-sm text-slate-500 mb-4">
          <span class="flex items-center gap-1">
            <i data-lucide="clock" class="w-4 h-4"></i>
            ${training.hours}
          </span>
          <span class="flex items-center gap-1">
            <i data-lucide="play-circle" class="w-4 h-4"></i>
            ${training.lessons.length} aulas
          </span>
        </div>
        <div class="flex gap-2">
          <button onclick="showTrainingDetail(${training.id})"
            class="flex-1 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
            <i data-lucide="eye" class="w-4 h-4"></i>
            Ver Aulas
          </button>
          <button onclick="openEditModal(${training.id})"
            class="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all" title="Editar">
            <i data-lucide="edit" class="w-4 h-4"></i>
          </button>
          <button onclick="openDeleteModal(${training.id})"
            class="p-2 bg-slate-700 hover:bg-red-600 rounded-lg transition-all" title="Excluir">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

/**
 * Renderiza os detalhes de um treinamento específico
 * @param {number} id - ID do treinamento
 */
function showTrainingDetail(id) {
  const training = trainings.find(t => t.id === id);
  if (!training) return;

  const container = document.getElementById('training-detail-content');

  container.innerHTML = `
    <button onclick="showSection('trainings')"
      class="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
      <i data-lucide="arrow-left" class="w-5 h-5"></i>
      Voltar para Treinamentos
    </button>

    <div class="bg-gradient-to-r ${training.color} rounded-2xl p-6 mb-6">
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-4">
          <div class="bg-white/20 p-3 rounded-xl">
            <i data-lucide="${training.icon}" class="w-8 h-8"></i>
          </div>
          <div>
            <h1 class="text-2xl font-bold">${training.name}</h1>
            <p class="text-white/80 mt-1">${training.description}</p>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-6 mt-4 text-white/80">
        <span class="flex items-center gap-2">
          <i data-lucide="clock" class="w-4 h-4"></i>
          ${training.hours}
        </span>
        <span class="flex items-center gap-2">
          <i data-lucide="folder" class="w-4 h-4"></i>
          ${training.area}
        </span>
        <span class="flex items-center gap-2">
          <i data-lucide="play-circle" class="w-4 h-4"></i>
          ${training.lessons.length} aulas
        </span>
      </div>
    </div>

    <div class="flex gap-2 mb-6 border-b border-slate-700">
      <button onclick="switchTrainingTab('lessons', ${training.id})"
        class="training-tab px-4 py-3 font-medium border-b-2 border-blue-500 text-blue-400 transition-all flex items-center gap-2"
        data-tab="lessons">
        <i data-lucide="play-circle" class="w-4 h-4"></i>
        Aulas
      </button>
      <button onclick="switchTrainingTab('materials', ${training.id})"
        class="training-tab px-4 py-3 font-medium border-b-2 border-transparent text-slate-400 hover:text-white transition-all flex items-center gap-2"
        data-tab="materials">
        <i data-lucide="file-text" class="w-4 h-4"></i>
        Materiais
      </button>
      <button onclick="switchTrainingTab('evaluations', ${training.id})"
        class="training-tab px-4 py-3 font-medium border-b-2 border-transparent text-slate-400 hover:text-white transition-all flex items-center gap-2"
        data-tab="evaluations">
        <i data-lucide="clipboard-check" class="w-4 h-4"></i>
        Avaliações
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div id="tab-lessons-${training.id}" class="bg-slate-800 rounded-2xl p-6">
        <h2 class="text-lg font-semibold flex items-center gap-2 mb-4">
          <i data-lucide="play-circle" class="w-5 h-5 text-blue-400"></i>
          Aulas do Treinamento
        </h2>
        <div class="space-y-3">
          ${training.lessons.map((lesson, index) => `
            <div class="bg-slate-700/50 rounded-xl p-4 flex items-center gap-4 hover:bg-slate-700 transition-all cursor-pointer">
              <div class="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center font-semibold">
                ${index + 1}
              </div>
              <div class="flex-1">
                <h3 class="font-medium">${lesson.title}</h3>
                <p class="text-slate-400 text-sm flex items-center gap-1">
                  <i data-lucide="clock" class="w-3 h-3"></i>
                  ${lesson.duration}
                </p>
              </div>
              <i data-lucide="play" class="w-5 h-5 text-slate-400"></i>
            </div>
          `).join('')}
        </div>
      </div>

      <div id="tab-materials-${training.id}" class="hidden bg-slate-800 rounded-2xl p-6">
        <h2 class="text-lg font-semibold flex items-center gap-2 mb-4">
          <i data-lucide="file-text" class="w-5 h-5 text-emerald-400"></i>
          Materiais de Apoio
        </h2>
        <div class="space-y-3">
          ${training.materials.map(material => `
            <div class="bg-slate-700/50 rounded-xl p-4 flex items-center gap-4 hover:bg-slate-700 transition-all">
              <div class="${getMaterialColor(material.type)} w-10 h-10 rounded-lg flex items-center justify-center">
                <i data-lucide="${getMaterialIcon(material.type)}" class="w-5 h-5"></i>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-medium truncate">${material.name}</h3>
                <p class="text-slate-400 text-sm">${material.size}</p>
              </div>
              <button onclick="showToast('Download iniciado: ${material.name}', 'success')"
                class="p-2 bg-slate-600 hover:bg-blue-600 rounded-lg transition-all" title="Baixar">
                <i data-lucide="download" class="w-4 h-4"></i>
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <div id="tab-evaluations-${training.id}" class="hidden col-span-1 lg:col-span-2 bg-slate-800 rounded-2xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold flex items-center gap-2">
            <i data-lucide="clipboard-check" class="w-5 h-5 text-amber-400"></i>
            Avaliações e Provas
          </h2>
          <button onclick="openUploadEvaluationModal(${training.id})"
            class="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2">
            <i data-lucide="plus" class="w-4 h-4"></i>
            Adicionar Avaliação
          </button>
        </div>
        <div id="evaluations-list-${training.id}" class="space-y-3"></div>
      </div>
    </div>
  `;

  showSection('training-detail');
  lucide.createIcons();
}

/**
 * Renderiza a lista de avaliações
 */
function renderEvaluations() {
  const container = document.getElementById('evaluations-list');

  const groupedEvaluations = {};
  evaluations.forEach(evaluation => {
    const training = trainings.find(t => t.id === evaluation.trainingId);
    if (training) {
      if (!groupedEvaluations[training.id]) {
        groupedEvaluations[training.id] = { training: training, evaluations: [] };
      }
      groupedEvaluations[training.id].evaluations.push(evaluation);
    }
  });

  container.innerHTML = Object.values(groupedEvaluations).map(group => `
    <div class="bg-slate-800 rounded-2xl overflow-hidden">
      <div class="bg-gradient-to-r ${group.training.color} px-6 py-4 flex items-center gap-3">
        <div class="bg-white/20 p-2 rounded-lg">
          <i data-lucide="${group.training.icon}" class="w-5 h-5"></i>
        </div>
        <div>
          <h3 class="font-semibold">${group.training.name}</h3>
          <p class="text-white/70 text-sm">${group.evaluations.length} avaliações disponíveis</p>
        </div>
      </div>
      <div class="p-4 space-y-3">
        ${group.evaluations.map(evaluation => `
          <div class="bg-slate-700/50 rounded-xl p-4 flex items-center justify-between hover:bg-slate-700 transition-all">
            <div class="flex items-center gap-4">
              <div class="bg-amber-600/20 p-2 rounded-lg">
                <i data-lucide="clipboard-list" class="w-5 h-5 text-amber-400"></i>
              </div>
              <div>
                <h4 class="font-medium">${evaluation.name}</h4>
                <div class="flex items-center gap-4 text-sm text-slate-400 mt-1">
                  <span class="flex items-center gap-1">
                    <i data-lucide="help-circle" class="w-3 h-3"></i>
                    ${evaluation.questions} questões
                  </span>
                  <span class="flex items-center gap-1">
                    <i data-lucide="clock" class="w-3 h-3"></i>
                    ${evaluation.duration}
                  </span>
                </div>
              </div>
            </div>
            <button onclick="showToast('Avaliação iniciada: ${evaluation.name}', 'success')"
              class="bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2">
              <i data-lucide="play" class="w-4 h-4"></i>
              Iniciar
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

// ========================================
// FUNÇÕES DE MODAL (CRUD)
// ========================================

/**
 * Abre o modal para adicionar novo treinamento
 */
function openAddModal() {
  document.getElementById('modal-title').textContent = 'Novo Treinamento';
  document.getElementById('modal-submit-text').textContent = 'Cadastrar';
  document.getElementById('training-form').reset();
  document.getElementById('training-id').value = '';
  document.getElementById('modal-training').classList.remove('hidden');
  lucide.createIcons();
}

/**
 * Abre o modal para editar um treinamento existente
 * @param {number} id - ID do treinamento a ser editado
 */
function openEditModal(id) {
  const training = trainings.find(t => t.id === id);
  if (!training) return;

  document.getElementById('modal-title').textContent = 'Editar Treinamento';
  document.getElementById('modal-submit-text').textContent = 'Salvar';
  document.getElementById('training-id').value = training.id;
  document.getElementById('training-name').value = training.name;
  document.getElementById('training-description').value = training.description;
  document.getElementById('training-hours').value = training.hours;
  document.getElementById('training-area').value = training.area;

  document.getElementById('modal-training').classList.remove('hidden');
  lucide.createIcons();
}

/**
 * Fecha o modal de adicionar/editar
 */
function closeModal() {
  document.getElementById('modal-training').classList.add('hidden');
}

/**
 * Abre o modal de confirmação de exclusão
 * @param {number} id - ID do treinamento a ser excluído
 */
function openDeleteModal(id) {
  const training = trainings.find(t => t.id === id);
  if (!training) return;

  trainingToDelete = id;
  document.getElementById('delete-message').textContent =
    `Deseja realmente excluir o treinamento "${training.name}"?`;
  document.getElementById('modal-delete').classList.remove('hidden');
  lucide.createIcons();
}

/**
 * Fecha o modal de confirmação de exclusão
 */
function closeDeleteModal() {
  document.getElementById('modal-delete').classList.add('hidden');
  trainingToDelete = null;
}

/**
 * Confirma a exclusão do treinamento
 */
function confirmDelete() {
  if (trainingToDelete === null) return;

  trainings = trainings.filter(t => t.id !== trainingToDelete);

  closeDeleteModal();
  renderTrainings();
  showToast('Treinamento excluído com sucesso!', 'success');
}

/**
 * Salva o treinamento (adicionar ou editar)
 * @param {Event} event - Evento do formulário
 */
function saveTraining(event) {
  event.preventDefault();

  const id = document.getElementById('training-id').value;
  const name = document.getElementById('training-name').value;
  const description = document.getElementById('training-description').value;
  const hours = document.getElementById('training-hours').value;
  const area = document.getElementById('training-area').value;

  const areaConfig = {
    'Tecnologia': { icon: 'laptop', color: 'from-blue-600 to-cyan-600' },
    'Gestão': { icon: 'users', color: 'from-purple-600 to-violet-600' },
    'Marketing': { icon: 'trending-up', color: 'from-pink-600 to-rose-600' },
    'Finanças': { icon: 'dollar-sign', color: 'from-green-600 to-emerald-600' },
    'Comunicação': { icon: 'message-circle', color: 'from-orange-600 to-amber-600' },
    'Segurança': { icon: 'shield', color: 'from-red-600 to-rose-600' }
  };

  const config = areaConfig[area] || { icon: 'book', color: 'from-slate-600 to-slate-700' };

  if (id) {
    const index = trainings.findIndex(t => t.id === parseInt(id));
    if (index !== -1) {
      trainings[index] = {
        ...trainings[index],
        name, description, hours, area,
        icon: config.icon,
        color: config.color
      };
    }
    showToast('Treinamento atualizado com sucesso!', 'success');
  } else {
    const newTraining = {
      id: idCounter++,
      name, description, hours, area,
      icon: config.icon,
      color: config.color,
      lessons: [
        { id: 1, title: 'Introdução ao ' + name, duration: '1h' },
        { id: 2, title: 'Conceitos Fundamentais', duration: '1h 30min' }
      ],
      materials: [
        { id: 1, name: 'Material de Apoio.pdf', type: 'pdf', size: '1.5 MB' }
      ]
    };
    trainings.push(newTraining);
    showToast('Treinamento cadastrado com sucesso!', 'success');
  }

  closeModal();
  renderTrainings();
}

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

/**
 * Retorna o ícone apropriado para o tipo de material
 * @param {string} type - Tipo do material
 * @returns {string} Nome do ícone Lucide
 */
function getMaterialIcon(type) {
  const icons = {
    'pdf': 'file-text',
    'excel': 'table',
    'presentation': 'presentation',
    'doc': 'file'
  };
  return icons[type] || 'file';
}

/**
 * Retorna a cor de fundo para o tipo de material
 * @param {string} type - Tipo do material
 * @returns {string} Classes CSS de cor
 */
function getMaterialColor(type) {
  const colors = {
    'pdf': 'bg-red-600/20 text-red-400',
    'excel': 'bg-green-600/20 text-green-400',
    'presentation': 'bg-orange-600/20 text-orange-400',
    'doc': 'bg-blue-600/20 text-blue-400'
  };
  return colors[type] || 'bg-slate-600/20 text-slate-400';
}

/**
 * Exibe uma notificação toast
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo da notificação (success, error, info)
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');

  const colors = {
    'success': 'bg-green-600',
    'error': 'bg-red-600',
    'info': 'bg-blue-600'
  };

  const icons = {
    'success': 'check-circle',
    'error': 'x-circle',
    'info': 'info'
  };

  toast.className = `toast ${colors[type]} px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-72`;
  toast.innerHTML = `
    <i data-lucide="${icons[type]}" class="w-5 h-5"></i>
    <span class="flex-1">${message}</span>
    <button onclick="this.parentElement.remove()" class="p-1 hover:bg-white/20 rounded-lg">
      <i data-lucide="x" class="w-4 h-4"></i>
    </button>
  `;

  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    if (toast.parentElement) toast.remove();
  }, 4000);
}

// ========================================
// INTEGRAÇÃO COM CANVA (Element SDK)
// ========================================

/**
 * Atualiza a interface com as configurações do Canva
 * @param {Object} config - Objeto de configuração
 */
async function updateUI(config) {
  document.getElementById('system-title').textContent = config.system_title || defaultConfig.system_title;
  document.getElementById('welcome-message').textContent = config.welcome_message || defaultConfig.welcome_message;
}

if (window.elementSdk) {
  window.elementSdk.init({
    defaultConfig: defaultConfig,
    onConfigChange: async (config) => {
      currentConfig = { ...defaultConfig, ...config };
      await updateUI(currentConfig);
    },
    mapToCapabilities: (config) => ({
      recolorables: [],
      borderables: [],
      fontEditable: undefined,
      fontSizeable: undefined
    }),
    mapToEditPanelValues: (config) => new Map([
      ['system_title', config.system_title || defaultConfig.system_title],
      ['welcome_message', config.welcome_message || defaultConfig.welcome_message]
    ])
  });
}

// ========================================
// ABAS DO TREINAMENTO
// ========================================

/**
 * Alterna entre abas na tela de detalhes do treinamento
 * @param {string} tab - Nome da aba (lessons, materials, evaluations)
 * @param {number} trainingId - ID do treinamento
 */
function switchTrainingTab(tab, trainingId) {
  const tabs = ['lessons', 'materials', 'evaluations'];
  tabs.forEach(t => {
    const element = document.getElementById(`tab-${t}-${trainingId}`);
    if (element) element.classList.add('hidden');
  });

  const activeTab = document.getElementById(`tab-${tab}-${trainingId}`);
  if (activeTab) activeTab.classList.remove('hidden');

  document.querySelectorAll('.training-tab').forEach(btn => {
    btn.classList.remove('border-b-blue-500', 'text-blue-400');
    btn.classList.add('border-b-transparent', 'text-slate-400');
  });

  const activeBtn = document.querySelector(`.training-tab[data-tab="${tab}"]`);
  if (activeBtn) {
    activeBtn.classList.remove('border-b-transparent', 'text-slate-400');
    activeBtn.classList.add('border-b-blue-500', 'text-blue-400');
  }

  if (tab === 'evaluations') {
    renderTrainingEvaluations(trainingId);
  }

  lucide.createIcons();
}

// ========================================
// FUNÇÕES DE AVALIAÇÃO (POR TREINAMENTO)
// ========================================

/**
 * Abre o modal de upload/edição de avaliação
 * @param {number} trainingId - ID do treinamento
 * @param {number|null} evaluationId - ID da avaliação (opcional, para edição)
 */
function openUploadEvaluationModal(trainingId, evaluationId = null) {
  const training = trainings.find(t => t.id === trainingId);
  if (!training) return;

  document.getElementById('evaluation-training-id').value = trainingId;
  document.getElementById('evaluation-id').value = evaluationId || '';
  document.getElementById('evaluation-form').reset();
  document.getElementById('file-name').textContent = '';
  document.getElementById('file-existing').textContent = '';

  if (evaluationId) {
    const evaluation = training.evaluations.find(e => e.id === evaluationId);
    if (!evaluation) return;

    document.getElementById('modal-eval-title').innerHTML = '<i data-lucide="edit" class="w-5 h-5"></i> Editar Avaliação';
    document.getElementById('eval-submit-text').textContent = 'Atualizar Avaliação';
    document.getElementById('evaluation-name').value = evaluation.name;
    document.getElementById('evaluation-description').value = evaluation.description;
    document.getElementById('evaluation-date').value = evaluation.date || '';
    document.getElementById('evaluation-duration').value = evaluation.duration;
    document.getElementById('file-existing').textContent = `Arquivo atual: ${evaluation.file}`;
  } else {
    document.getElementById('modal-eval-title').innerHTML = '<i data-lucide="clipboard-check" class="w-5 h-5"></i> Adicionar Avaliação';
    document.getElementById('eval-submit-text').textContent = 'Adicionar Avaliação';
  }

  document.getElementById('modal-evaluation').classList.remove('hidden');
  lucide.createIcons();
}

/**
 * Fecha o modal de upload de avaliação
 */
function closeEvaluationModal() {
  document.getElementById('modal-evaluation').classList.add('hidden');
  document.getElementById('evaluation-form').reset();
  document.getElementById('file-name').textContent = '';
  document.getElementById('file-existing').textContent = '';
}

/**
 * Salva uma nova avaliação ou atualiza uma existente
 * @param {Event} event - Evento do formulário
 */
function saveEvaluation(event) {
  event.preventDefault();

  const trainingId = parseInt(document.getElementById('evaluation-training-id').value);
  const evaluationId = document.getElementById('evaluation-id').value
    ? parseInt(document.getElementById('evaluation-id').value)
    : null;
  const name = document.getElementById('evaluation-name').value;
  const description = document.getElementById('evaluation-description').value;
  const date = document.getElementById('evaluation-date').value;
  const duration = document.getElementById('evaluation-duration').value;
  const fileInput = document.getElementById('evaluation-file');

  const training = trainings.find(t => t.id === trainingId);
  if (!training) return;

  if (!training.evaluations) training.evaluations = [];

  if (evaluationId) {
    const evaluation = training.evaluations.find(e => e.id === evaluationId);
    if (!evaluation) return;

    evaluation.name = name;
    evaluation.description = description;
    evaluation.date = date || evaluation.date;
    evaluation.duration = duration;

    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      if (file.size > 50 * 1024 * 1024) {
        showToast('O arquivo não pode ultrapassar 50MB!', 'error');
        return;
      }
      evaluation.file = file.name;
    }

    evaluation.lastModified = new Date().toLocaleDateString('pt-BR');
    showToast(`Avaliação "${name}" atualizada com sucesso!`, 'success');
  } else {
    if (!fileInput.files || !fileInput.files[0]) {
      showToast('Por favor, selecione um arquivo!', 'error');
      return;
    }

    const file = fileInput.files[0];
    if (file.size > 50 * 1024 * 1024) {
      showToast('O arquivo não pode ultrapassar 50MB!', 'error');
      return;
    }

    const newEvaluation = {
      id: (Math.max(...training.evaluations.map(e => e.id), 0)) + 1,
      name, description,
      date: date || null,
      duration,
      file: file.name,
      uploadDate: new Date().toLocaleDateString('pt-BR'),
      lastModified: null
    };

    training.evaluations.push(newEvaluation);
    showToast(`Avaliação "${name}" adicionada com sucesso!`, 'success');
  }

  closeEvaluationModal();
  renderTrainingEvaluations(trainingId);
}

/**
 * Renderiza as avaliações de um treinamento
 * @param {number} trainingId - ID do treinamento
 */
function renderTrainingEvaluations(trainingId) {
  const training = trainings.find(t => t.id === trainingId);
  const container = document.getElementById(`evaluations-list-${trainingId}`);

  if (!training || !training.evaluations || training.evaluations.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-slate-400">
        <i data-lucide="inbox" class="w-12 h-12 mx-auto mb-2 opacity-50"></i>
        <p>Nenhuma avaliação adicionada ainda</p>
        <p class="text-xs mt-1">Clique no botão acima para adicionar uma avaliação</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = training.evaluations.map(evaluation => `
    <div class="bg-slate-700/50 rounded-xl p-4 flex items-start gap-4 hover:bg-slate-700 transition-all">
      <div class="bg-amber-600/20 p-3 rounded-lg flex-shrink-0">
        <i data-lucide="clipboard-list" class="w-5 h-5 text-amber-400"></i>
      </div>
      <div class="flex-1 min-w-0">
        <h4 class="font-semibold text-white text-base">${evaluation.name}</h4>
        <p class="text-slate-400 text-sm mt-1">${evaluation.description}</p>
        <div class="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-3">
          <span class="flex items-center gap-1">
            <i data-lucide="clock" class="w-3 h-3"></i>
            ${evaluation.duration}
          </span>
          <span class="flex items-center gap-1">
            <i data-lucide="file" class="w-3 h-3"></i>
            ${evaluation.file}
          </span>
          ${evaluation.date ? `<span class="flex items-center gap-1">
            <i data-lucide="calendar" class="w-3 h-3"></i>
            ${evaluation.date}
          </span>` : ''}
          <span class="text-slate-600">Adicionado em ${evaluation.uploadDate}</span>
          ${evaluation.lastModified ? `<span class="text-slate-600">Modificado em ${evaluation.lastModified}</span>` : ''}
        </div>
      </div>
      <div class="flex items-center gap-2 flex-shrink-0">
        <button onclick="downloadEvaluation('${evaluation.file}')"
          class="p-2 bg-amber-600/20 hover:bg-amber-600 text-amber-400 hover:text-white rounded-lg transition-all" title="Baixar avaliação">
          <i data-lucide="download" class="w-4 h-4"></i>
        </button>
        <button onclick="openUploadEvaluationModal(${trainingId}, ${evaluation.id})"
          class="p-2 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg transition-all" title="Editar avaliação">
          <i data-lucide="edit" class="w-4 h-4"></i>
        </button>
        <button onclick="deleteEvaluation(${trainingId}, ${evaluation.id})"
          class="p-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-all" title="Excluir avaliação">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

/**
 * Simula o download de uma avaliação
 * @param {string} fileName - Nome do arquivo
 */
function downloadEvaluation(fileName) {
  showToast(`Download iniciado: ${fileName}`, 'success');
}

/**
 * Deleta uma avaliação
 * @param {number} trainingId - ID do treinamento
 * @param {number} evaluationId - ID da avaliação
 */
function deleteEvaluation(trainingId, evaluationId) {
  const training = trainings.find(t => t.id === trainingId);
  if (training && training.evaluations) {
    training.evaluations = training.evaluations.filter(e => e.id !== evaluationId);
    showToast('Avaliação removida com sucesso!', 'success');
    renderTrainingEvaluations(trainingId);
  }
}

// Listener para o input de arquivo
document.addEventListener('change', function (e) {
  if (e.target.id === 'evaluation-file') {
    const fileName = e.target.files[0]?.name || '';
    document.getElementById('file-name').textContent = fileName ? `Arquivo selecionado: ${fileName}` : '';
  }
});

const alunos = [
{nome:"Ana", pontos:980},
{nome:"Carlos", pontos:870},
{nome:"Maria", pontos:820},
{nome:"João", pontos:760},
{nome:"Lucas", pontos:700},
{nome:"Fernanda", pontos:640},
{nome:"Pedro", pontos:600}
];

alunos.sort((a,b)=>b.pontos-a.pontos);

const podium = document.getElementById("podium");
const rankingList = document.getElementById("ranking-list");

/* PODIO */

function renderPodium(){

const top3 = [alunos[1], alunos[0], alunos[2]];

const classes = ["second","first","third"];
const medals = ["🥈","🥇","🥉"];

top3.forEach((player,i)=>{

const div = document.createElement("div");

div.className="podium-player";

div.innerHTML = `
<div class="podium-name">${player.nome}</div>
<div class="podium-box ${classes[i]}">${medals[i]}</div>
<div class="podium-score">${player.pontos} pts</div>
`;

podium.appendChild(div);

});

}

/* LISTA */

function renderRanking(){

const maxPoints = alunos[0].pontos;

alunos.slice(3).forEach((player,index)=>{

const percent = (player.pontos / maxPoints) * 100;

const item = document.createElement("div");

item.className="rank-item";

item.style.animationDelay = `${index*0.1}s`;

item.innerHTML=`

<div class="rank-number">${index+4}</div>

<div style="flex:1">
<div>${player.nome}</div>
<div class="rank-bar">
<div class="rank-progress" style="width:${percent}%"></div>
</div>
</div>

<div class="rank-score">${player.pontos}</div>

`;

rankingList.appendChild(item);

});

}

renderPodium();
renderRanking();
