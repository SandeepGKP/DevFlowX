# 1. Build Stage: Dependency Caching & JAR creation
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app

# Copy Maven wrapper and pom.xml first to cache dependencies
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw
# This layer will be cached unless pom.xml changes
RUN ./mvnw dependency:go-offline -B

# Copy source and build the JAR
COPY src ./src
RUN ./mvnw clean package -DskipTests

# 2. Runtime Stage: Clean image with only necessary tools
FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app

# Install runtime dependencies (Git, Maven, Node.js) for PipelineEngine
RUN apt-get update && apt-get install -y curl git maven \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy only the built JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port and start with EXTREME memory limits for Free Tier
EXPOSE 8080
ENTRYPOINT ["java", "-Xmx160m", "-Xms128m", "-jar", "app.jar"]
