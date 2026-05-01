# 1. Use Java 21 as the foundation
FROM eclipse-temurin:21-jdk-jammy

# 2. Install Git, Maven, and Node.js (Critical for DevFlowX CI/CD features)
RUN apt-get update && apt-get install -y curl git maven \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

WORKDIR /app

# 3. Copy the backend code
COPY . .

# 4. Build the JAR using the Maven Wrapper
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

# 5. Expose the port and start the application
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "target/backend-0.0.1-SNAPSHOT.jar"]
