# MidiaLoad

Aplicação Flask simples para analisar links do YouTube e baixar áudio ou vídeo com `yt-dlp`.

## Rodar localmente

```bash
python -m pip install -r requirements.txt
python app.py
```

Abra `http://localhost:5000`.

## Deploy no Vercel

O projeto usa `api/index.py` como entrypoint Python e redireciona todas as rotas pelo `vercel.json`.

No painel do Vercel, deixe o Root Directory na raiz do repositório.
