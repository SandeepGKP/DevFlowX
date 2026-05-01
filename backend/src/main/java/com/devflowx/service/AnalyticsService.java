package com.devflowx.service;

import com.devflowx.repository.ReleaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final ReleaseRepository releaseRepository;

    public Map<String, Object> getGlobalStats() {
        var allReleases = releaseRepository.findAll();
        long total = allReleases.size();
        long success = allReleases.stream().filter(r -> "DEPLOYED".equals(r.getStatus())).count();
        long failure = allReleases.stream().filter(r -> "FAILED".equals(r.getStatus()) || "ROLLBACK".equals(r.getStatus())).count();
        double rate = total == 0 ? 0 : (double) success / total * 100;

        // Group by project
        Map<String, Long> distribution = allReleases.stream()
                .collect(Collectors.groupingBy(r -> r.getProjectName(), Collectors.counting()));

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDeployments", total);
        stats.put("successCount", success);
        stats.put("failureCount", failure);
        stats.put("successRate", rate);
        stats.put("projectDistribution", distribution);
        
        return stats;
    }
}
