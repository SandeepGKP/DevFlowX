package com.devflowx.controller;

import com.devflowx.model.Release;
import com.devflowx.service.ReleaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/releases")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ReleaseController {

    private final ReleaseService releaseService;

    @GetMapping
    public List<Release> getAllReleases() {
        return releaseService.getAll();
    }

    @PostMapping
    public Release createRelease(@RequestBody Release release) {
        return releaseService.create(release);
    }

    @PostMapping("/{id}/rollback")
    public ResponseEntity<String> rollbackRelease(@PathVariable("id") Long id) {
        releaseService.rollback(id);
        return ResponseEntity.ok("Rollback initiated");
    }

    @PutMapping("/{id}/env-vars")
    public ResponseEntity<String> updateEnvVars(@PathVariable("id") Long id, @RequestBody java.util.Map<String, String> envVars) {
        releaseService.updateEnvironmentVariables(id, envVars);
        return ResponseEntity.ok("Environment variables updated");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRelease(@PathVariable("id") Long id) {
        releaseService.deleteRelease(id);
        return ResponseEntity.ok("Release and workspace deleted successfully");
    }
}
