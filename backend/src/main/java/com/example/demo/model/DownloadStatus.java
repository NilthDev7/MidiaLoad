package com.example.demo.model;

public class DownloadStatus {
    private String id;
    private int progress; // percentage (0 to 100)
    private String status; // PENDING, DOWNLOADING, COMPLETED, ERROR
    private String filename;
    private String error;

    public DownloadStatus() {}

    public DownloadStatus(String id, int progress, String status, String filename) {
        this.id = id;
        this.progress = progress;
        this.status = status;
        this.filename = filename;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getProgress() {
        return progress;
    }

    public void setProgress(int progress) {
        this.progress = progress;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}
