package com.example.demo.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.demo.model.MediaInfo;
import com.example.demo.service.DownloadTracker;
import com.example.demo.service.FileDownloader;
import com.example.demo.service.MetadataFetcher;
import com.example.demo.util.ProcessExecutor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class YouTubeProvider implements MetadataFetcher, FileDownloader {

    private final DownloadTracker downloadTracker;
    private final ProcessExecutor processExecutor = new ProcessExecutor();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Pattern progressPattern = Pattern.compile("\\[download\\]\\s+(\\d+(?:\\.\\d+)?)%");

    @Autowired
    public YouTubeProvider(DownloadTracker downloadTracker) {
        this.downloadTracker = downloadTracker;
    }

    @Override
    public boolean supports(String url) {
        return url != null && (url.contains("youtube.com") || url.contains("youtu.be"));
    }

    @Override
    public MediaInfo fetchMetadata(String url) throws Exception {
        if (!supports(url)) {
            throw new IllegalArgumentException("Unsupported URL platform");
        }

        List<String> command = Arrays.asList(
            "yt-dlp",
            "--dump-json",
            "--no-warnings",
            "--no-playlist",
            url
        );

        String jsonOutput = processExecutor.executeAndGetOutput(command, null);
        JsonNode root = objectMapper.readTree(jsonOutput);

        String id = root.path("id").asText();
        String title = root.path("title").asText();
        String thumbnail = root.path("thumbnail").asText();
        long duration = root.path("duration").asLong();
        String author = root.path("uploader").asText();

        return new MediaInfo(id, title, thumbnail, duration, author, url);
    }

    @Override
    public void download(String url, String type, String quality, String downloadId, File targetDir) throws Exception {
        downloadTracker.updateStatus(downloadId, "DOWNLOADING");

        List<String> command = new ArrayList<>();
        command.add("yt-dlp");
        command.add("--no-playlist");

        if ("audio".equalsIgnoreCase(type)) {
            command.add("-f");
            if ("medium".equalsIgnoreCase(quality)) {
                command.add("worstaudio[ext=m4a]/worstaudio/best");
            } else {
                command.add("bestaudio[ext=m4a]/bestaudio/best");
            }
        } else {
            command.add("-f");
            if ("720".equals(quality)) {
                command.add("best[height<=720][ext=mp4]/best");
            } else if ("480".equals(quality)) {
                command.add("best[height<=480][ext=mp4]/best");
            } else if ("360".equals(quality)) {
                command.add("best[height<=360][ext=mp4]/best");
            } else {
                command.add("best[ext=mp4]/best");
            }
        }

        command.add("-o");
        command.add(downloadId + "___%(title)s.%(ext)s");
        command.add(url);

        try {
            processExecutor.executeWithLineConsumer(command, targetDir, line -> {
                Matcher matcher = progressPattern.matcher(line);
                if (matcher.find()) {
                    try {
                        double percent = Double.parseDouble(matcher.group(1));
                        downloadTracker.updateProgress(downloadId, (int) Math.round(percent));
                    } catch (NumberFormatException ignored) {}
                }
            });

            // Find the downloaded file
            File[] files = targetDir.listFiles((dir, name) -> name.startsWith(downloadId + "___"));
            if (files != null && files.length > 0) {
                downloadTracker.setFilename(downloadId, files[0].getName());
                downloadTracker.updateProgress(downloadId, 100);
                downloadTracker.updateStatus(downloadId, "COMPLETED");
            } else {
                throw new RuntimeException("Downloaded file not found on disk");
            }

        } catch (Exception e) {
            downloadTracker.setError(downloadId, e.getMessage());
            throw e;
        }
    }
}
