# 🏭 Metalizze: Gestão de Estoque de Chapas Metálicas

**Metalizze** é uma aplicação completa (Full Stack) desenvolvida para digitalizar e otimizar o controle de inventário de chapas metálicas, fornecendo uma visão unificada e em tempo real do estoque e de todas as alterações realizadas.

## ✨ Badges de Tecnologia

<div align="center">

  <!--
    ![Static Badge](https://img.shields.io/badge/ReactNative-blue?style=for-the-badge&logo=React&logoColor=white)
  -->
  [![My Skills](https://skillicons.dev/icons?i=typescript,nestjs,nextjs,react,prisma,postgres,docker,pnpm&theme=dark)](https://skillicons.dev)

</div>

-----

## 📄 Briefing Inicial e Solução

### Problema (Briefing)

No processo de recebimento de chapa e controle de estoque existiam diversos problemas que iam desde o momento que a chapa chegava na oficina até o momento que iria para alguma máquina, para ser cortada ou dobrada, como por exemplo, quem manuseou ou até quem recebeu as chapas. Além disso, enfrentava-se muitos desafios no momento em saber quais chapas tinham no estoque e quais seus tamanhos e onde estavam, que acarretava em desperdícios de chapas e inutilizações de retalhos que poderiam ser úteis.

### Solução (Metalizze)

Como solução, foi arquiteto um sistema que pudesse gerenciar todas as movimentações dessas chapas e estocagem, desde o inicio até o fim da vida útil da chapa, assim foi pensado o **Metalizze**, uma aplicação que seja focada em Performance, Integridade e Compatibilidade com diversos sistemas, de maneira a solucionar totalmente os desafios enfrentados pela oficina, com as seguintes Tecnologias:

1.  **Backend (API):** Desenvolvido em **NestJS**, focado na integridade de dados via **Prisma** e **PostgreSQL**. Implementa uma camada de **Histórico/Auditoria** obrigatória para cada alteração, utilizando-se do **WebSockets (Socket.IO)** para notificação instantânea.
2.  **Frontend (Web):** Interface administrativa e operacional em **Next.js**, garantindo uma maior compatibilidade e versatilidade no desktop.
3.  **Mobile (App):** Aplicação de campo em **React Native (Expo)**, permitindo a gestão do estoque diretamente no local de armazenagem, sem estar preso a um local fixo, podendo realizar leituras e alterações direto no estoque.

### Principais Features

  * **CRUD Completo de Chapas:** Criação, leitura, atualização e exclusão de registros (com *soft delete* do histórico via *Cascade Delete*).
  * **Histórico de Auditoria em Tempo Real:** Registro obrigatório de `Valor Antigo` e `Novo Valor` para cada campo alterado, exibido na tela de detalhes.
  * **Sincronização Instantânea (WebSockets):** Uso de Socket.IO para garantir que, ao adicionar ou editar uma chapa em um cliente (ex: Web), todos os outros clientes (Mobile e outros navegadores) sejam **notificados imediatamente**, atualizando suas listas sem recarregamento.
  * **Tratamento de Inputs:** Conversão automática dos inputs para padrões brasileiros utilizados, pois existe muita quebra de padrão no sistema de gerenciamento de chapas.
  * **Visualização Abreviada de UUIDs:** Implementação de um formatador para reduzir a poluição visual, exibindo `XXXXXX...XXXXXX` nas listas e títulos a fim de obter uma melhor visualização do código e pesquisa manual.

-----

## 🛠️ Passo a Passo para Instalação

O projeto utiliza **Docker** para gerenciar a base de dados PostgreSQL e **pnpm** como gerenciador de pacotes no Monorepo.

### Pré-requisitos

Você precisa ter instalado em sua máquina:

  * **Node.js** (v18+ recomendado)
  * **pnpm** (`npm install -g pnpm`)
  * **Docker** e **Docker Compose**
  * **Expo CLI** (Para rodar o projeto Mobile)

### 1\. Clone o Repositório

```bash
git clone https://github.com/luanrf5g/sheet-systems.git metalizze
cd metalizze
```

### 2\. Configuração do Docker (Banco de Dados)

Execute o Docker Compose para iniciar o container do PostgreSQL:

```bash
docker-compose up -d
```

> Isso iniciará o banco de dados e o deixará acessível na porta `5432`.

### 3\. Configuração de Variáveis de Ambiente

O projeto requer um arquivo `.env` para o banco de dados e as URLs de API.

Crie um arquivo chamado **`.env`** na raiz da pasta **`backend-systems`** com o seguinte conteúdo:

```dotenv
# backend-systems/.env

# Configuração do PostgreSQL (ajustar conforme sua senha no docker-compose)
DATABASE_URL="postgresql://admin:pwd1234@localhost:5432/sheets_db?schema=public"

# Porta da aplicação NestJS
PORT=3333
```

Crie um arquivo chamado **`.env.local`** na raiz da pasta **`frontend-systems`** com o seguinte conteúdo:

```dotenv
# frontend-systems/.env.local

# URL da API do NestJS (usada pelo Next.js e WebSockets)
NEXT_PUBLIC_API_URL=http://localhost:3333
```

Para criar o arquivo das variáveis ambiente para o mobile, você precisa primeiro saber o código ip da sua máquina, no seu terminal rode comando ```ipconfig``` e pegue o **Endereço IPv4**, crie um arquivo chamado **`.env`** na raiz da pasta **`mobile-systems`** e cole o seguinte conteúdo:

```dotenv
# mobile-systems/.env

# URL da API do NestJS
EXPO_PUBLIC_MY_LOCAL_IP= *Cole aqui o seu endereço de IP sem aspas*
```

### 4\. Instalação e Configuração Inicial

Entre em cada pasta do Monorepo e faça as instalações de todas as dependencias:

```bash
# Instala todas as dependências do monorepo
pnpm install
```

> No backend, lembre-se de aplicar as migrações do prisma, pois não são aplicadas por padrão.

```bash

# Aplica as migrações do Prisma no banco de dados e Gera o Client
pnpm prisma migrate dev
```


### 5\. Executando os Projetos

Você pode iniciar o backend e os frontends em terminais separados:

#### A. Backend (API NestJS)

```bash
cd backend-chapas
pnpm run start:dev
# A API estará disponível em http://localhost:3333
```

Caso acuse algum erro no module `Prisma.Cliente`, ainda dentro da basta **`backend-sysmtes`** rode o seguinte comando:

```bash
pnpm prisma generate
```

Após esse comanda, será gerado o client do prisma, podendo assim fazer as chapas no banco de dados, e corrindo o erro.

#### B. Frontend (Next.js - Web)

```bash
cd frontend-chapas
pnpm run dev
# O Frontend Web estará disponível em http://localhost:3000
```

#### C. Mobile (React Native - Expo)

```bash
cd mobile-chapas
pnpm run start
# Siga as instruções no terminal para abrir no emulador ou no seu celular.
```

-----

## 🗺️ Estrutura do Monorepo

O projeto está dividido em três principais diretórios:

  * **`backend-systems`**: API RESTful e WebSocket Gateway (NestJS/Prisma/PostgreSQL).
  * **`frontend-systems`**: Aplicação Web (Next.js/React/Tailwind CSS).
  * **`mobile-systems`**: Aplicação Mobile (React Native/Expo).
