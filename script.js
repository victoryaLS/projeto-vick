// ============================================================
// CAPACITAHUB — script.js
// ============================================================

// ============================================================
// DATA
// ============================================================

const DEMO_USERS = [
  { id: 1, email: 'admin@capacitahub.com', password: 'admin123', name: 'Admin Master', role: 'Administrador', points: 9999, avatar: 'A' },
  { id: 2, email: 'prof@capacitahub.com', password: 'prof123', name: 'Prof. Carlos Lima', role: 'Professor', points: 1540, avatar: 'C' },
  { id: 3, email: 'aluno@capacitahub.com', password: 'aluno123', name: 'Maria Eduarda', role: 'Aluno', points: 820, avatar: 'M' }
];

let registeredUsers = JSON.parse(localStorage.getItem('ch_users') || '[]');
let currentUser = null;
let itemToDelete = null;
let activeQuiz = null;

const RANKING_DATA = [
  { nome: 'Ana Luiza', pts: 2350, av: 'AL' },
  { nome: 'Carlos Mendes', pts: 2180, av: 'CM' },
  { nome: 'Maria Silva', pts: 1990, av: 'MS' },
  { nome: 'João Pedro', pts: 1720, av: 'JP' },
  { nome: 'Fernanda Costa', pts: 1580, av: 'FC' },
  { nome: 'Rafael Souza', pts: 1340, av: 'RS' },
  { nome: 'Juliana Neves', pts: 1120, av: 'JN' },
  { nome: 'Bruno Alves', pts: 980, av: 'BA' },
  { nome: 'Larissa Lima', pts: 860, av: 'LL' },
  { nome: 'Diego Martins', pts: 720, av: 'DM' }
];

let trainings = [
  {
    id: 1, name: 'Excel Avançado', description: 'Domine as principais funcionalidades do Excel: fórmulas complexas, tabelas dinâmicas e macros.',
    hours: '20h', area: 'Tecnologia', icon: 'table-2', color: 'from-emerald-500 to-teal-600', bgColor: 'rgba(16,185,129,0.15)',
    lessons: [
      { id: 1, title: 'Introdução ao Excel Avançado', duration: '45 min', thumb: '📊' },
      { id: 2, title: 'Fórmulas e Funções Complexas', duration: '1h 30min', thumb: '🔢' },
      { id: 3, title: 'Tabelas Dinâmicas na Prática', duration: '1h', thumb: '📈' },
      { id: 4, title: 'Macros e VBA Básico', duration: '2h', thumb: '⚙️' }
    ],
    quiz: [
      { q: 'Qual atalho salva o arquivo no Excel?', opts: ['Ctrl+S', 'Ctrl+P', 'Alt+S', 'F12'], correct: 0 },
      { q: 'O que é uma Tabela Dinâmica?', opts: ['Um tipo de gráfico', 'Uma ferramenta de resumo de dados', 'Uma macro automática', 'Um tipo de fórmula'], correct: 1 },
      { q: 'Qual função retorna o maior valor de um intervalo?', opts: ['MAX()', 'MAIOR()', 'TOP()', 'HIGH()'], correct: 0 }
    ]
  },
  {
    id: 2, name: 'Liderança e Gestão', description: 'Técnicas de liderança, comunicação efetiva e gestão de conflitos para equipes de alta performance.',
    hours: '16h', area: 'Gestão', icon: 'users', color: 'from-purple-500 to-violet-600', bgColor: 'rgba(139,92,246,0.15)',
    lessons: [
      { id: 1, title: 'Fundamentos da Liderança', duration: '1h', thumb: '🎯' },
      { id: 2, title: 'Estilos de Liderança', duration: '45 min', thumb: '🧭' },
      { id: 3, title: 'Comunicação com a Equipe', duration: '1h 15min', thumb: '💬' },
      { id: 4, title: 'Gestão de Conflitos', duration: '1h 30min', thumb: '🤝' }
    ],
    quiz: [
      { q: 'O que caracteriza um líder transformacional?', opts: ['Foca em regras e punições', 'Inspira e motiva a equipe', 'Delega tudo sem acompanhar', 'Controla todos os detalhes'], correct: 1 },
      { q: 'Qual é a primeira etapa da resolução de conflitos?', opts: ['Punir os envolvidos', 'Ignorar o problema', 'Identificar a causa raiz', 'Demitir alguém'], correct: 2 }
    ]
  },
  {
    id: 3, name: 'Marketing Digital', description: 'Estratégias de marketing digital, SEO, redes sociais, Google Ads e análise de métricas.',
    hours: '24h', area: 'Marketing', icon: 'trending-up', color: 'from-pink-500 to-rose-600', bgColor: 'rgba(244,63,94,0.15)',
    lessons: [
      { id: 1, title: 'Introdução ao Marketing Digital', duration: '1h', thumb: '🌐' },
      { id: 2, title: 'SEO — Otimização para Buscadores', duration: '2h', thumb: '🔍' },
      { id: 3, title: 'Google Ads na Prática', duration: '1h 45min', thumb: '📢' },
      { id: 4, title: 'Marketing nas Redes Sociais', duration: '1h 30min', thumb: '📱' }
    ],
    quiz: [
      { q: 'O que significa SEO?', opts: ['Search Engine Optimization', 'Social Engagement Online', 'Site Editor Options', 'Search Engagement Overview'], correct: 0 },
      { q: 'Qual métrica indica a taxa de cliques em anúncios?', opts: ['CPC', 'CTR', 'CPM', 'ROI'], correct: 1 },
      { q: 'Qual rede social tem maior foco em conteúdo profissional?', opts: ['Instagram', 'TikTok', 'LinkedIn', 'Twitter'], correct: 2 }
    ]
  },
  {
    id: 4, name: 'Segurança da Informação', description: 'Conceitos fundamentais de segurança, proteção de dados, políticas de segurança e prevenção de ataques.',
    hours: '12h', area: 'Segurança', icon: 'shield', color: 'from-blue-500 to-cyan-600', bgColor: 'rgba(59,130,246,0.15)',
    lessons: [
      { id: 1, title: 'Fundamentos de Segurança', duration: '1h', thumb: '🔒' },
      { id: 2, title: 'Tipos de Ameaças Digitais', duration: '1h 30min', thumb: '🦠' },
      { id: 3, title: 'Proteção de Dados Pessoais (LGPD)', duration: '45 min', thumb: '📋' },
      { id: 4, title: 'Boas Práticas de Segurança', duration: '1h', thumb: '✅' }
    ],
    quiz: [
      { q: 'O que é phishing?', opts: ['Um tipo de vírus', 'Tentativa de enganar usuários para obter dados', 'Um firewall', 'Uma técnica de criptografia'], correct: 1 },
      { q: 'O que significa LGPD?', opts: ['Lei Geral de Proteção de Dados', 'Lei Geral Para Dados', 'Lei Governamental de Proteção Digital', 'Lei Geral de Privacidade Digital'], correct: 0 }
    ]
  }
];

let evaluations = [
  { id: 1, trainingId: 1, name: 'Avaliação Excel — Módulo 1', questions: 15, duration: '30 min', maxScore: 100, myScore: 87 },
  { id: 2, trainingId: 1, name: 'Avaliação Excel — Final', questions: 25, duration: '45 min', maxScore: 100, myScore: null },
  { id: 3, trainingId: 2, name: 'Avaliação de Liderança', questions: 20, duration: '40 min', maxScore: 100, myScore: 92 },
  { id: 4, trainingId: 3, name: 'Avaliação Marketing Digital', questions: 30, duration: '50 min', maxScore: 100, myScore: 78 },
  { id: 5, trainingId: 4, name: 'Quiz Segurança — Básico', questions: 10, duration: '15 min', maxScore: 50, myScore: 45 },
  { id: 6, trainingId: 4, name: 'Avaliação Final — Segurança', questions: 20, duration: '35 min', maxScore: 100, myScore: null }
];

let certificates = [
  { id: 1, studentName: 'Ana Luiza', trainingId: 1, date: '2024-11-15', issued: true },
  { id: 2, studentName: 'Carlos Mendes', trainingId: 2, date: '2024-12-01', issued: true }
];

let idCounter = 100;

// ============================================================
// AUTH
// ============================================================

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const remember = document.getElementById('remember-me').checked;

  let user = DEMO_USERS.find(u => u.email === email && u.password === password);
  if (!user) user = registeredUsers.find(u => u.email === email && u.password === password);

  if (user) {
    currentUser = { ...user };
    if (remember) {
      localStorage.setItem('ch_remember', JSON.stringify({ email: user.email, password: user.password }));
    } else {
      localStorage.removeItem('ch_remember');
    }
    enterApp();
    showToast(`Bem-vindo, ${user.name}! 🎉`, 'success');
  } else {
    showToast('E-mail ou senha incorretos!', 'error');
    document.getElementById('login-password').value = '';
  }
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('register-name').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const role = document.getElementById('register-role').value;
  const pass = document.getElementById('register-password').value;
  const confirm = document.getElementById('register-confirm-password').value;

  if (pass.length < 8) return showToast('A senha precisa ter mínimo 8 caracteres.', 'error');
  if (pass !== confirm) return showToast('As senhas não coincidem!', 'error');

  const allUsers = [...DEMO_USERS, ...registeredUsers];
  if (allUsers.find(u => u.email === email)) return showToast('Este e-mail já está cadastrado!', 'error');

  const newUser = { id: idCounter++, email, password: pass, name, role, points: 0, avatar: name[0].toUpperCase() };
  registeredUsers.push(newUser);
  localStorage.setItem('ch_users', JSON.stringify(registeredUsers));

  currentUser = { ...newUser };
  enterApp();
  showToast(`Conta criada com sucesso! Bem-vindo, ${name}! 🚀`, 'success');
}

function enterApp() {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  updateHeaderUI();
  showSection('dashboard');

  // Show admin-only nav
// Aluno vê certificados
if (currentUser.role === 'Aluno') {
  document.getElementById('nav-certificates').classList.remove('hidden');
  document.getElementById('nav-certificates-mobile').classList.remove('hidden');
}

// Professor vê controle da turma
if (currentUser.role === 'Professor') {
  document.getElementById('nav-class').classList.remove('hidden');
  document.getElementById('nav-class-mobile').classList.remove('hidden');
}
  
}

function logout() {
  currentUser = null;
  document.getElementById('app').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('login-form').reset();
  document.getElementById('register-form').reset();
  showLoginScreen();
  showToast('Você saiu. Até logo!', 'info');
}

function updateHeaderUI() {
  if (!currentUser) return;
  const initials = currentUser.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
  document.getElementById('header-avatar').textContent = initials;
  document.getElementById('user-name').textContent = currentUser.name;
  document.getElementById('user-role-badge').textContent = currentUser.role;
  document.getElementById('menu-user-name').textContent = currentUser.name;
  document.getElementById('menu-user-email').textContent = currentUser.email;
  document.getElementById('menu-user-role').textContent = currentUser.role;

  // Profile section
  const bigAv = document.getElementById('big-avatar');
  const bigName = document.getElementById('big-name');
  const bigEmail = document.getElementById('big-email');
  const bigRole = document.getElementById('big-role');
  if (bigAv) bigAv.textContent = initials;
  if (bigName) bigName.textContent = currentUser.name;
  if (bigEmail) bigEmail.textContent = currentUser.email;
  if (bigRole) bigRole.textContent = currentUser.role;

  // Profile avatar mini
  ['profile-avatar-lg', 'profile-avatar-small'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = initials;
  });
  const profileName = document.getElementById('profile-name');
  const profileRole = document.getElementById('profile-role');
  const profilePoints = document.getElementById('profile-points');
  if (profileName) profileName.textContent = currentUser.name;
  if (profileRole) profileRole.textContent = currentUser.role;
  lucide.createIcons();
}

function isAdmin() { return currentUser && currentUser.role === 'Administrador'; }
function isProfOrAdmin() { return currentUser && (currentUser.role === 'Administrador' || currentUser.role === 'Professor'); }

function showLoginScreen() {
  document.getElementById('login-card').classList.remove('hidden');
  document.getElementById('register-card').classList.add('hidden');
}
function showRegisterScreen() {
  document.getElementById('login-card').classList.add('hidden');
  document.getElementById('register-card').classList.remove('hidden');
}

function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  const isText = input.type === 'text';
  input.type = isText ? 'password' : 'text';
  btn.innerHTML = isText
    ? '<i data-lucide="eye" class="w-4 h-4"></i>'
    : '<i data-lucide="eye-off" class="w-4 h-4"></i>';
  lucide.createIcons();
}

function toggleProfileMenu() {
  const menu = document.getElementById('profile-menu');
  menu.classList.toggle('hidden');
}

document.addEventListener('click', e => {
  const menu = document.getElementById('profile-menu');
  const btn = e.target.closest('.profile-btn');
  if (!btn && menu && !menu.classList.contains('hidden')) {
    menu.classList.add('hidden');
  }
});

// ============================================================
// NAVIGATION
// ============================================================

function showSection(name) {
  const sections = ['dashboard', 'trainings', 'evaluations', 'training-detail', 'certificates', 'profile', 'quiz'];
  sections.forEach(s => {
    const el = document.getElementById(`section-${s}`);
    if (el) el.classList.add('hidden');
  });
  const active = document.getElementById(`section-${name}`);
  if (active) {
    active.classList.remove('hidden');
    void active.offsetWidth;
    active.style.animation = 'none';
    requestAnimationFrame(() => { active.style.animation = ''; });
  }
  else if (name === 'class') renderClassControl();

  // Update nav active state
  document.querySelectorAll('.nav-btn, .nav-btn-mobile').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.section === name) btn.classList.add('active');
  });

  // Render section
  if (name === 'dashboard') renderDashboard();
  else if (name === 'trainings') renderTrainings();
  else if (name === 'evaluations') renderEvaluations();
  else if (name === 'certificates') renderCertificates();
  else if (name === 'profile') renderProfile();
}

// ============================================================
// DASHBOARD
// ============================================================

function renderDashboard() {
  document.getElementById('stat-trainings').textContent = trainings.length;
  document.getElementById('stat-lessons').textContent = trainings.reduce((a, t) => a + t.lessons.length, 0);
  document.getElementById('stat-evaluations').textContent = evaluations.length;

  renderRanking();
  renderDashboardCourses();
  updateHeaderUI();
}

function renderRanking() {
  const podium = document.getElementById('podium');
  const list = document.getElementById('ranking-list');
  if (!podium || !list) return;

  podium.innerHTML = '';
  list.innerHTML = '';

  const sorted = [...RANKING_DATA].sort((a, b) => b.pts - a.pts);
  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  // Podium order: 2nd, 1st, 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]];
  const classes = ['p-second', 'p-first', 'p-third'];
  const avClasses = ['av-silver', 'av-gold', 'av-bronze'];
  const medals = ['🥈', '🥇', '🥉'];
  const ranks = [2, 1, 3];
  const delays = [0.2, 0, 0.4];

  podiumOrder.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'podium-player';
    div.style.animationDelay = `${delays[i]}s`;
    div.innerHTML = `
      <div class="podium-avatar ${avClasses[i]}">${p.av}</div>
      <div class="podium-name">${p.nome.split(' ')[0]}</div>
      <div class="podium-box ${classes[i]}">
        <div class="podium-medal">${medals[i]}</div>
        <div class="podium-rank-num">${ranks[i]}</div>
      </div>
      <div class="podium-pts">${p.pts.toLocaleString()} pts</div>
    `;
    podium.appendChild(div);
  });

  const maxPts = sorted[0].pts;
  rest.forEach((p, i) => {
    const pct = Math.round((p.pts / maxPts) * 100);
    const item = document.createElement('div');
    item.className = 'rank-item';
    item.style.animationDelay = `${0.1 + i * 0.07}s`;
    item.innerHTML = `
      <div class="rank-num">${i + 4}</div>
      <div class="rank-mini-av">${p.av}</div>
      <div class="rank-info">
        <div class="rank-name">${p.nome}</div>
        <div class="rank-bar-wrap"><div class="rank-bar-fill" style="width:0%" data-width="${pct}"></div></div>
      </div>
      <div class="rank-score">${p.pts.toLocaleString()}</div>
    `;
    list.appendChild(item);
  });

  // Animate bars
  setTimeout(() => {
    document.querySelectorAll('.rank-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.width + '%';
    });
  }, 300);
}

function renderDashboardCourses() {
  const container = document.getElementById('dashboard-courses');
  if (!container) return;
  const gradients = {
    'Tecnologia': 'from-emerald-500 to-teal-600',
    'Gestão': 'from-purple-500 to-violet-600',
    'Marketing': 'from-pink-500 to-rose-600',
    'Segurança': 'from-blue-500 to-cyan-600'
  };
  container.innerHTML = trainings.slice(0,4).map(t => `
    <div class="course-mini-card" onclick="showTrainingDetail(${t.id})">
      <div class="course-mini-icon bg-gradient-to-br ${gradients[t.area] || t.color}">
        <span style="font-size:16px">${getLessonEmoji(t.area)}</span>
      </div>
      <div class="flex-1 min-w-0">
        <div class="text-sm font-semibold text-white truncate">${t.name}</div>
        <div class="text-xs text-slate-500">${t.lessons.length} aulas • ${t.hours}</div>
      </div>
      <i data-lucide="chevron-right" class="w-4 h-4 text-slate-600"></i>
    </div>
  `).join('');
  lucide.createIcons();
}

function getLessonEmoji(area) {
  const map = { 'Tecnologia': '💻', 'Gestão': '👥', 'Marketing': '📢', 'Segurança': '🛡️', 'Finanças': '💰', 'Comunicação': '🗣️' };
  return map[area] || '📚';
}

// ============================================================
// PROFILE
// ============================================================

function renderProfile() {
  updateHeaderUI();
  const container = document.getElementById('profile-courses');
  if (!container) return;
  const progresses = [85, 60, 100, 40];
  container.innerHTML = trainings.map((t, i) => `
    <div class="mb-2">
      <div class="flex justify-between text-sm mb-1">
        <span class="text-slate-300 font-medium">${t.name}</span>
        <span class="text-slate-500 font-mono">${progresses[i] || 0}%</span>
      </div>
      <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:${progresses[i] || 0}%"></div></div>
    </div>
  `).join('');
}

// ============================================================
// TRAININGS
// ============================================================

function renderTrainings() {
  // Admin can add
  const addBtn = document.getElementById('btn-add-training');
  if (addBtn) addBtn.classList.toggle('hidden', !isAdmin());

  const grid = document.getElementById('trainings-grid');
  if (!grid) return;

  if (trainings.length === 0) {
    grid.innerHTML = `<div class="col-span-full text-center py-16 text-slate-500">
      <i data-lucide="inbox" class="w-16 h-16 mx-auto mb-4 opacity-40"></i>
      <p>Nenhum treinamento cadastrado</p>
    </div>`;
    lucide.createIcons(); return;
  }

  grid.innerHTML = trainings.map(t => `
    <div class="training-card" onclick="showTrainingDetail(${t.id})">
      <div class="training-card-header bg-gradient-to-br ${t.color}">
        <div class="flex items-start justify-between">
          <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <i data-lucide="${t.icon}" class="w-5 h-5 text-white"></i>
          </div>
          <span class="training-badge">${t.area}</span>
        </div>
        <h3 class="text-white font-bold text-lg mt-4">${t.name}</h3>
      </div>
      <div class="training-card-body">
        <p class="text-slate-400 text-sm mb-4 line-clamp-2">${t.description}</p>
        <div class="flex items-center gap-4 text-xs text-slate-500 mb-4">
          <span class="flex items-center gap-1.5"><i data-lucide="clock" class="w-3.5 h-3.5"></i>${t.hours}</span>
          <span class="flex items-center gap-1.5"><i data-lucide="video" class="w-3.5 h-3.5"></i>${t.lessons.length} aulas</span>
        </div>
        <div class="flex gap-2" onclick="event.stopPropagation()">
          <button onclick="showTrainingDetail(${t.id})" class="btn-primary flex-1 text-sm py-2">
            <i data-lucide="play" class="w-4 h-4"></i>Acessar
          </button>
          ${isAdmin() ? `
          <button onclick="event.stopPropagation(); openDeleteModal('training', ${t.id})" class="p-2 bg-slate-700/60 hover:bg-red-600 rounded-lg transition-all" title="Excluir">
            <i data-lucide="trash-2" class="w-4 h-4 text-slate-400"></i>
          </button>` : ''}
        </div>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

function showTrainingDetail(id) {
  const t = trainings.find(x => x.id === id);
  if (!t) return;

  const content = document.getElementById('training-detail-content');
  content.innerHTML = `
    <button onclick="showSection('trainings')" class="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors text-sm font-medium">
      <i data-lucide="arrow-left" class="w-4 h-4"></i> Voltar
    </button>

    <div class="rounded-2xl bg-gradient-to-br ${t.color} p-6 mb-6 relative overflow-hidden">
      <div class="absolute right-6 top-6 opacity-10 text-9xl font-black">${t.area[0]}</div>
      <div class="relative z-10">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <i data-lucide="${t.icon}" class="w-6 h-6 text-white"></i>
          </div>
          <span class="training-badge">${t.area}</span>
        </div>
        <h1 class="text-2xl font-black text-white">${t.name}</h1>
        <p class="text-white/75 mt-1 text-sm">${t.description}</p>
        <div class="flex items-center gap-6 mt-4 text-white/80 text-sm">
          <span class="flex items-center gap-1.5"><i data-lucide="clock" class="w-4 h-4"></i>${t.hours}</span>
          <span class="flex items-center gap-1.5"><i data-lucide="video" class="w-4 h-4"></i>${t.lessons.length} aulas</span>
        </div>
      </div>
    </div>

    <div class="flex gap-2 mb-6 border-b border-white/10 pb-1 overflow-x-auto">
      <button class="detail-tab active" data-tab="lessons" onclick="switchDetailTab('lessons', ${t.id}, this)">
        <i data-lucide="play-circle" class="w-4 h-4"></i>Aulas
      </button>
      <button class="detail-tab" data-tab="quiz" onclick="switchDetailTab('quiz', ${t.id}, this)">
        <i data-lucide="help-circle" class="w-4 h-4"></i>Quiz
      </button>
    </div>

    <div id="tab-lessons-${t.id}">
      <div class="space-y-3" id="lessons-list-${t.id}"></div>
    </div>
    <div id="tab-quiz-${t.id}" class="hidden">
      <div class="max-w-xl">
        <div class="glass-card rounded-2xl p-6">
          <h3 class="font-bold text-white text-lg mb-2 flex items-center gap-2">
            <i data-lucide="help-circle" class="w-5 h-5 text-purple-400"></i>
            Quiz — ${t.name}
          </h3>
          <p class="text-slate-400 text-sm mb-4">Teste seus conhecimentos com ${t.quiz.length} perguntas!</p>
          <button onclick="startQuiz(${t.id})" class="btn-primary">
            <i data-lucide="zap" class="w-4 h-4"></i>
            Iniciar Quiz
          </button>
        </div>
      </div>
    </div>
  `;

  // Style tabs
  const styleEl = document.createElement('style');
  styleEl.textContent = `.detail-tab{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px 8px 0 0;border:none;background:transparent;color:#64748b;font-size:13px;font-weight:700;cursor:pointer;transition:all 0.2s;white-space:nowrap;} .detail-tab.active{color:var(--accent);background:rgba(110,231,247,0.1);} .detail-tab:hover:not(.active){color:#94a3b8;}`;
  content.prepend(styleEl);

  // Render lessons
  const lessonsContainer = document.getElementById(`lessons-list-${t.id}`);
  lessonsContainer.innerHTML = t.lessons.map((l, i) => `
    <div class="lesson-item" id="lesson-${t.id}-${l.id}">
      <div class="lesson-num">${i+1}</div>
      <div class="text-2xl">${l.thumb || '🎬'}</div>
      <div class="video-player-thumb hidden" id="player-${t.id}-${l.id}"></div>
      <div class="flex-1 min-w-0">
        <div class="font-semibold text-white text-sm">${l.title}</div>
        <div class="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
          <i data-lucide="clock" class="w-3 h-3"></i>${l.duration}
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="playLesson(${t.id}, ${l.id})" class="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold text-white transition-all">
          <i data-lucide="play" class="w-3 h-3"></i>Assistir
        </button>
        ${isAdmin() ? `
        <button onclick="deleteLesson(${t.id}, ${l.id})" class="p-1.5 bg-red-500/10 hover:bg-red-500/30 rounded-lg transition-all" title="Excluir aula">
          <i data-lucide="x" class="w-3.5 h-3.5 text-red-400"></i>
        </button>` : ''}
      </div>
    </div>
  `).join('');

  if (isAdmin()) {
    lessonsContainer.insertAdjacentHTML('beforeend', `
      <button onclick="openAddLessonModal(${t.id})" class="w-full btn-secondary mt-2">
        <i data-lucide="plus" class="w-4 h-4"></i>
        Adicionar Videoaula
      </button>
    `);
  }

  showSection('training-detail');
  lucide.createIcons();
}

function switchDetailTab(tab, trainingId, btn) {
  ['lessons', 'quiz'].forEach(t => {
    const el = document.getElementById(`tab-${t}-${trainingId}`);
    if (el) el.classList.add('hidden');
  });
  document.getElementById(`tab-${tab}-${trainingId}`).classList.remove('hidden');
  document.querySelectorAll('.detail-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function playLesson(trainingId, lessonId) {
  const t = trainings.find(x => x.id === trainingId);
  const l = t?.lessons.find(x => x.id === lessonId);
  if (!l) return;

  const lessonEl = document.getElementById(`lesson-${trainingId}-${lessonId}`);
  if (!lessonEl) return;

  // Show a "video player" mock inline
  const playerEl = document.getElementById(`player-${trainingId}-${lessonId}`);
  if (playerEl && playerEl.classList.contains('hidden')) {
    playerEl.classList.remove('hidden');
    playerEl.innerHTML = `
      <div class="video-player-mock w-48" onclick="showToast('Reproduzindo: ${l.title}', 'info')">
        <div class="relative z-10 flex flex-col items-center gap-2 p-4">
          <div class="play-btn-big">
            <i data-lucide="play" class="w-7 h-7 text-cyan-300 ml-1"></i>
          </div>
          <div class="text-center z-10 relative">
            <div class="text-xs text-slate-400 font-semibold">${l.title.slice(0,20)}...</div>
            <div class="text-xs text-slate-600">${l.duration}</div>
          </div>
        </div>
      </div>
    `;
    lucide.createIcons();
    showToast(`▶ Reproduzindo: "${l.title}"`, 'info');
  } else if (playerEl) {
    playerEl.classList.add('hidden');
  }
}

function deleteLesson(trainingId, lessonId) {
  const t = trainings.find(x => x.id === trainingId);
  if (!t) return;
  const lesson = t.lessons.find(l => l.id === lessonId);
  if (!lesson) return;
  itemToDelete = { type: 'lesson', trainingId, lessonId, name: lesson.title };
  document.getElementById('delete-message').textContent = `Excluir a aula "${lesson.title}"?`;
  document.getElementById('modal-delete').classList.remove('hidden');
}

function openAddLessonModal(trainingId) {
  const title = prompt('Título da nova videoaula:');
  const duration = prompt('Duração (ex: 1h 30min):');
  if (!title || !duration) return;
  const t = trainings.find(x => x.id === trainingId);
  if (!t) return;
  const emojis = ['🎬','📹','🎥','📺','💡'];
  const thumb = emojis[Math.floor(Math.random() * emojis.length)];
  const maxId = Math.max(0, ...t.lessons.map(l => l.id));
  t.lessons.push({ id: maxId + 1, title, duration, thumb });
  showToast(`Aula "${title}" adicionada!`, 'success');
  showTrainingDetail(trainingId);
}

// ============================================================
// EVALUATIONS
// ============================================================

function renderEvaluations() {
  const addBtn = document.getElementById('btn-add-evaluation');
  if (addBtn) addBtn.classList.toggle('hidden', !isProfOrAdmin());

  // Populate eval training dropdown
  const sel = document.getElementById('eval-training');
  if (sel) {
    sel.innerHTML = trainings.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
  }

  const container = document.getElementById('evaluations-list');
  if (!container) return;

  // Group by training
  const groups = {};
  evaluations.forEach(ev => {
    const t = trainings.find(x => x.id === ev.trainingId);
    if (!t) return;
    if (!groups[t.id]) groups[t.id] = { t, evals: [] };
    groups[t.id].evals.push(ev);
  });

  container.innerHTML = Object.values(groups).map(g => `
    <div class="eval-card">
      <div class="eval-header">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-gradient-to-br ${g.t.color} flex items-center justify-center">
            <i data-lucide="${g.t.icon}" class="w-4 h-4 text-white"></i>
          </div>
          <div>
            <div class="font-bold text-white text-sm">${g.t.name}</div>
            <div class="text-xs text-slate-500">${g.evals.length} avaliações</div>
          </div>
        </div>
        ${isProfOrAdmin() ? `<button onclick="openAddEvaluationModal(${g.t.id})" class="text-xs text-accent hover:underline flex items-center gap-1"><i data-lucide="plus" class="w-3 h-3"></i>Adicionar</button>` : ''}
      </div>
      ${g.evals.map(ev => {
        const scoreClass = ev.myScore === null ? 'score-blue' : ev.myScore >= 70 ? 'score-green' : 'score-amber';
        const scoreText = ev.myScore === null ? 'Não realizado' : `${ev.myScore}/${ev.maxScore}`;
        return `
        <div class="eval-item">
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <div class="w-9 h-9 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0">
              <i data-lucide="clipboard-list" class="w-4 h-4 text-amber-400"></i>
            </div>
            <div class="min-w-0">
              <div class="font-semibold text-white text-sm">${ev.name}</div>
              <div class="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                <span>${ev.questions} questões</span>
                <span>${ev.duration}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <span class="score-badge ${scoreClass}">${scoreText}</span>
            <button onclick="startEvaluation(${ev.id})" class="btn-primary text-xs py-1.5 px-3">
              ${ev.myScore === null ? 'Iniciar' : 'Refazer'}
            </button>
            ${isProfOrAdmin() ? `<button onclick="deleteEvaluation(${ev.id})" class="p-1.5 hover:bg-red-500/20 rounded-lg transition-all" title="Excluir"><i data-lucide="trash-2" class="w-4 h-4 text-red-400"></i></button>` : ''}
          </div>
        </div>`;
      }).join('')}
    </div>
  `).join('');

  lucide.createIcons();
}

function openAddEvaluationModal(trainingId) {
  const sel = document.getElementById('eval-training');
  if (sel && trainingId) sel.value = trainingId;
  document.getElementById('modal-add-evaluation').classList.remove('hidden');
  lucide.createIcons();
}

function closeAddEvaluationModal() {
  document.getElementById('modal-add-evaluation').classList.add('hidden');
  document.getElementById('add-evaluation-form').reset();
}

function saveNewEvaluation(e) {
  e.preventDefault();
  const name = document.getElementById('eval-name').value;
  const trainingId = parseInt(document.getElementById('eval-training').value);
  const questions = parseInt(document.getElementById('eval-questions').value);
  const duration = document.getElementById('eval-duration').value;
  const maxScore = parseInt(document.getElementById('eval-max-score').value);

  evaluations.push({ id: idCounter++, trainingId, name, questions, duration, maxScore, myScore: null });
  closeAddEvaluationModal();
  renderEvaluations();
  showToast(`Avaliação "${name}" criada!`, 'success');
}

function deleteEvaluation(evId) {
  const ev = evaluations.find(x => x.id === evId);
  if (!ev) return;
  itemToDelete = { type: 'evaluation', evId, name: ev.name };
  document.getElementById('delete-message').textContent = `Excluir a avaliação "${ev.name}"?`;
  document.getElementById('modal-delete').classList.remove('hidden');
}

function startEvaluation(evId) {
  const ev = evaluations.find(x => x.id === evId);
  const t = trainings.find(x => x.id === ev?.trainingId);
  if (!ev || !t || !t.quiz || t.quiz.length === 0) {
    showToast('Esta avaliação não tem perguntas ainda.', 'info');
    return;
  }
  startQuizFromEvaluation(t, ev);
}

// ============================================================
// QUIZ
// ============================================================

function startQuiz(trainingId) {
  const t = trainings.find(x => x.id === trainingId);
  if (!t || !t.quiz || t.quiz.length === 0) return showToast('Sem perguntas disponíveis.', 'info');
  openQuizModal(t, null);
}

function startQuizFromEvaluation(t, ev) {
  openQuizModal(t, ev);
}

function openQuizModal(t, ev) {
  activeQuiz = { t, ev, currentQ: 0, answers: [], started: Date.now() };
  document.getElementById('quiz-modal-title').innerHTML = `<i data-lucide="help-circle" class="w-5 h-5 text-purple-400"></i> Quiz — ${t.name}`;
  renderQuizQuestion();
  document.getElementById('modal-quiz').classList.remove('hidden');
  lucide.createIcons();
}

function closeQuizModal() {
  document.getElementById('modal-quiz').classList.add('hidden');
  activeQuiz = null;
}

function renderQuizQuestion() {
  if (!activeQuiz) return;
  const { t, currentQ } = activeQuiz;
  const q = t.quiz[currentQ];
  const total = t.quiz.length;
  const pct = Math.round((currentQ / total) * 100);

  const content = document.getElementById('quiz-modal-content');
  content.innerHTML = `
    <div class="mb-5">
      <div class="flex justify-between text-xs text-slate-500 mb-2">
        <span>Pergunta ${currentQ + 1} de ${total}</span>
        <span>${pct}% concluído</span>
      </div>
      <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
    </div>
    <h3 class="text-white font-bold text-base mb-5">${q.q}</h3>
    <div class="space-y-3" id="quiz-options">
      ${q.opts.map((opt, i) => `
        <button class="quiz-option" onclick="selectQuizAnswer(${i})">
          <span class="font-bold text-slate-500 mr-2">${String.fromCharCode(65+i)}.</span> ${opt}
        </button>
      `).join('')}
    </div>
    <div id="quiz-feedback" class="hidden mt-4"></div>
    <div class="mt-5 flex justify-between items-center">
      <span class="text-xs text-slate-600">${activeQuiz.answers.filter(a => a).length} corretas até agora</span>
      <button id="quiz-next-btn" onclick="nextQuizQuestion()" class="btn-primary text-sm hidden">
        ${currentQ + 1 < total ? 'Próxima →' : 'Ver Resultado'}
      </button>
    </div>
  `;
}

function selectQuizAnswer(idx) {
  if (!activeQuiz) return;
  const { t, currentQ } = activeQuiz;
  const q = t.quiz[currentQ];
  const isCorrect = idx === q.correct;

  activeQuiz.answers[currentQ] = isCorrect;

  const opts = document.querySelectorAll('#quiz-options .quiz-option');
  opts.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add('correct');
    else if (i === idx && !isCorrect) btn.classList.add('wrong');
  });

  const feedback = document.getElementById('quiz-feedback');
  feedback.classList.remove('hidden');
  feedback.innerHTML = isCorrect
    ? `<div class="flex items-center gap-2 text-green-400 font-semibold text-sm"><i data-lucide="check-circle" class="w-4 h-4"></i>Correto! Muito bem!</div>`
    : `<div class="flex items-center gap-2 text-red-400 font-semibold text-sm"><i data-lucide="x-circle" class="w-4 h-4"></i>Incorreto. A resposta certa é: <strong>${q.opts[q.correct]}</strong></div>`;

  document.getElementById('quiz-next-btn').classList.remove('hidden');
  lucide.createIcons();
}

function nextQuizQuestion() {
  if (!activeQuiz) return;
  activeQuiz.currentQ++;
  if (activeQuiz.currentQ < activeQuiz.t.quiz.length) {
    renderQuizQuestion();
  } else {
    showQuizResult();
  }
}

function showQuizResult() {
  const { t, ev, answers } = activeQuiz;
  const correct = answers.filter(Boolean).length;
  const total = t.quiz.length;
  const pct = Math.round((correct / total) * 100);
  const isPassing = pct >= 70;

  if (isPassing && ev) {
    const evaluation = evaluations.find(x => x.id === ev.id);
    if (evaluation) evaluation.myScore = Math.round((pct / 100) * evaluation.maxScore);
    currentUser.points = (currentUser.points || 0) + correct * 50;
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  }

  const content = document.getElementById('quiz-modal-content');
  content.innerHTML = `
    <div class="text-center py-6">
      <div class="text-6xl mb-4">${isPassing ? '🏆' : '😅'}</div>
      <h3 class="text-2xl font-black text-white mb-2">${isPassing ? 'Parabéns!' : 'Continue tentando!'}</h3>
      <p class="text-slate-400 mb-6">${correct} de ${total} respostas corretas</p>
      <div class="w-28 h-28 mx-auto mb-6 relative">
        <svg class="transform -rotate-90 w-28 h-28">
          <circle cx="56" cy="56" r="48" stroke="rgba(255,255,255,0.1)" stroke-width="8" fill="none"/>
          <circle cx="56" cy="56" r="48" stroke="${isPassing ? '#4ade80' : '#f87171'}" stroke-width="8" fill="none"
            stroke-dasharray="${Math.PI * 96}" stroke-dashoffset="${Math.PI * 96 * (1 - pct/100)}" stroke-linecap="round"/>
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-2xl font-black text-white">${pct}%</span>
        </div>
      </div>
      ${isPassing ? `<div class="text-emerald-400 font-bold mb-2">+${correct * 50} pontos ganhos!</div>` : ''}
      <button onclick="closeQuizModal()" class="btn-primary mx-auto">
        <i data-lucide="check" class="w-4 h-4"></i>Concluir
      </button>
    </div>
  `;
  lucide.createIcons();
  if (ev) renderEvaluations();
}

// ============================================================
// CERTIFICATES (ADMIN ONLY)
// ============================================================

function renderCertificates() {
  if (!isAdmin()) { showSection('dashboard'); return; }

  const container = document.getElementById('certificates-content');
  if (!container) return;

  // Populate modal selects
  const studentSel = document.getElementById('cert-student');
  const trainingSel = document.getElementById('cert-training');
  const allStudents = [...DEMO_USERS, ...registeredUsers].filter(u => u.role === 'Aluno' || u.role === 'Participante');

  if (studentSel) {
    studentSel.innerHTML = allStudents.map(u => `<option value="${u.name}">${u.name}</option>`).join('');
    if (!studentSel.value && allStudents.length) studentSel.value = allStudents[0].name;
  }
  if (trainingSel) {
    trainingSel.innerHTML = trainings.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
  }

  // Set today's date
  const dateInput = document.getElementById('cert-date');
  if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Emit panel -->
      <div class="glass-card rounded-2xl p-6">
        <h3 class="font-bold text-white text-base mb-4 flex items-center gap-2">
          <i data-lucide="award" class="w-5 h-5 text-yellow-400"></i>
          Emitir Novo Certificado
        </h3>
        <div class="space-y-4">
          <div>
            <label class="form-label">Aluno</label>
            <select id="cert-student-inline" class="form-input-dark">
              ${allStudents.map(u => `<option value="${u.name}">${u.name}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="form-label">Treinamento</label>
            <select id="cert-training-inline" class="form-input-dark">
              ${trainings.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="form-label">Data de conclusão</label>
            <input id="cert-date-inline" type="date" class="form-input-dark" value="${new Date().toISOString().split('T')[0]}">
          </div>
          <button onclick="issueInlineCertificate()" class="btn-primary w-full">
            <i data-lucide="award" class="w-4 h-4"></i>
            Emitir Certificado
          </button>
        </div>
      </div>

      <!-- Issued list -->
      <div>
        <h3 class="font-bold text-white text-base mb-4">Certificados Emitidos (${certificates.length})</h3>
        <div class="space-y-3" id="certs-list">
          ${certificates.map(c => {
            const t = trainings.find(x => x.id === c.trainingId);
            return `
            <div class="cert-card">
              <div class="relative z-10">
                <div class="text-yellow-400 text-3xl mb-2">🏅</div>
                <div class="text-white font-black text-base">${c.studentName}</div>
                <div class="text-slate-400 text-sm mt-1">Concluiu: <strong class="text-slate-300">${t?.name || 'Treinamento'}</strong></div>
                <div class="text-slate-500 text-xs mt-1">${formatDate(c.date)}</div>
                <button onclick="printCertificate('${c.studentName}', ${c.trainingId}, '${c.date}')" class="btn-outline mt-3 text-xs py-1.5">
                  <i data-lucide="printer" class="w-3.5 h-3.5"></i>Imprimir / Baixar
                </button>
              </div>
            </div>`;
          }).join('') || '<p class="text-slate-500 text-sm">Nenhum certificado emitido ainda.</p>'}
        </div>
      </div>
    </div>
  `;
  lucide.createIcons();
}

function renderCertificates() {
  const container = document.getElementById('certificates-list');

  const meus = certificates.filter(c => 
    c.studentName === currentUser.name
  );

  container.innerHTML = meus.map(c => `
    <div class="glass-card p-4 mb-3">
      <h3 class="text-white font-bold">${c.studentName}</h3>
      <p class="text-slate-400 text-sm">Certificado concluído</p>
    </div>
  `).join('');
}


function openCertificateModal() {
  document.getElementById('modal-certificate').classList.remove('hidden');
  lucide.createIcons();
}
function closeCertificateModal() {
  document.getElementById('modal-certificate').classList.add('hidden');
}
function issueCertificate() { issueInlineCertificate(); closeCertificateModal(); }

function printCertificate(studentName, trainingId, date) {
  const t = trainings.find(x => x.id === trainingId);
  const win = window.open('', '_blank');
  win.document.write(`
    <!DOCTYPE html><html><head><title>Certificado</title>
    <style>
      body{font-family:Georgia,serif;background:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;}
      .cert{width:800px;padding:60px;border:8px solid #b8860b;text-align:center;position:relative;}
      .cert::before{content:'';position:absolute;inset:12px;border:2px solid #daa520;pointer-events:none;}
      h1{color:#b8860b;font-size:48px;margin-bottom:8px;}
      .sub{color:#666;font-size:18px;margin-bottom:40px;}
      .name{font-size:36px;font-weight:bold;color:#333;border-bottom:2px solid #daa520;display:inline-block;padding-bottom:8px;margin-bottom:20px;}
      .course{font-size:22px;color:#444;margin-bottom:30px;}
      .date{color:#888;font-size:14px;}
      .seal{font-size:60px;margin:20px 0;}
      @media print{body{-webkit-print-color-adjust:exact;}}
    </style></head>
    <body><div class="cert">
      <h1>🎓 Certificado</h1>
      <div class="sub">de Conclusão</div>
      <p style="color:#666">Certificamos que</p>
      <div class="name">${studentName}</div>
      <div class="course">concluiu com êxito o treinamento<br><strong>${t?.name || 'Treinamento'}</strong></div>
      <div class="seal">🏅</div>
      <div class="date">Data de conclusão: ${formatDate(date)}</div>
      <div style="margin-top:40px;display:flex;justify-content:space-around;">
        <div style="text-align:center"><div style="border-top:1px solid #999;padding-top:8px;font-size:13px;color:#666;">Coordenação</div></div>
        <div style="text-align:center"><div style="border-top:1px solid #999;padding-top:8px;font-size:13px;color:#666;">CapacitaHub</div></div>
      </div>
    </div><script>window.print();<\/script></body></html>
  `);
  win.document.close();
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

// ============================================================
// TRAINING CRUD
// ============================================================

function openAddModal() {
  document.getElementById('modal-title').innerHTML = '<i data-lucide="plus-circle" class="w-5 h-5 text-cyan-400"></i> Novo Treinamento';
  document.getElementById('modal-submit-text').textContent = 'Cadastrar';
  document.getElementById('training-form').reset();
  document.getElementById('training-id').value = '';
  document.getElementById('modal-training').classList.remove('hidden');
  lucide.createIcons();
}

function closeModal() { document.getElementById('modal-training').classList.add('hidden'); }

function saveTraining(e) {
  e.preventDefault();
  const id = document.getElementById('training-id').value;
  const name = document.getElementById('training-name').value;
  const description = document.getElementById('training-description').value;
  const hours = document.getElementById('training-hours').value;
  const area = document.getElementById('training-area').value;

  const areaMap = {
    'Tecnologia': { icon: 'laptop', color: 'from-emerald-500 to-teal-600', bgColor: 'rgba(16,185,129,0.15)' },
    'Gestão': { icon: 'users', color: 'from-purple-500 to-violet-600', bgColor: 'rgba(139,92,246,0.15)' },
    'Marketing': { icon: 'trending-up', color: 'from-pink-500 to-rose-600', bgColor: 'rgba(244,63,94,0.15)' },
    'Finanças': { icon: 'dollar-sign', color: 'from-amber-500 to-orange-600', bgColor: 'rgba(245,158,11,0.15)' },
    'Comunicação': { icon: 'message-circle', color: 'from-orange-500 to-amber-600', bgColor: 'rgba(249,115,22,0.15)' },
    'Segurança': { icon: 'shield', color: 'from-blue-500 to-cyan-600', bgColor: 'rgba(59,130,246,0.15)' }
  };
  const cfg = areaMap[area] || { icon: 'book', color: 'from-slate-500 to-slate-600', bgColor: 'rgba(100,116,139,0.15)' };

  if (id) {
    const idx = trainings.findIndex(t => t.id === parseInt(id));
    if (idx !== -1) Object.assign(trainings[idx], { name, description, hours, area, ...cfg });
    showToast('Treinamento atualizado!', 'success');
  } else {
    trainings.push({ id: idCounter++, name, description, hours, area, ...cfg, lessons: [], quiz: [] });
    showToast(`Treinamento "${name}" criado!`, 'success');
  }
  closeModal();
  renderTrainings();
}

// ============================================================
// DELETE MODAL
// ============================================================

function openDeleteModal(type, id) {
  if (type === 'training') {
    const t = trainings.find(x => x.id === id);
    itemToDelete = { type: 'training', id, name: t?.name };
    document.getElementById('delete-message').textContent = `Excluir o treinamento "${t?.name}"? Esta ação não pode ser desfeita.`;
  }
  document.getElementById('modal-delete').classList.remove('hidden');
}

function closeDeleteModal() {
  document.getElementById('modal-delete').classList.add('hidden');
  itemToDelete = null;
}

function confirmDelete() {
  if (!itemToDelete) return;
  if (itemToDelete.type === 'training') {
    trainings = trainings.filter(t => t.id !== itemToDelete.id);
    showToast(`"${itemToDelete.name}" excluído!`, 'success');
    renderTrainings();
  } else if (itemToDelete.type === 'lesson') {
    const t = trainings.find(x => x.id === itemToDelete.trainingId);
    if (t) t.lessons = t.lessons.filter(l => l.id !== itemToDelete.lessonId);
    showToast(`Aula "${itemToDelete.name}" excluída!`, 'success');
    showTrainingDetail(itemToDelete.trainingId);
  } else if (itemToDelete.type === 'evaluation') {
    evaluations = evaluations.filter(e => e.id !== itemToDelete.evId);
    showToast(`Avaliação excluída!`, 'success');
    renderEvaluations();
  }
  closeDeleteModal();
}

// ============================================================
// TOAST
// ============================================================

function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  const icons = { success: 'check-circle', error: 'x-circle', info: 'info' };
  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  toast.innerHTML = `
    <i data-lucide="${icons[type]}" class="w-4 h-4 flex-shrink-0"></i>
    <span class="flex-1">${msg}</span>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;cursor:pointer;opacity:0.6;color:inherit;">✕</button>
  `;
  container.appendChild(toast);
  lucide.createIcons();
  setTimeout(() => { if (toast.parentElement) toast.remove(); }, 4500);
}

// ============================================================
// INIT
// ============================================================

window.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  // Auto-login from remember
  const remembered = localStorage.getItem('ch_remember');
  if (remembered) {
    try {
      const { email, password } = JSON.parse(remembered);
      const user = [...DEMO_USERS, ...registeredUsers].find(u => u.email === email && u.password === password);
      if (user) {
        currentUser = { ...user };
        enterApp();
        return;
      }
    } catch(e) { localStorage.removeItem('ch_remember'); }
  }

  showLoginScreen();
});

function renderClassControl() {
  const alunos = [
    { nome: 'Maria Eduarda', presente: true, nota: 87 },
    { nome: 'João Pedro', presente: false, nota: 72 },
    { nome: 'Ana Luiza', presente: true, nota: 95 }
  ];

  // CHAMADA
  const attendance = document.getElementById('attendance-list');
  attendance.innerHTML = alunos.map(a => `
    <div class="flex justify-between mb-2">
      <span>${a.nome}</span>
      <button onclick="togglePresenca(this)" class="btn-secondary text-xs">
        ${a.presente ? 'Presente' : 'Faltou'}
      </button>
    </div>
  `).join('');

  // NOTAS
  const grades = document.getElementById('grades-list');
  grades.innerHTML = alunos.map(a => `
    <div class="flex justify-between mb-2">
      <span>${a.nome}</span>
      <span>${a.nota}</span>
    </div>
  `).join('');

  // CERTIFICADOS
  const certs = document.getElementById('teacher-certificates');
  certs.innerHTML = certificates.map(c => `
    <div class="mb-2 text-sm text-slate-300">
      ${c.studentName} — Certificado emitido
    </div>
  `).join('');
}

function togglePresenca(btn) {
  if (btn.innerText === 'Presente') {
    btn.innerText = 'Faltou';
  } else {
    btn.innerText = 'Presente';
  }
}
