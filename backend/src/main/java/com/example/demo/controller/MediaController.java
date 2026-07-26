package com.example.demo.controller;

import com.example.demo.model.DownloadStatus;
import com.example.demo.model.MediaInfo;
import com.example.demo.service.DownloadTracker;
import com.example.demo.service.impl.YouTubeProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/media")
@CrossOrigin(origins = "*") // Allow requests from Next.js dev server
public class MediaController {

    private final YouTubeProvider youtubeProvider;
    private final DownloadTracker downloadTracker;
    private final File tempDir;

    @Autowired
    public MediaController(YouTubeProvider youtubeProvider, DownloadTracker downloadTracker) {
        this.youtubeProvider = youtubeProvider;
        this.downloadTracker = downloadTracker;
        
        // Setup a local temp downloads directory
        this.tempDir = new File("downloads");
        if (!tempDir.exists()) {
            tempDir.mkdirs();
        }
    }

    @GetMapping("/info")
    public ResponseEntity<?> getInfo(@RequestParam String url) {
        try {
            if (!youtubeProvider.supports(url)) {
                return ResponseEntity.badRequest().body(Map.of("error", "URL não suportada. Use links do YouTube."));
            }
            MediaInfo info = youtubeProvider.fetchMetadata(url);
            return ResponseEntity.ok(info);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Erro ao obter informações do vídeo: " + e.getMessage()));
        }
    }

    @PostMapping("/download")
    public ResponseEntity<?> triggerDownload(@RequestBody Map<String, String> request) {
        String url = request.get("url");
        String type = request.get("type"); // "audio" or "video"
        String quality = request.get("quality"); // quality string

        if (url == null || type == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "URL e tipo (audio/video) são obrigatórios."));
        }

        if (!youtubeProvider.supports(url)) {
            return ResponseEntity.badRequest().body(Map.of("error", "URL não suportada."));
        }

        String downloadId = UUID.randomUUID().toString();
        downloadTracker.register(downloadId);

        // Run download in background
        CompletableFuture.runAsync(() -> {
            try {
                youtubeProvider.download(url, type, quality, downloadId, tempDir);
            } catch (Exception e) {
                // Error is updated in the tracker inside download method
            }
        });

        return ResponseEntity.ok(Map.of("downloadId", downloadId));
    }

    @GetMapping("/status/{id}")
    public ResponseEntity<?> getStatus(@PathVariable String id) {
        DownloadStatus status = downloadTracker.getStatus(id);
        if (status == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(status);
    }

    @GetMapping("/files/{id}")
    public ResponseEntity<StreamingResponseBody> getFile(@PathVariable String id) {
        DownloadStatus status = downloadTracker.getStatus(id);
        if (status == null || !"COMPLETED".equals(status.getStatus()) || status.getFilename() == null) {
            return ResponseEntity.notFound().build();
        }

        File file = new File(tempDir, status.getFilename());
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        StreamingResponseBody responseBody = outputStream -> {
            try (InputStream inputStream = new FileInputStream(file)) {
                byte[] buffer = new byte[8192];
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                }
            } finally {
                // Delete file after streaming finishes
                file.delete();
            }
        };

        // Extract display filename (video title) by removing UUID prefix if present
        String rawFilename = file.getName();
        String displayFilename = rawFilename;
        if (rawFilename.contains("___")) {
            displayFilename = rawFilename.substring(rawFilename.indexOf("___") + 3);
        }

        // Encode filename to avoid issues with special characters
        String encodedFilename = URLEncoder.encode(displayFilename, StandardCharsets.UTF_8)
            .replaceAll("\\+", "%20");

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + displayFilename + "\"; filename*=UTF-8''" + encodedFilename)
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .contentLength(file.length())
            .body(responseBody);
    }
}
