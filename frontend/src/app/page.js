"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [videoInfo, setVideoInfo] = useState(null);
  
  // Download states
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStatusText, setDownloadStatusText] = useState("");
  const [activeDownloadId, setActiveDownloadId] = useState("");
  
  // Quality states
  const [videoQuality, setVideoQuality] = useState("720");
  const [audioQuality, setAudioQuality] = useState("high");

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  const backendUrl = "http://localhost:8085";

  useEffect(() => {
    // Register Service Worker for PWA
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("Service Worker registrado com sucesso:", reg.scope))
        .catch((err) => console.error("Falha ao registrar Service Worker:", err));
    }

    // Capture beforeinstallprompt event (Android / Chrome / Desktop)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Check for iOS Safari environment
    if (typeof window !== "undefined") {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      const isStandalone = window.navigator.standalone || window.matchMedia("(display-mode: standalone)").matches;
      if (isIOS && !isStandalone) {
        setShowIOSPrompt(true);
      }
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    }
  };

  const validateUrl = (urlStr) => {
    return urlStr.includes("youtube.com") || urlStr.includes("youtu.be");
  };

  const handleFetchInfo = async (e) => {
    e.preventDefault();
    if (!url) return;

    if (!validateUrl(url)) {
      setError("Por favor, insira um link válido do YouTube.");
      return;
    }

    setLoading(true);
    setError("");
    setVideoInfo(null);

    try {
      const res = await fetch(`${backendUrl}/api/media/info?url=${encodeURIComponent(url)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao buscar informações do vídeo");
      }

      setVideoInfo(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (type) => {
    if (!videoInfo) return;

    setDownloading(true);
    setDownloadProgress(0);
    setDownloadStatusText("Iniciando download...");
    setError("");

    const quality = type === "video" ? videoQuality : audioQuality;

    try {
      const res = await fetch(`${backendUrl}/api/media/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: videoInfo.url,
          type: type,
          quality: quality,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao iniciar download");
      }

      setActiveDownloadId(data.downloadId);
    } catch (err) {
      setError(err.message);
      setDownloading(false);
    }
  };

  // Poll status when activeDownloadId is set
  useEffect(() => {
    if (!activeDownloadId) return;

    let intervalId = setInterval(async () => {
      try {
        const res = await fetch(`${backendUrl}/api/media/status/${activeDownloadId}`);
        if (!res.ok) throw new Error("Status do download não encontrado");
        
        const data = await res.json();
        
        if (data.status === "DOWNLOADING") {
          setDownloadProgress(data.progress);
          setDownloadStatusText(`Processando mídia... ${data.progress}%`);
        } else if (data.status === "COMPLETED") {
          setDownloadProgress(100);
          setDownloadStatusText("Download concluído! Transferindo...");
          clearInterval(intervalId);
          setActiveDownloadId("");
          
          // Trigger file download
          window.location.href = `${backendUrl}/api/media/files/${data.id}`;
          
          // Reset states after a small delay
          setTimeout(() => {
            setDownloading(false);
            setDownloadProgress(0);
            setDownloadStatusText("");
          }, 3000);
        } else if (data.status === "ERROR") {
          throw new Error(data.error || "Erro durante o processamento do download.");
        }
      } catch (err) {
        setError(err.message);
        setDownloading(false);
        setActiveDownloadId("");
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [activeDownloadId]);

  const formatDuration = (sec) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen items-center justify-between bg-[#0B0D0C] text-[#E5E2DB] font-sans px-4 py-10 md:py-16 selection:bg-[#C5A059] selection:text-[#0B0D0C]">
      
      {/* Top Banner / Header */}
      <header className="w-full max-w-md text-center flex flex-col items-center">
        {/* Badge & Navigation Links */}
        <div className="w-full flex items-center justify-between mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161B18] border border-[#C5A059]/30 text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-medium shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>
            Design Elegante & Moderno
          </div>

          <div className="flex items-center gap-2">
            {/* PWA Install Button if prompt ready */}
            {deferredPrompt && (
              <button
                onClick={handleInstallPWA}
                className="inline-flex items-center gap-1.5 text-[11px] font-serif-elegant text-[#0B0D0C] bg-[#C5A059] hover:bg-[#F3E7C4] transition-colors px-3 py-1 rounded-full shadow-sm font-semibold"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Instalar App</span>
              </button>
            )}

            <Link
              href="/sobre"
              className="inline-flex items-center gap-1.5 text-[11px] font-serif-elegant text-[#C5A059] hover:text-[#F3E7C4] transition-colors border border-[#C5A059]/25 hover:border-[#C5A059]/60 px-3 py-1 rounded-full bg-[#121614] shadow-sm"
            >
              <span>Sobre</span>
              <svg className="w-3 h-3 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Title with Gold Emblem */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <img src="/icon.svg" alt="MediaLoad Logo" className="w-10 h-10 drop-shadow-[0_2px_10px_rgba(197,160,89,0.2)]" />
          <h1 className="font-serif-elegant text-4xl md:text-5xl font-semibold tracking-tight gold-gradient-text">
            MediaLoad
          </h1>
        </div>

        <p className="text-xs md:text-sm text-[#9E9A90] font-light max-w-xs leading-relaxed tracking-wide mt-1">
          Download de áudio e vídeo de alta performance. Isento de rastreamento e anúncios.
        </p>
      </header>

      {/* Main Card */}
      <main className="w-full max-w-md my-auto my-8 bg-[#121614] border border-[#C5A059]/20 rounded-2xl p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.6)] relative overflow-hidden backdrop-blur-md">
        
        {/* Subtle Decorative Hairline */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent"></div>

        {/* iOS PWA Banner Helper */}
        {showIOSPrompt && (
          <div className="mb-5 p-3 bg-[#18201B] border border-[#C5A059]/30 rounded-xl text-xs text-[#F3E7C4] flex items-center justify-between gap-2 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-base">📲</span>
              <span className="text-[11px] font-light leading-tight">
                Instale no iPhone: Toque em <strong className="text-[#C5A059] font-medium">Compartilhar</strong> ➔ <strong className="text-[#C5A059] font-medium">Adicionar à Tela de Início</strong>.
              </span>
            </div>
            <button
              onClick={() => setShowIOSPrompt(false)}
              className="text-[#8C877D] hover:text-[#C5A059] p-1 text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleFetchInfo} className="space-y-5">
          <div>
            <label htmlFor="url-input" className="block text-[11px] font-medium text-[#C5A059] uppercase tracking-[0.18em] mb-2.5">
              URL do Vídeo
            </label>
            <div className="relative">
              <input
                id="url-input"
                type="text"
                placeholder="Insira o link do YouTube aqui..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading || downloading}
                className="w-full bg-[#080A09] border border-[#C5A059]/25 focus:border-[#C5A059] rounded-xl py-3.5 px-4 pr-11 text-xs md:text-sm text-[#F5E6C4] placeholder-[#5A5852] outline-none transition-all duration-300 font-light gold-border-glow"
              />
              {url && (
                <button
                  type="button"
                  onClick={() => setUrl("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A766D] hover:text-[#C5A059] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || downloading || !url}
            className="w-full relative group overflow-hidden bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#9E7938] hover:from-[#D4AF37] hover:to-[#C5A059] disabled:from-[#1E2320] disabled:to-[#1E2320] disabled:text-[#4A4F4C] text-[#0D0F0E] font-medium text-xs md:text-sm py-3.5 px-4 rounded-xl shadow-md transition-all duration-300 tracking-wider uppercase active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-[#0D0F0E]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="font-serif-elegant lowercase first-letter:uppercase">Analisando mídia...</span>
              </>
            ) : (
              <span className="font-serif-elegant font-semibold lowercase first-letter:uppercase tracking-normal text-sm">Analisar Vídeo</span>
            )}
          </button>
        </form>

        {/* Error Alert */}
        {error && (
          <div className="mt-5 p-3.5 bg-[#1C1213] border border-[#8C3A3A]/40 rounded-xl text-xs text-[#E8A5A5] flex gap-2.5 items-start">
            <svg className="w-4 h-4 text-[#D96B6B] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-light leading-relaxed">{error}</span>
          </div>
        )}

        {/* Video Metadata Card */}
        {videoInfo && !downloading && (
          <div className="mt-6 border-t border-[#C5A059]/15 pt-6 animate-fadeIn">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-[#080A09] border border-[#C5A059]/20 shadow-inner">
              <img
                src={videoInfo.thumbnail}
                alt={videoInfo.title}
                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
              />
              <span className="absolute bottom-2.5 right-2.5 bg-[#0D0F0E]/90 text-[#C5A059] text-[10px] px-2 py-0.5 rounded border border-[#C5A059]/30 font-mono tracking-wider">
                {formatDuration(videoInfo.duration)}
              </span>
            </div>
            
            <div className="mt-3.5">
              <h3 className="font-serif-elegant text-base text-[#F3E7C4] line-clamp-2 leading-snug font-medium">
                {videoInfo.title}
              </h3>
              <p className="text-[11px] text-[#8C877D] font-light mt-1 tracking-wide">
                Canal: <span className="text-[#C5A059]">{videoInfo.author}</span>
              </p>
            </div>

            {/* Quality Selectors */}
            <div className="mt-5 grid grid-cols-2 gap-3 bg-[#090C0A] p-3.5 rounded-xl border border-[#C5A059]/15">
              <div>
                <label htmlFor="audio-quality" className="block text-[9px] font-medium text-[#C5A059] uppercase tracking-[0.2em] mb-1.5">
                  Áudio (Formato)
                </label>
                <select
                  id="audio-quality"
                  value={audioQuality}
                  onChange={(e) => setAudioQuality(e.target.value)}
                  className="w-full bg-[#121614] text-xs text-[#E5E2DB] border border-[#C5A059]/20 rounded-lg p-2 outline-none focus:border-[#C5A059] transition-colors font-light"
                >
                  <option value="high">Alta Definição (M4A)</option>
                  <option value="medium">Modesta (64kbps M4A)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="video-quality" className="block text-[9px] font-medium text-[#C5A059] uppercase tracking-[0.2em] mb-1.5">
                  Vídeo (Resolução)
                </label>
                <select
                  id="video-quality"
                  value={videoQuality}
                  onChange={(e) => setVideoQuality(e.target.value)}
                  className="w-full bg-[#121614] text-xs text-[#E5E2DB] border border-[#C5A059]/20 rounded-lg p-2 outline-none focus:border-[#C5A059] transition-colors font-light"
                >
                  <option value="720">720p HD</option>
                  <option value="480">480p SD</option>
                  <option value="360">360p Mobile</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => handleDownload("audio")}
                className="group relative bg-[#090C0A] hover:bg-[#151A17] border border-[#C5A059]/30 hover:border-[#C5A059] text-[#F3E7C4] py-3.5 px-3 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-1.5 shadow-sm"
              >
                <svg className="w-4 h-4 text-[#C5A059] group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <span className="text-[11px] font-serif-elegant font-medium text-[#C5A059]">Extrair Áudio</span>
              </button>
              
              <button
                onClick={() => handleDownload("video")}
                className="group relative bg-[#1B241E] hover:bg-[#232F27] border border-[#C5A059]/40 hover:border-[#C5A059] text-[#F3E7C4] py-3.5 px-3 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-1.5 shadow-sm"
              >
                <svg className="w-4 h-4 text-[#C5A059] group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="text-[11px] font-serif-elegant font-medium text-[#F3E7C4]">Baixar Vídeo</span>
              </button>
            </div>
          </div>
        )}

        {/* Download Progress Card */}
        {downloading && (
          <div className="mt-6 border-t border-[#C5A059]/15 pt-6 space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center text-xs">
              <span className="font-serif-elegant text-[#C5A059] tracking-wider text-[11px]">{downloadStatusText}</span>
              <span className="font-mono text-[#F5E6C4] font-medium">{downloadProgress}%</span>
            </div>
            
            <div className="w-full bg-[#080A09] rounded-full h-2 overflow-hidden border border-[#C5A059]/20 p-[1px]">
              <div
                className="bg-gradient-to-r from-[#8A6D2B] via-[#C5A059] to-[#F3E7C4] h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${downloadProgress}%` }}
              ></div>
            </div>

            <p className="text-[10px] text-[#7A766D] text-center font-light leading-relaxed tracking-wide">
              Processamento em execução no servidor. Permaneça na tela enquanto o arquivo é preparado.
            </p>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full max-w-md text-center mt-6 text-[11px] text-[#7A766D] font-light tracking-wider">
        Site desenvolvido de ❤️ por <span className="font-serif-elegant text-[#C5A059] font-medium">Nilth</span>
      </footer>
    </div>
  );
}
