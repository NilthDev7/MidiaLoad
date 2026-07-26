# ── Stage 1: Build the JAR ─────────────────────────────────
FROM eclipse-temurin:21-jdk-bookworm AS builder

WORKDIR /app

# Copy Maven wrapper and pom first for dependency caching
COPY mvnw mvnw.cmd ./
COPY .mvn .mvn
COPY pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -q

# Copy source and build
COPY src ./src
RUN ./mvnw package -DskipTests -q

# ── Stage 2: Runtime image ─────────────────────────────────
# Bookworm has Python 3.11+ built-in, resolving Python 3.10 deprecation warnings
FROM eclipse-temurin:21-jre-bookworm

# Install yt-dlp + ffmpeg (needed for audio extraction)
RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 curl ffmpeg && \
    curl -fsSL https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
         -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the fat JAR from the build stage
COPY --from=builder /app/target/demo-0.0.1-SNAPSHOT.jar app.jar

# PORT is injected by Render at runtime
EXPOSE 8085

ENTRYPOINT ["java", "-Dserver.port=${PORT}", "-jar", "app.jar"]
