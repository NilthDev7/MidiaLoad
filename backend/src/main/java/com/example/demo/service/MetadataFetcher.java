package com.example.demo.service;

import com.example.demo.model.MediaInfo;

public interface MetadataFetcher {
    boolean supports(String url);
    MediaInfo fetchMetadata(String url) throws Exception;
}
