import os
import shutil
import uuid
from mimetypes import guess_type
from urllib.parse import quote

from flask import Flask, Response, jsonify, render_template, request
import yt_dlp


app = Flask(__name__)

# Vercel/serverless environments only guarantee write access to /tmp.
DOWNLOAD_DIR = os.path.join(os.getenv("TMPDIR", "/tmp"), "midiaload-downloads")
os.makedirs(DOWNLOAD_DIR, exist_ok=True)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/info", methods=["POST"])
def get_info():
    data = request.get_json(silent=True) or {}
    url = data.get("url")

    if not url:
        return jsonify({"error": "URL inválida"}), 400

    ydl_opts = {
        "quiet": True,
        "no_warnings": True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)

        title = info.get("title", "Vídeo sem título")
        thumbnail = info.get("thumbnail", "")
        duration = info.get("duration", 0)

        if duration:
            mins, secs = divmod(duration, 60)
            hours, mins = divmod(mins, 60)
            duration_str = f"{hours:02d}:{mins:02d}:{secs:02d}" if hours else f"{mins:02d}:{secs:02d}"
        else:
            duration_str = "Desconhecido"

        return jsonify(
            {
                "title": title,
                "thumbnail": thumbnail,
                "duration": duration_str,
                "url": url,
            }
        )
    except Exception as exc:
        return jsonify({"error": f"Erro ao obter informações: {exc}"}), 500


@app.route("/api/download", methods=["POST"])
def download():
    data = request.get_json(silent=True) or {}
    url = data.get("url")
    download_type = data.get("type")

    if not url or download_type not in ["video", "audio"]:
        return jsonify({"error": "Parâmetros inválidos"}), 400

    temp_download_path = os.path.join(DOWNLOAD_DIR, str(uuid.uuid4()))
    os.makedirs(temp_download_path, exist_ok=True)

    ydl_opts = {
        "outtmpl": os.path.join(temp_download_path, "%(title)s.%(ext)s"),
        "quiet": True,
        "no_warnings": True,
        "noprogress": True,
    }

    if download_type == "audio":
        ydl_opts["format"] = "m4a/bestaudio/best"
    else:
        ydl_opts["format"] = "best[ext=mp4]/best"

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.extract_info(url, download=True)

        files = os.listdir(temp_download_path)
        if not files:
            return jsonify({"error": "Arquivo não pôde ser baixado"}), 500

        actual_filename = files[0]
        file_path = os.path.join(temp_download_path, actual_filename)

        with open(file_path, "rb") as file_obj:
            file_bytes = file_obj.read()

        shutil.rmtree(temp_download_path)
        content_type = guess_type(actual_filename)[0] or "application/octet-stream"
        quoted_filename = quote(actual_filename)
        disposition = f"attachment; filename*=UTF-8''{quoted_filename}"

        return Response(
            file_bytes,
            mimetype=content_type,
            headers={"Content-Disposition": disposition},
        )
    except Exception as exc:
        try:
            shutil.rmtree(temp_download_path)
        except Exception:
            pass
        return jsonify({"error": f"Erro ao processar download: {exc}"}), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=True)
