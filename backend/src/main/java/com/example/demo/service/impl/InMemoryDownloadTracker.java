package com.example.demo.service.impl;

import com.example.demo.model.DownloadStatus;
import com.example.demo.service.DownloadTracker;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class InMemoryDownloadTracker implements DownloadTracker {

    private final Map<String, DownloadStatus> statusMap = new ConcurrentHashMap<>();

    @Override
    public void register(String id) {
        statusMap.put(id, new DownloadStatus(id, 0, "PENDING", null));
    }

    @Override
    public void updateProgress(String id, int progress) {
        DownloadStatus status = statusMap.get(id);
        if (status != null) {
            status.setProgress(progress);
        }
    }

    @Override
    public void updateStatus(String id, String statusCode) {
        DownloadStatus status = statusMap.get(id);
        if (status != null) {
            status.setStatus(statusCode);
        }
    }

    @Override
    public void setFilename(String id, String filename) {
        DownloadStatus status = statusMap.get(id);
        if (status != null) {
            status.setFilename(filename);
        }
    }

    @Override
    public void setError(String id, String error) {
        DownloadStatus status = statusMap.get(id);
        if (status != null) {
            status.setStatus("ERROR");
            status.setError(error);
        }
    }

    @Override
    public DownloadStatus getStatus(String id) {
        return statusMap.get(id);
    }
}
