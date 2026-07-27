import os
import shutil
import uuid
from mimetypes import guess_type
from pathlib import Path
from urllib.parse import quote

from flask import Flask, Response, render_template, request
import yt_dlp


BASE_DIR = Path(__file__).resolve().parent
DOWNLOAD_DIR = Path(os.getenv("TMPDIR", "/tmp")) / "midiaload-downloads"
DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)

app = Flask(
    __name__,
    template_folder=str(BASE_DIR / "templates"),
    static_folder=str(BASE_DIR / "static"),
)


def format_duration(seconds):
    if not seconds:
        return "Desconhecido"

    minutes, secs = divmod(int(seconds), 60)
    hours, minutes = divmod(minutes, 60)
    if hours:
        return f"{hours:02d}:{minutes:02d}:{secs:02d}"
    return f"{minutes:02d}:{secs:02d}"


def fetch_video_info(url):
    options = {
        "quiet": True,
        "no_warnings": True,
        "skip_download": True,
    }

    with yt_dlp.YoutubeDL(options) as ydl:
        info = ydl.extract_info(url, download=False)

    return {
        "url": url,
        "title": info.get("title") or "Vídeo sem título",
        "thumbnail": info.get("thumbnail") or "",
        "duration": format_duration(info.get("duration")),
    }


def download_media(url, media_type):
    download_path = DOWNLOAD_DIR / str(uuid.uuid4())
    download_path.mkdir(parents=True, exist_ok=True)

    options = {
        "outtmpl": str(download_path / "%(title).180B.%(ext)s"),
        "quiet": True,
        "no_warnings": True,
        "noprogress": True,
        "restrictfilenames": True,
    }

    if media_type == "audio":
        options["format"] = "m4a/bestaudio/best"
    else:
        options["format"] = "best[ext=mp4]/best"

    try:
        with yt_dlp.YoutubeDL(options) as ydl:
            ydl.extract_info(url, download=True)

        files = [item for item in download_path.iterdir() if item.is_file()]
        if not files:
            raise RuntimeError("Arquivo não pôde ser baixado.")

        file_path = files[0]
        file_bytes = file_path.read_bytes()
        filename = file_path.name
        content_type = guess_type(filename)[0] or "application/octet-stream"
        return file_bytes, filename, content_type
    finally:
        shutil.rmtree(download_path, ignore_errors=True)


@app.get("/")
def home():
    return render_template("index.html")


@app.post("/info")
def info():
    url = request.form.get("url", "").strip()
    if not url:
        return render_template("index.html", error="Cole um link do YouTube para continuar."), 400

    try:
        video = fetch_video_info(url)
        return render_template("index.html", video=video)
    except Exception as exc:
        return render_template("index.html", error=f"Não consegui ler esse vídeo: {exc}", url=url), 500


@app.post("/download")
def download():
    url = request.form.get("url", "").strip()
    media_type = request.form.get("type", "").strip()

    if not url or media_type not in {"audio", "video"}:
        return render_template("index.html", error="Pedido de download inválido.", url=url), 400

    try:
        file_bytes, filename, content_type = download_media(url, media_type)
        quoted_filename = quote(filename)
        return Response(
            file_bytes,
            mimetype=content_type,
            headers={"Content-Disposition": f"attachment; filename*=UTF-8''{quoted_filename}"},
        )
    except Exception as exc:
        return render_template("index.html", error=f"Erro ao baixar: {exc}", url=url), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=True)
