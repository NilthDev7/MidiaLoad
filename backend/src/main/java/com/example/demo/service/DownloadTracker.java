package com.example.demo.service;

import com.example.demo.model.DownloadStatus;

public interface DownloadTracker {
    void register(String id);
    void updateProgress(String id, int progress);
    void updateStatus(String id, String status);
    void setFilename(String id, String filename);
    void setError(String id, String error);
    DownloadStatus getStatus(String id);
}
