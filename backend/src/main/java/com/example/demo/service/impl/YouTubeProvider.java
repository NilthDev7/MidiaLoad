package com.example.demo.service.impl;

import com.example.demo.model.MediaInfo;
import com.example.demo.service.DownloadTracker;
import com.example.demo.service.FileDownloader;
import com.example.demo.service.MetadataFetcher;
import com.example.demo.util.ProcessExecutor;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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

    private final ProcessExecutor processExecutor;
    private final DownloadTracker downloadTracker;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Pattern progressPattern = Pattern.compile("\\[download\\]\\s+(\\d+\\.\\d+)%");

    // Realistic Mobile User Agent to avoid YouTube datacenter IP bot detection
    private static final String USER_AGENT = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36";
    private static final String EXTRACTOR_ARGS = "youtube:player_client=mweb,android,ios,web";

    @Autowired
    public YouTubeProvider(ProcessExecutor processExecutor, DownloadTracker downloadTracker) {
        this.processExecutor = processExecutor;
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
            "--force-ipv4",
            "--extractor-args", EXTRACTOR_ARGS,
            "--user-agent", USER_AGENT,
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
        command.add("--force-ipv4");
        command.add("--extractor-args");
        command.add(EXTRACTOR_ARGS);
        command.add("--user-agent");
        command.add(USER_AGENT);

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
            downloadTracker.updateStatus(downloadId, "ERROR");
            downloadTracker.setError(downloadId, e.getMessage());
            throw e;
        }
    }
}
