export default function manifest() {
  return {
    name: 'MediaLoad - Download de Mídia',
    short_name: 'MediaLoad',
    description: 'Baixe vídeos em MP4 e áudios em M4A do YouTube de forma rápida, segura e sem anúncios.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B0D0C',
    theme_color: '#0B0D0C',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
