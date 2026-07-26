import Link from "next/link";

export const metadata = {
  title: "Sobre a Arquitetura - MediaLoad",
  description: "Especificações técnicas, padrões de projeto SOLID, suporte a PWA e tecnologias utilizadas no desenvolvimento do MediaLoad.",
};

export default function SobrePage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-between bg-[#0B0D0C] text-[#E5E2DB] font-sans px-4 py-10 md:py-16 selection:bg-[#C5A059] selection:text-[#0B0D0C]">
      
      {/* Header Container */}
      <div className="w-full max-w-2xl">
        
        {/* Navigation Back Link */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-serif-elegant text-[#C5A059] hover:text-[#F3E7C4] transition-colors border border-[#C5A059]/25 hover:border-[#C5A059]/60 px-3.5 py-1.5 rounded-full bg-[#121614]"
          >
            <span>←</span> Voltar para a Início
          </Link>

          <span className="text-[10px] uppercase tracking-[0.2em] text-[#7A766D]">
            Documentação Técnica
          </span>
        </div>

        {/* Title */}
        <header className="mb-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161B18] border border-[#C5A059]/30 text-[10px] uppercase tracking-[0.25em] text-[#C5A059] mb-4 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>
            Engenharia & Arquitetura de Software
          </div>
          <h1 className="font-serif-elegant text-3xl md:text-4xl font-semibold tracking-tight gold-gradient-text">
            Arquitetura & Tecnologias
          </h1>
          <p className="text-xs md:text-sm text-[#9E9A90] font-light leading-relaxed mt-2 max-w-xl">
            Uma visão aprofundada dos padrões de projeto SOLID, escolha de tecnologias, suporte a PWA e fluxo de processamento de mídia de alta performance do MediaLoad.
          </p>
        </header>

        {/* Content Section */}
        <main className="space-y-8">
          
          {/* Card 1: Visão Geral */}
          <section className="bg-[#121614] border border-[#C5A059]/20 rounded-2xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent"></div>
            
            <h2 className="font-serif-elegant text-xl text-[#F3E7C4] font-medium mb-3 flex items-center gap-2.5">
              <span className="text-[#C5A059]">01.</span> Visão Geral & Filosofia
            </h2>
            <p className="text-xs md:text-sm text-[#B8B3A8] font-light leading-relaxed">
              O <strong className="text-[#F3E7C4] font-normal">MediaLoad</strong> foi projetado para resolver o problema frequente de sites de download poluídos por anúncios invasivos, redirecionamentos e riscos de segurança. O objetivo principal foi entregar uma plataforma privada, rápida e totalmente responsiva, construída sobre pilares modernos de engenharia de software e Clean Code.
            </p>
          </section>

          {/* Card 2: Stack de Tecnologias */}
          <section className="bg-[#121614] border border-[#C5A059]/20 rounded-2xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent"></div>

            <h2 className="font-serif-elegant text-xl text-[#F3E7C4] font-medium mb-5 flex items-center gap-2.5">
              <span className="text-[#C5A059]">02.</span> Stack de Tecnologias
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Tech 1 */}
              <div className="bg-[#090C0A] p-4 rounded-xl border border-[#C5A059]/15">
                <div className="text-xs font-serif-elegant text-[#C5A059] font-medium uppercase tracking-wider mb-1">
                  Backend
                </div>
                <div className="text-sm font-medium text-[#F3E7C4] mb-2">Java 21 & Spring Boot 3.3</div>
                <p className="text-[11px] text-[#8C877D] font-light leading-relaxed">
                  API RESTful robusta com suporte a execução assíncrona (`CompletableFuture`), injeção de dependência nativa e streaming eficiente com `StreamingResponseBody`.
                </p>
              </div>

              {/* Tech 2 */}
              <div className="bg-[#090C0A] p-4 rounded-xl border border-[#C5A059]/15">
                <div className="text-xs font-serif-elegant text-[#C5A059] font-medium uppercase tracking-wider mb-1">
                  Frontend
                </div>
                <div className="text-sm font-medium text-[#F3E7C4] mb-2">Next.js 16 (App Router) & PWA</div>
                <p className="text-[11px] text-[#8C877D] font-light leading-relaxed">
                  Interface reativa com estilização Tailwind CSS, Web App Manifest gerado via código, Service Worker e instalabilidade nativa em celular.
                </p>
              </div>

              {/* Tech 3 */}
              <div className="bg-[#090C0A] p-4 rounded-xl border border-[#C5A059]/15">
                <div className="text-xs font-serif-elegant text-[#C5A059] font-medium uppercase tracking-wider mb-1">
                  Mídia & Processamento
                </div>
                <div className="text-sm font-medium text-[#F3E7C4] mb-2">Core yt-dlp Executável</div>
                <p className="text-[11px] text-[#8C877D] font-light leading-relaxed">
                  Execução otimizada via subprocessos Java nativos (`ProcessExecutor`), obtendo metadados JSON e realizando downloads diretos sem dependência de conversores pesados.
                </p>
              </div>

              {/* Tech 4 */}
              <div className="bg-[#090C0A] p-4 rounded-xl border border-[#C5A059]/15">
                <div className="text-xs font-serif-elegant text-[#C5A059] font-medium uppercase tracking-wider mb-1">
                  Design System
                </div>
                <div className="text-sm font-medium text-[#F3E7C4] mb-2">Design Elegante & Moderno</div>
                <p className="text-[11px] text-[#8C877D] font-light leading-relaxed">
                  Paleta nobre em verde obsidiana e champagne gold, tipografia serifada de prestígio (Playfair Display) e layout mobile-first desacoplado.
                </p>
              </div>

            </div>
          </section>

          {/* Card 3: Arquitetura SOLID */}
          <section className="bg-[#121614] border border-[#C5A059]/20 rounded-2xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent"></div>

            <h2 className="font-serif-elegant text-xl text-[#F3E7C4] font-medium mb-4 flex items-center gap-2.5">
              <span className="text-[#C5A059]">03.</span> Princípios SOLID Adotados
            </h2>

            <p className="text-xs md:text-sm text-[#B8B3A8] font-light leading-relaxed mb-5">
              O backend em Spring Boot foi rigorosamente estruturado seguindo os 5 princípios do SOLID:
            </p>

            <div className="space-y-4">
              
              {/* S */}
              <div className="bg-[#090C0A] p-4 rounded-xl border border-[#C5A059]/15">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-serif-elegant font-bold text-[#C5A059] text-sm">S</span>
                  <span className="text-xs font-medium text-[#F3E7C4]">Single Responsibility Principle (SRP)</span>
                </div>
                <p className="text-[11px] text-[#8C877D] font-light leading-relaxed">
                  Cada classe possui uma única razão para mudar. `MediaController` apenas gerencia rotas HTTP; `YouTubeProvider` cuida apenas da integração com mídia; `ProcessExecutor` lida estritamente com execução de sistema operacionais; e `InMemoryDownloadTracker` gerencia concorrência de estado.
                </p>
              </div>

              {/* O */}
              <div className="bg-[#090C0A] p-4 rounded-xl border border-[#C5A059]/15">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-serif-elegant font-bold text-[#C5A059] text-sm">O</span>
                  <span className="text-xs font-medium text-[#F3E7C4]">Open/Closed Principle (OCP)</span>
                </div>
                <p className="text-[11px] text-[#8C877D] font-light leading-relaxed">
                  O sistema está aberto para expansão e fechado para modificação. Através das interfaces `MetadataFetcher` e `FileDownloader`, novos provedores (como Vimeo ou Soundcloud) podem ser adicionados sem alterar o código existente do controller.
                </p>
              </div>

              {/* L */}
              <div className="bg-[#090C0A] p-4 rounded-xl border border-[#C5A059]/15">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-serif-elegant font-bold text-[#C5A059] text-sm">L</span>
                  <span className="text-xs font-medium text-[#F3E7C4]">Liskov Substitution Principle (LSP)</span>
                </div>
                <p className="text-[11px] text-[#8C877D] font-light leading-relaxed">
                  Qualquer classe que implemente `MetadataFetcher` ou `FileDownloader` pode substituir a implementação do `YouTubeProvider` sem alterar a consistência do comportamento do sistema.
                </p>
              </div>

              {/* I */}
              <div className="bg-[#090C0A] p-4 rounded-xl border border-[#C5A059]/15">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-serif-elegant font-bold text-[#C5A059] text-sm">I</span>
                  <span className="text-xs font-medium text-[#F3E7C4]">Interface Segregation Principle (ISP)</span>
                </div>
                <p className="text-[11px] text-[#8C877D] font-light leading-relaxed">
                  Em vez de uma interface genérica e gigante, foram criadas interfaces pequenas e específicas: `MetadataFetcher`, `FileDownloader` e `DownloadTracker`.
                </p>
              </div>

              {/* D */}
              <div className="bg-[#090C0A] p-4 rounded-xl border border-[#C5A059]/15">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-serif-elegant font-bold text-[#C5A059] text-sm">D</span>
                  <span className="text-xs font-medium text-[#F3E7C4]">Dependency Inversion Principle (DIP)</span>
                </div>
                <p className="text-[11px] text-[#8C877D] font-light leading-relaxed">
                  Os módulos de alto nível (Controller) não dependem de módulos de baixo nível diretamente, mas sim de abstrações/interfaces injetadas via o mecanismo de Inversão de Controle (IoC) do Spring.
                </p>
              </div>

            </div>
          </section>

          {/* Card 4: Fluxo de Transmissão de Mídia */}
          <section className="bg-[#121614] border border-[#C5A059]/20 rounded-2xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent"></div>

            <h2 className="font-serif-elegant text-xl text-[#F3E7C4] font-medium mb-3 flex items-center gap-2.5">
              <span className="text-[#C5A059]">04.</span> Ciclo de Vida do Download & Limpeza
            </h2>

            <p className="text-xs md:text-sm text-[#B8B3A8] font-light leading-relaxed mb-4">
              Para garantir eficiência em servidores e dispositivos móveis, o fluxo de download opera da seguinte forma:
            </p>

            <ol className="list-decimal list-inside space-y-2.5 text-xs text-[#8C877D] font-light leading-relaxed">
              <li><strong className="text-[#F3E7C4] font-normal">Consulta de Metadados:</strong> Chamada assíncrona obtém título, duração, autor e thumbnail via payload JSON limpo.</li>
              <li><strong className="text-[#F3E7C4] font-normal">Disparo do Job:</strong> A rota POST registra um `downloadId` UUID e inicia o subprocesso em segundo plano.</li>
              <li><strong className="text-[#F3E7C4] font-normal">Monitoramento Real-time:</strong> O frontend faz polling no status a cada 1 segundo com barra de progresso responsiva.</li>
              <li><strong className="text-[#F3E7C4] font-normal">Streaming & Autolimpeza:</strong> Ao atingir 100%, o arquivo é servido via `StreamingResponseBody` no HTTP Response e imediatamente excluído do disco assim que o fluxo termina, garantindo consumo zero de espaço persistente.</li>
            </ol>
          </section>

          {/* Card 5: Suporte a PWA */}
          <section className="bg-[#121614] border border-[#C5A059]/20 rounded-2xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent"></div>

            <h2 className="font-serif-elegant text-xl text-[#F3E7C4] font-medium mb-3 flex items-center gap-2.5">
              <span className="text-[#C5A059]">05.</span> Suporte PWA (Aplicativo Instalável)
            </h2>

            <p className="text-xs md:text-sm text-[#B8B3A8] font-light leading-relaxed mb-4">
              O MediaLoad foi adaptado como um <strong className="text-[#F3E7C4] font-normal">Progressive Web App (PWA)</strong> completo. Isso permite que qualquer usuário adicione a plataforma diretamente à tela inicial do celular ou desktop como um app nativo, eliminando a necessidade de buscar o link no navegador repetidamente.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#8C877D] font-light">
              <div className="bg-[#090C0A] p-4 rounded-xl border border-[#C5A059]/15">
                <div className="font-medium text-[#F3E7C4] mb-1.5 flex items-center gap-2">
                  <span>🤖</span> Android & Chrome Desktop
                </div>
                <p className="text-[11px] leading-relaxed">
                  Intercepta o evento `beforeinstallprompt` e disponibiliza o botão <strong className="text-[#C5A059] font-normal">Instalar App</strong> no topo da interface para instalação imediata em 1 clique.
                </p>
              </div>

              <div className="bg-[#090C0A] p-4 rounded-xl border border-[#C5A059]/15">
                <div className="font-medium text-[#F3E7C4] mb-1.5 flex items-center gap-2">
                  <span>🍎</span> iPhone (iOS Safari)
                </div>
                <p className="text-[11px] leading-relaxed">
                  Integrado com as tags de suporte Apple. Exibe banner intuitivo indicando o fluxo: <span className="text-[#C5A059]">Compartilhar ➔ Adicionar à Tela de Início</span>.
                </p>
              </div>
            </div>
          </section>

        </main>

        {/* Footer */}
        <footer className="w-full text-center mt-12 text-[11px] text-[#7A766D] font-light tracking-wider">
          Site desenvolvido de ❤️ por <span className="font-serif-elegant text-[#C5A059] font-medium">Nilth</span>
        </footer>

      </div>
    </div>
  );
}
