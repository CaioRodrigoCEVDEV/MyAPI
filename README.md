# 💰 Portal de Controle Financeiro Pessoal

Sistema web para controle financeiro pessoal com login e senha, onde o usuário pode registrar receitas, despesas e visualizar o total líquido.

---

## 🛠️ Tecnologias Utilizadas


| 🖥️ Frontend  | ⚙️ Backend     | 📦 Pacotes Node.js                        |
|--------------|----------------|-------------------------------------------|
| HTML5        | Node.js        | express                                   |
| CSS3         | Express        | pg                                        |
| JavaScript   | PostgreSQL     | bcryptjs                                  |
|              |                | jsonwebtoken                              |
|              |                | body-parser                               |
|              |                | cors *(opcional)*                         |
|              |                | dotenv                                    |

---

# 📥 Instalação:

### 1. Clone o repositório:
```bash
git clone https://github.com/CaioRodrigoCEVDEV/MyAPI.git
```
### 2. Instalação dos pacotes Node.js

```bash
npm init -y
npm install express pg bcryptjs jsonwebtoken body-parser dotenv cors cookie-parser pug morgan
```
### 3. Crie um arquivo .env na raiz com o seguinte conteúdo:

```bash
DB_HOST= SEU_IP
DB_PORT=PORTA
DB_USER=USUARIO
DB_PASSWORD=SENHA
DB_NAME=BASE_DADOS

```
---
# 📦 Estrutura do Banco de Dados

Este repositório contém a definição de um banco de dados PostgreSQL com três tabelas principais: `usu`, `tc` e `doc`, além de uma `SEQUENCE` utilizada para geração automática de IDs na tabela `doc`.

---

## 🔐 Tabela `usu` (Usuários)

Armazena os dados de login dos usuários do sistema.

```sql
CREATE TABLE public.usu (
  usuemail varchar(120) NULL,
  ususenha varchar(32) NULL,
  CONSTRAINT pk_usu PRIMARY KEY (usuemail)
);
```

- **usuemail**: E-mail do usuário (chave primária).
- **ususenha**: Senha do usuário (armazenada como hash MD5, por exemplo).

### 👤 Inserção de exemplo:
```sql
INSERT INTO usu VALUES ('email@mail.com', md5('123'));
```

### 🔐 Permissões:
- Dono: `postgres`
- Permissões completas: `postgres`
- Permissão de leitura: `consulta`

---

## 💳 Tabela `tc` (Tipos de Cobrança)

Tabela com os tipos de cobrança disponíveis no sistema.

```sql
CREATE TABLE public.tc (
  tccod int4 NOT NULL,
  tcdes varchar(40) NOT NULL,
  tctipo varchar(40) NULL,
  CONSTRAINT tc_pkey PRIMARY KEY (tccod)
);
```

- **tccod**: Código do tipo de cobrança (chave primária).
- **tcdes**: Descrição (ex: "DINHEIRO").
- **tctipo**: Tipo da cobrança (ex: "DH").

Sequencia

```sql
CREATE SEQUENCE public.seq_tc
  INCREMENT BY 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1
  NO CYCLE;
```

### ➕ Inserção de exemplo:
```sql
INSERT INTO tc(tccod, tcdes, tctipo) VALUES (1, 'DINHEIRO', 'DH');
```

### 🔐 Permissões:
- Dono: `postgres`
- Permissões completas: `postgres`
- Permissão de leitura: `consulta`

---

## 📄 Tabela `doc` (Documentos)

Registra documentos de cobrança, com associação ao tipo de cobrança.

```sql
CREATE TABLE public.doc (
  docempparcod int4 NOT NULL,
  doccod serial NOT NULL,
  docnatcod int NULL,
  docsta bpchar(2) NULL,
  docdsta timestamp NULL,
  docv numeric(14, 2) DEFAULT 0 NOT NULL,
  doctccod int4 NULL,
  docnum varchar(18) NULL,
  docobs bpchar(254) NULL,
  doccontacod int,
  doccatcod int
  CONSTRAINT pk_doc PRIMARY KEY (docempparcod, doccod),
  CONSTRAINT fk_doc_tc FOREIGN KEY (doctccod) REFERENCES public.tc(tccod)
);
```

- **docempparcod**: Código da empresa ou parceiro.
- **doccod**: Código do documento (gerado automaticamente pela sequence).
- **doctipo**: Tipo do documento.
- **docsta**: Status.
- **docdsta**: Data de status.
- **docv**: Valor do documento.
- **doctccod**: Código do tipo de cobrança (chave estrangeira para `tc`).
- **docnum**: Número do documento.
- **docobs**: Observações.
- **doccontacod**: Código da conta.
- **doccatcod**: Código da categoria.

### ➕ Inserção de exemplo:
```sql
INSERT INTO doc (docempparcod, docv, doctccod) VALUES (1, 100.00, 1);
```

### 🔐 Permissões:
- Dono: `postgres`
- Permissões completas: `postgres`
- Permissão de leitura: `consulta`

---

## 💳 Tabela `contatipo` (Tipos da conta)

Tabela com os tipos da conta disponíveis no sistema.

```sql
create table public.contatipo (
	contatipocod serial,
	contatipodes varchar,
	CONSTRAINT pk_contatipo PRIMARY KEY (contatipocod)
);

```

- **contatipocod**: Código do tipo da conta (chave primária).
- **contatipodes**: Descrição (ex: "DINHEIRO","CONTA CORRENTE","INVESTIMENTOS").



### ➕ Inserção OBRIGATÓRIA:
```sql
insert into contatipo (contatipodes) values ('Dinheiro');
insert into contatipo (contatipodes) values ('Conta Corrente');
insert into contatipo (contatipodes) values ('Conta Poupança');
insert into contatipo (contatipodes) values ('Investimento');
insert into contatipo (contatipodes) values ('Outro');
```

### 🔐 Permissões:
- Dono: `postgres`
- Permissões completas: `postgres`
- Permissão de leitura: `consulta`

---

## 💳 Tabela `conta` (Contas)

Tabela com as contas disponíveis no sistema.

```sql
create table public.conta (
	contacod serial,
	contades varchar,
	contatipo int,
	contavltotal numeric(14, 2),
	CONSTRAINT pk_conta PRIMARY KEY (contacod),
	CONSTRAINT fk_contatipo FOREIGN KEY (contatipo) REFERENCES public.contatipo(contatipocod)
);
```

- **contacod**: Código da conta (chave primária).
- **contades**: Descrição (ex: "CAIXA","CARTEIRA","BANCO INTER").
- **contatipo**: Tipo da conta (ex: "1","2","3","4" ou "5").
- **contavltotal**: Saldo total da conta (ex: "36000.00").


### 🔐 Permissões:
- Dono: `postgres`
- Permissões completas: `postgres`
- Permissão de leitura: `consulta`

---

## 💳 Tabela `categoria` (Categorias)

Tabela com as Categorias disponíveis no sistema.

```sql
create table public.categoria (
	catcod serial,
	catdes varchar,
	cattipo character,
	CONSTRAINT pk_cat PRIMARY KEY (catcod,catsta)
);
```

- **catcod**: Código da categoria (chave primária).
- **catdes**: Descrição (ex: "Transporte","Salario","Mercado").
- **catsta**: Status da categoria R ou D (ex: "Receita" ou "Despesa").

### ➕ Inserção de exemplo:
```sql
insert into categoria (catdes,catsta) values ('Salário','R');
insert into categoria (catdes,catsta) values ('Transporte','D');
insert into categoria (catdes,catsta) values ('Mercado','D');
insert into categoria (catdes,catsta) values ('Frelancer','R');
```


### 🔐 Permissões:
- Dono: `postgres`
- Permissões completas: `postgres`
- Permissão de leitura: `consulta`

---

## 💳 Tabela `natureza` (Natureza)

Tabela com as Naturezas disponíveis no sistema.

```sql
create table public.categoria (
	natcod serial,
	natdes varchar,
	CONSTRAINT pk_nat PRIMARY KEY (natcod,natdes)
);
```

- **natcod**: Código da natureza (chave primária).
- **natdes**: Descrição (ex: "Receita","Despesa").

### ➕ Inserção OBRIGATÓRIA:
```sql
insert into natureza (natdes) values('Despesa');
insert into natureza (natdes) values('Receita');

```


### 🔐 Permissões:
- Dono: `postgres`
- Permissões completas: `postgres`
- Permissão de leitura: `consulta`

---

## ✅ Consultas e Testes

### Ver todos os usuários:
```sql
SELECT * FROM usu;
```

### Ver tipos de cobrança:
```sql
SELECT * FROM tc;
```

### Ver documentos:
```sql
SELECT * FROM doc;
```

---

## 🔒 Segurança

As permissões foram definidas para garantir o controle de acesso:

- O usuário `postgres` possui controle total.
- O papel `consulta` possui acesso apenas de leitura.
