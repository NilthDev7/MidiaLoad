# 🏛️ MediaLoad - High-Fidelity YouTube Media Downloader

> **Plataforma privada, elegante e isenta de anúncios para download de áudios (M4A/MP3) e vídeos (MP4) do YouTube em alta fidelidade.**

---

## 📌 Visão Geral

O **MediaLoad** foi desenvolvido para oferecer uma experiência de download de mídia simples, rápida e 100% livre de anúncios, redirecionamentos ou rastreadores. 

Construído com uma arquitetura moderna e desacoplada, o projeto combina um backend em **Java 21 / Spring Boot 3.3** (seguindo os princípios **SOLID**) com um frontend de alta performance em **Next.js 16** sob um **design elegante e moderno**.

---

## ✨ Principais Funcionalidades

- 📲 **Suporte a PWA (App Instalável)**: Instalável nativamente na tela inicial de celulares (Android & iOS) e desktops como aplicativo.
- 🎵 **Extração de Áudio**: Download de trilhas em alta definição (formato nativo M4A).
- 🎬 **Download de Vídeo**: Seleção prévia de resoluções (720p HD, 480p SD, 360p Mobile).
- ⚡ **Processamento Assíncrono**: Polling de progresso em tempo real (0 a 100%).
- 🛡️ **Zero Anúncios & Rastreamento**: Experiência limpa e focada no usuário.
- 🧹 **Autolimpeza de Espaço**: Streaming direto com expurgo imediato de arquivos temporários do servidor.
- 🎨 **Design Elegante & Moderno**: Paleta refinada em Verde Obsidiana & Champagne Gold com tipografia serifada (*Playfair Display*).

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Backend** | Java 21 + Spring Boot 3.3 | API RESTful com execução de rotinas assíncronas e streaming de dados (`StreamingResponseBody`). |
| **Frontend** | Next.js 16 (App Router) + React | Interface reativa, Web App Manifest, Service Worker (PWA) e estilização customizada. |
| **Styling** | Tailwind CSS + Google Fonts | Utilização das fontes *Playfair Display* e *Plus Jakarta Sans*. |
| **Mídia Core** | `yt-dlp` | Processamento nativo via subprocessos OS sem a necessidade de dependências pesadas de conversão. |
| **Build Tools** | Maven & npm | Gerenciamento de dependências e empacotamento. |

---

## 📐 Arquitetura & Princípios SOLID

O backend foi construído aplicando rigorosamente os princípios **SOLID**:

- **S — Single Responsibility Principle (SRP)**: Cada classe possui um papel único no ecossistema (Controller, Services de busca/download, Tracker de estado e ProcessExecutor).
- **O — Open/Closed Principle (OCP)**: Interfaces `MetadataFetcher` e `FileDownloader` abertas para extensão de novos provedores de mídia sem alteração de código legado.
- **L — Liskov Substitution Principle (LSP)**: Substituição transparente de implementações de serviços.
- **I — Interface Segregation Principle (ISP)**: Interfaces focadas e segregadas para contextos específicos.
- **D — Dependency Inversion Principle (DIP)**: Injeção de dependências desacoplada via abstrações do Spring IoC.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Java 21 JDK** instalado
- **Node.js 18+** instalado
- **`yt-dlp`** disponível no `PATH` do sistema

### 1. Iniciar o Backend (Spring Boot)
```bash
cd backend
# Compilar e rodar a aplicação na porta 8085
./mvnw.cmd spring-boot:run
```

### 2. Iniciar o Frontend (Next.js)
```bash
cd frontend
# Instalar dependências e iniciar servidor de desenvolvimento
npm install
npm run dev
```

Acesse a aplicação em seu navegador: **`http://localhost:3000`**

---

## 📝 Licença & Autoria

Desenvolvido com ❤️ por **Nilth**.  
Disponível livremente para fins educacionais e uso pessoal.
