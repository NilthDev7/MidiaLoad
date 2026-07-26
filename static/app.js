document.addEventListener('DOMContentLoaded', () => {
    const downloadForm = document.getElementById('download-form');
    const youtubeUrlInput = document.getElementById('youtube-url');
    const searchBtn = document.getElementById('search-btn');

    const previewContainer = document.getElementById('preview-container');
    const videoThumbnail = document.getElementById('video-thumbnail');
    const videoTitle = document.getElementById('video-title');
    const videoDurationVal = document.getElementById('video-duration-val');

    const downloadAudioBtn = document.getElementById('download-audio-btn');
    const downloadVideoBtn = document.getElementById('download-video-btn');

    const statusContainer = document.getElementById('status-container');
    const statusText = document.getElementById('status-text');

    let currentVideoData = null;

    function resetUI() {
        previewContainer.classList.add('hidden');
        statusContainer.classList.add('hidden');
        searchBtn.disabled = false;
    }

    function showStatus(message) {
        statusText.textContent = message;
        statusContainer.classList.remove('hidden');
    }

    function hideStatus() {
        statusContainer.classList.add('hidden');
    }

    downloadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const url = youtubeUrlInput.value.trim();
        if (!url) return;

        resetUI();
        searchBtn.disabled = true;
        showStatus('Analisando o link do YouTube...');

        try {
            const response = await fetch('/api/info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url })
            });

            const data = await response.json();
            hideStatus();
            searchBtn.disabled = false;

            if (!response.ok) {
                alert(data.error || 'Erro ao buscar informações do vídeo.');
                return;
            }

            currentVideoData = data;
            videoThumbnail.src = data.thumbnail;
            videoTitle.textContent = data.title;
            videoDurationVal.textContent = data.duration;
            previewContainer.classList.remove('hidden');
        } catch (error) {
            hideStatus();
            searchBtn.disabled = false;
            console.error(error);
            alert('Não foi possível conectar ao servidor.');
        }
    });

    async function triggerDownload(type) {
        if (!currentVideoData) return;

        downloadAudioBtn.disabled = true;
        downloadVideoBtn.disabled = true;
        showStatus(type === 'audio' ? 'Processando e baixando áudio...' : 'Processando e baixando vídeo...');

        try {
            const response = await fetch('/api/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: currentVideoData.url,
                    type
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Erro ao processar o download.');
            }

            const disposition = response.headers.get('content-disposition');
            let filename = `MidiaLoad_${type === 'audio' ? 'audio.m4a' : 'video.mp4'}`;

            if (disposition && disposition.includes('attachment')) {
                const utf8Match = /filename\*=UTF-8''([^;]+)/i.exec(disposition);
                const plainMatch = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);

                if (utf8Match && utf8Match[1]) {
                    filename = decodeURIComponent(utf8Match[1]);
                } else if (plainMatch && plainMatch[1]) {
                    filename = plainMatch[1].replace(/['"]/g, '');
                }
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');

            a.style.display = 'none';
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            window.URL.revokeObjectURL(downloadUrl);
            hideStatus();
        } catch (error) {
            hideStatus();
            console.error(error);
            alert(error.message || 'Erro ao realizar o download.');
        } finally {
            downloadAudioBtn.disabled = false;
            downloadVideoBtn.disabled = false;
        }
    }

    downloadAudioBtn.addEventListener('click', () => triggerDownload('audio'));
    downloadVideoBtn.addEventListener('click', () => triggerDownload('video'));
});
