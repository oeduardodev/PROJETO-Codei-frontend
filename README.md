# CODEI Frontend

<div align="center">
  <h1>Codei</h1>
  <p>
    <strong>
      Plataforma frontend da rede social construída para desenvolvedores compartilharem evolução técnica, experiências, projetos e interações em tempo real.
    </strong>
  </p>

  <p>
    O Codei Frontend é responsável por toda a experiência visual e interativa da plataforma, oferecendo uma arquitetura moderna baseada em Angular 17, renderização reativa, comunicação em tempo real e gerenciamento eficiente de estado para suportar uma experiência social fluida e escalável.
  </p>
</div>

---

# Visão Geral

O **Codei Frontend** é a camada cliente da plataforma Codei, uma rede social voltada para programadores e estudantes de tecnologia.

A aplicação foi desenvolvida utilizando uma arquitetura componentizada moderna com **Angular 17**, focando em:

* Alta reutilização de componentes
* Fluxos reativos
* Performance de renderização
* Separação de responsabilidades
* Escalabilidade de funcionalidades sociais
* Experiência visual dinâmica

A interface centraliza funcionalidades típicas de uma plataforma social moderna, incluindo:

* Feed de publicações
* Perfis técnicos
* Sistema de amizades
* Comentários e curtidas
* Mensageria em tempo real
* Busca de usuários
* Notificações
* Upload e edição de imagens

---

# Arquitetura Frontend

A aplicação segue uma estrutura modular orientada por domínio, separando responsabilidades entre:

* Components
* Services
* Models
* Directives
* Guards
* Interceptors
* Environment configs

O projeto utiliza os recursos modernos do Angular 17, incluindo:

* Standalone Components
* Angular Signals
* Computed Signals
* Dependency Injection otimizada
* Lazy loading de rotas
* RxJS para fluxos assíncronos
* Interceptors HTTP
* Guards de autenticação

---

# Principais Funcionalidades

## Rede social completa

* Feed de publicações em tempo real
* Sistema de comentários e curtidas
* Perfis personalizados
* Lista de amizades
* Busca de usuários
* Descoberta de perfis

## Sistema de autenticação

* Login e registro de usuários
* Persistência de sessão com JWT
* Interceptor para autenticação automática
* Controle de acesso por rotas protegidas

## Chat em tempo real

* Comunicação via WebSocket utilizando Socket.IO
* Atualização instantânea de mensagens
* Sincronização de conversas em tempo real
* Eventos reativos integrados ao frontend

## Upload e manipulação de mídia

* Upload de imagens para perfil e posts
* Crop e tratamento visual utilizando CropperJS
* Preview de mídia antes do envio

---

# Stack Tecnológica

| Categoria                     | Tecnologias                 |
| ----------------------------- | --------------------------- |
| Framework                     | Angular 17                  |
| Linguagem                     | TypeScript                  |
| Arquitetura reativa           | RxJS + Angular Signals      |
| Gerenciamento de estado local | Signals / Computed          |
| Comunicação HTTP              | HttpClient                  |
| Tempo real                    | Socket.IO Client            |
| Navegação                     | Angular Router              |
| Autenticação                  | JWT + HTTP Interceptors     |
| UI/UX                         | HTML5 + CSS3                |
| Ícones                        | Font Awesome + Devicon      |
| Efeitos visuais               | ngx-typed-js + ngx-teximate |
| Manipulação de imagem         | CropperJS                   |
| Qualidade de código           | ESLint                      |
| Testes                        | Karma + Jasmine             |

---

# Engenharia Frontend

## Componentização

A aplicação foi construída com foco em reutilização de componentes e isolamento de responsabilidade visual e lógica.

Exemplos:

* Cards de publicação
* Componentes de perfil
* Inputs reutilizáveis
* Modais
* Componentes de chat
* Sistema de notificações
* Componentes de loading/skeleton

## Reatividade

O frontend utiliza dois modelos complementares:

### RxJS

Responsável principalmente por:

* Requisições HTTP
* Streams assíncronas
* Eventos Socket.IO
* Fluxos observáveis

### Angular Signals

Utilizados para:

* Estado local reativo
* Atualizações eficientes de UI
* Computed state
* Redução de re-renderizações desnecessárias

---

# Sistema de Rotas

As rotas refletem diretamente os domínios da plataforma:

| Rota                | Descrição                     |
| ------------------- | ----------------------------- |
| `/`                 | Feed principal                |
| `/login`            | Login                         |
| `/register`         | Cadastro                      |
| `/profile/me`       | Perfil do usuário autenticado |
| `/profile/:id`      | Perfil público                |
| `/moments/new`      | Criação de publicação         |
| `/moments/edit/:id` | Edição de publicação          |
| `/moments/:id`      | Detalhes do post              |
| `/chat`             | Sistema de mensagens          |

---

# Integração com Backend

O frontend consome a API da plataforma através de uma camada centralizada de serviços.

## Comunicação HTTP

Implementada utilizando:

* Angular HttpClient
* Interceptors
* Tratamento global de autenticação
* Headers automáticos JWT

## Comunicação em tempo real

O sistema de chat utiliza:

* Socket.IO Client
* Eventos bidirecionais
* Atualização instantânea de mensagens
* Escuta reativa de eventos do servidor

## Configuração de ambiente

Os endpoints são separados por ambiente:

```text
src/app/environment/
```

### Desenvolvimento

```text
http://127.0.0.1:3333
```

### Produção

```text
API hospedada no Render
```

---

# Estrutura do Projeto

```text
src/
 ├── app/
 │    ├── components/      # Componentes reutilizáveis e páginas
 │    ├── services/        # Comunicação HTTP e regras de negócio
 │    ├── models/          # Interfaces e tipagens TypeScript
 │    ├── directives/      # Diretivas customizadas
 │    ├── guards/          # Proteção de rotas
 │    ├── interceptors/    # Interceptores HTTP/JWT
 │    ├── environment/     # Configurações de ambiente
 │    └── shared/          # Recursos compartilhados
 │
 ├── assets/               # Imagens, mídia e recursos visuais
 └── styles/               # Estilos globais
```

---

# Performance e Experiência

O frontend foi pensado para entregar uma experiência social fluida mesmo em interações constantes.

## Estratégias utilizadas

* Lazy loading de rotas
* Atualização reativa eficiente
* Separação de estado local
* Redução de renderizações desnecessárias
* Componentização granular
* Reaproveitamento de streams RxJS

## Experiência visual

A identidade visual busca aproximar o ambiente da cultura dev:

* Ícones técnicos
* Estética inspirada em plataformas sociais modernas
* Elementos voltados ao universo de programação
* Micro interações visuais
* Feedback visual em ações do usuário

---

# Como Executar Localmente

## Pré-requisitos

* Node.js 18+
* npm
* Backend do Codei rodando localmente

---

## Instalação

```bash
npm install
```

---

## Ambiente de desenvolvimento

```bash
npm start
```

Aplicação disponível em:

```text
http://localhost:4200
```

---

# Scripts Disponíveis

```bash
npm start
# Inicia o servidor de desenvolvimento

npm run build
# Gera build otimizada de produção

npm run watch
# Build contínua em modo observação

npm run lint
# Executa análise estática com ESLint

npm test
# Executa testes unitários com Karma/Jasmine
```

---

# Qualidade e Manutenção

O projeto segue práticas modernas de desenvolvimento frontend:

* Organização escalável
* Tipagem forte com TypeScript
* Separação de responsabilidades
* Arquitetura reativa
* Código reutilizável
* Estrutura preparada para expansão futura

Além disso, a aplicação foi construída pensando em evolução contínua de:

* UX
* Performance
* Acessibilidade
* Responsividade
* Recursos sociais
* Escalabilidade da interface

---

# Ideia do Produto

O Codei nasce da ideia de unir:

* Rede social
* Evolução profissional
* Compartilhamento técnico
* Comunidade
* Conversa em tempo real
* Identidade dev

em uma única plataforma.

Mais do que consumir conteúdo, a proposta é criar um ambiente onde programadores possam mostrar evolução, trocar experiências, compartilhar dificuldades e construir conexões dentro da área de tecnologia.

---

# Status do Projeto

🚧 Projeto em evolução contínua.

A base frontend já possui arquitetura sólida para suportar:

* Novas funcionalidades sociais
* Melhorias de UX
* Expansão do sistema de tempo real
* Recursos avançados de perfil
* Escalabilidade da plataforma
* Refinamentos de performance e acessibilidade
