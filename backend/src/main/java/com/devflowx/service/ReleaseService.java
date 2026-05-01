package com.devflowx.service;

import com.devflowx.model.Release;
import com.devflowx.pipeline.PipelineEngine;
import com.devflowx.repository.ReleaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReleaseService {

    private final ReleaseRepository releaseRepository;
    private final PipelineEngine pipelineEngine;

    public List<Release> getAll() {
        return releaseRepository.findAll();
    }

    public Release create(Release release) {
        release.setStatus("PENDING");
        return releaseRepository.save(release);
    }

    public void startPipeline(Long id) {
        Release release = releaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Release not found"));
        
        // Mark as QUEUED so user knows it's waiting for the background worker
        release.setStatus("QUEUED");
        releaseRepository.save(release);
        
        pipelineEngine.startPipeline(release);
    }

    public void updateEnvironmentVariables(Long id, Map<String, String> envVars) {
        Release release = releaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Release not found"));
        release.setEnvironmentVariables(envVars);
        releaseRepository.save(release);
    }

    public void rollback(Long id) {
        Release release = releaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Release not found"));
        
        release.setStatus("ROLLBACK");
        releaseRepository.save(release);
    }

    public void deleteRelease(Long id) {
        releaseRepository.deleteById(id);
        // Clean up workspace folder
        File workspace = new File("workspaces" + File.separator + "release-" + id);
        if (workspace.exists()) {
            deleteDirectory(workspace);
        }
    }

    private void deleteDirectory(File dir) {
        File[] files = dir.listFiles();
        if (files != null) for (File f : files) deleteDirectory(f);
        dir.delete();
    }
}
