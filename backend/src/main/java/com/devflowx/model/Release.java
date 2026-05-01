package com.devflowx.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "releases")
public class Release {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String projectName;
    private String version;
    private String commitMessage;
    private String status; // PENDING, CLONING, BUILDING, WAITING_FOR_TEST, TESTING, SCANNING, SCANNED, DEPLOYING, DEPLOYED, FAILED, ROLLBACK
    
    private String repoUrl;
    private String branch;
    private String projectType; // MAVEN, NODE, UNKNOWN
    private String liveUrl;
    private String rootDirectory;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "release_env_vars", joinColumns = @JoinColumn(name = "release_id"))
    @MapKeyColumn(name = "env_key")
    @Column(name = "env_value")
    private Map<String, String> environmentVariables = new HashMap<>();
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
