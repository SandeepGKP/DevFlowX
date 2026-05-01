package com.devflowx.controller;

import com.devflowx.audit.AuditLogService;
import com.devflowx.model.PipelineLog;
import com.devflowx.model.Release;
import com.devflowx.pipeline.PipelineEngine;
import com.devflowx.repository.ReleaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pipeline")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PipelineController {

    private final PipelineEngine pipelineEngine;
    private final ReleaseRepository releaseRepository;
    private final AuditLogService auditLogService;

    @PostMapping("/start/{id}")
    public ResponseEntity<String> startPipeline(@PathVariable("id") Long id) {
        Release release = releaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Release not found"));
        pipelineEngine.startPipeline(release);
        return ResponseEntity.ok("Pipeline started successfully.");
    }

    @GetMapping("/logs/{id}")
    public ResponseEntity<List<PipelineLog>> getLogs(@PathVariable("id") Long id) {
        return ResponseEntity.ok(auditLogService.getLogsByRelease(id));
    }
}
