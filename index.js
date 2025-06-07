const jwt = require('jsonwebtoken');
require('dotenv').config();
var createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
var path = require('path');
var logger = require('morgan');
const pool = require('./db/db');
// Importando as rotas
const docRoutes = require('./routes/docRoutes');
const tcRoutes = require('./routes/tcRoutes');
const loginRoutes = require('./routes/loginRoute');
const contaRoutes = require('./routes/contaRoutes');
const contaTipoRoutes = require('./routes/contaTipoRoutes');
const categoriaController = require('./routes/categoriaRoutes');
const naturezaController = require('./routes/naturezaRoutes');
const transfController = require('./routes/transfRoutes');
const app = express();


// Configuração do Passport para autenticação com Google
const passport = require('passport');
require('./controllers/auth/google'); // caminho para o arquivo da estratégia Google
// Configuração do Passport GOOGLE
app.use(session({
  secret: 'minha_chave_secreta',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.HTTPS, 
    sameSite: 'lax'
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// view engine setup arquivos PUG Tratamento de ERros de rotas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/teste', (req, res) => {
  res.json({ message: 'Rota de teste funcionando!' });
});

// Rota para testar a conexão com o banco de dados PostgreSQL
app.get('/teste-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'Conectado ao PostgreSQL!', hora: result.rows[0].now });
  } catch (err) {
    console.error('Erro ao conectar:', err);
    res.status(500).json({ error: 'Falha na conexão com o banco' });
  }
});

// Configuração do CORS e cookies
app.use(cookieParser());

app.use(cors({
  origin: process.env.BASE_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(transfController);
app.use(naturezaController);
app.use(categoriaController);
app.use(contaTipoRoutes);
app.use(contaRoutes);
app.use(docRoutes);
app.use(tcRoutes);
app.use('/', loginRoutes);

app.use(express.static('public/'));

const autenticarToken = require('./src/middleware/authMiddleware');
const { error } = require('console');

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login/index.html');
});

app.get('/dash', autenticarToken, (req, res) => {
  res.sendFile(__dirname + '/public/html/dashboard.html')
});

app.get('/listar_registros', autenticarToken, (req, res) => {
  res.sendFile(__dirname + '/public/html/listar_registros.html')
});

app.get('/lancamento_receita', autenticarToken, (req, res) => {
  res.sendFile(__dirname + '/public/html/lancamento_receita.html')
});

app.get('/lancamento_despesa', autenticarToken, (req, res) => {
  res.sendFile(__dirname + '/public/html/lancamento_despesa.html')
});
app.get('/transf', (req, res) => {
  res.sendFile(__dirname + '/public/html/transf.html')
});

app.get('/page', autenticarToken, (req, res) => {
  res.sendFile(__dirname + '/public/html/page.html')
});

app.get('/cobranca', autenticarToken, (req, res) => {
  res.sendFile(__dirname + '/public/html/cobranca.html')
});
app.get('/contas', autenticarToken, (req, res) => {
  res.sendFile(__dirname + '/public/html/conta.html')
});
app.get('/pagina_em_branco', autenticarToken, (req, res) => {
  res.sendFile(__dirname + '/public/html/pagina-branco.html')
});

app.get('/categoria', autenticarToken, (req, res) => {
  res.sendFile(__dirname + '/public/html/categoria.html')
});
app.get('/nav', autenticarToken, (req, res) => {
  res.sendFile(__dirname + '/public/html/nav.html');
});
app.get('/sidebar', autenticarToken, (req, res) => {
  res.sendFile(__dirname + '/public/html/sidebar.html');
});
app.get('/navbar', autenticarToken, (req, res) => {
  res.sendFile(__dirname + '/public/html/navbar.html');
});
app.get('/perfil', (req, res) => {
  res.sendFile(__dirname + '/public/html/perfil.html')
});
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/public/register/register.html')
});
app.get('/editar', (req, res) => {
  res.sendFile(__dirname + '/public/html/editar.html')
});
// Rota para iniciar login com Google
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Callback após login
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    const nome = req.user.displayName;
    const email = req.user.emails[0].value;
    const idOAuth = req.user.id;

    try {
      // Verificar se o usuário já existe na tabela 'usu'
      let result = await pool.query('SELECT * FROM usu WHERE usuemail = $1', [email]);

      let usuario;
      if (result.rows.length === 0) {
        // Usuário não existe — cadastrar com senha vazia
        await pool.query('INSERT INTO usu (usuemail, ususenha, usunome) VALUES ($1, $2, $3)', [email, '', nome]);
        result = await pool.query('SELECT * FROM usu WHERE usuemail = $1', [email]);
      }

      usuario = result.rows[0];

      // Gerar o mesmo token JWT que o login convencional
      const token = jwt.sign({
        usuemail: usuario.usuemail,
        usucod: usuario.usucod,
        usunome: usuario.usunome
      }, 'chave-secreta', { expiresIn: '10m' });

      // Definir os mesmos cookies
      res.cookie('usunome', usuario.usunome, { httpOnly: true, secure: true, sameSite: 'Strict' });
      res.cookie('usuemail', usuario.usuemail, { httpOnly: true, secure: true, sameSite: 'Strict' });
      res.cookie('usucod', usuario.usucod, { httpOnly: true, secure: true, sameSite: 'Strict' });
      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });

      console.log(`Login com Google: ${usuario.usunome} (${usuario.usuemail})`);
      //res.redirect('/dash');
      res.send(`
        <html>
          <body>
            <script>
              setTimeout(function() {
                window.location.href = "/dash";
              }, 500);
            </script>
            <p>Logado com sucesso. Redirecionando...</p>
          </body>
        </html>
      `);
    } catch (err) {
      console.error('Erro ao processar login com Google:', err);
      res.status(500).send('Erro interno ao autenticar com Google');
    }
  }
);
// Rota para expor a variável BASE_URL para o navegador
app.get('/config.js', (req, res) => {
  res.type('application/javascript');
  res.send(`const BASE_URL = '${process.env.BASE_URL}';`);
});
// Rota para obter o nome do usuário logado
app.get('/api/NomeUsuarioLogado', (req, res) => {
  const nomeUsuario = req.cookies.usunome;
  if (nomeUsuario) {
    res.json({ nome: nomeUsuario });
  } else {
    res.status(401).json({ nome: null });
  }
});
app.get('/api/dadosUserLogado', autenticarToken, (req, res) => {
  if (req.token) {
    const { usunome, usuemail, usucod } = req.token;
    res.json({ usunome: usunome, usuemail: usuemail, usucod: usucod });
  } else {
    res.status(401).json({ nome: null });
  }
});
// rota limpar o cookie de autenticação
app.get('/auth/sair', (req, res) => {
  const token_session = req.cookies.token;
  if (token_session) {
    res.clearCookie('usunome', { path: '/' });
    res.clearCookie('token', { path: '/' });
    res.json({ message: 'Logout realizado com sucesso.' });
  } else {
    res.status(401).json({ error: "erro ao sair" });
  }
});

// tratamento 404 not found  >>>
app.use(express.static(path.join(__dirname, 'dist')));
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'dist/404.html'));
});
// tratamento 404 not found <<<<

// tratamento de erros
app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // renderiza a página de erro
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, () => {
  console.log(`Servidor rodando na porta: ${process.env.BASE_URL}/login`);
});

