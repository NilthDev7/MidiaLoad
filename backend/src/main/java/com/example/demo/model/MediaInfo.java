package com.example.demo.model;

public class MediaInfo {
    private String id;
    private String title;
    private String thumbnail;
    private long duration; // in seconds
    private String author;
    private String url;

    public MediaInfo() {}

    public MediaInfo(String id, String title, String thumbnail, long duration, String author, String url) {
        this.id = id;
        this.title = title;
        this.thumbnail = thumbnail;
        this.duration = duration;
        this.author = author;
        this.url = url;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public long getDuration() {
        return duration;
    }

    public void setDuration(long duration) {
        this.duration = duration;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
