package com.devflowx.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "pipeline_logs")
public class PipelineLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long releaseId;
    private String stage; // BUILD, TEST, SECURITY_SCAN, DEPLOY
    private String level; // INFO, ERROR, WARNING
    
    @Column(columnDefinition = "TEXT")
    private String message;
    
    private Instant timestamp;

    @PrePersist
    protected void onCreate() {
        timestamp = Instant.now();
    }
}
