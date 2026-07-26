package com.example.demo.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.function.Consumer;

public class ProcessExecutor {

    /**
     * Executes a command, captures stdout and returns it as a String.
     * stderr is inherited (printed to server console) and NOT mixed into stdout,
     * ensuring clean output (e.g. pure JSON from yt-dlp --dump-json).
     */
    public String executeAndGetOutput(List<String> command, File workingDir) throws Exception {
        ProcessBuilder builder = new ProcessBuilder(command);
        if (workingDir != null) {
            builder.directory(workingDir);
        }
        // Redirect stderr to our process stderr so it doesn't pollute stdout
        builder.redirectError(ProcessBuilder.Redirect.INHERIT);

        Process process = builder.start();

        StringBuilder output = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
        }

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new RuntimeException("yt-dlp exited with code " + exitCode +
                    ". Check the server console for details.");
        }

        return output.toString().trim();
    }

    /**
     * Executes a command and passes each output line to the provided consumer.
     * stderr is merged into stdout so that yt-dlp progress lines are captured.
     */
    public void executeWithLineConsumer(List<String> command, File workingDir, Consumer<String> lineConsumer) throws Exception {
        ProcessBuilder builder = new ProcessBuilder(command);
        if (workingDir != null) {
            builder.directory(workingDir);
        }
        // Merge stderr into stdout to capture yt-dlp progress lines
        builder.redirectErrorStream(true);

        Process process = builder.start();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                lineConsumer.accept(line);
            }
        }

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new RuntimeException("yt-dlp download process failed with exit code " + exitCode);
        }
    }
}
