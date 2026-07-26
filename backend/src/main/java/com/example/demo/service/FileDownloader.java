package com.example.demo.service;

import java.io.File;

public interface FileDownloader {
    void download(String url, String type, String quality, String downloadId, File targetDir) throws Exception;
}
