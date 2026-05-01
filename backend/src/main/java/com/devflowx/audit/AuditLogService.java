package com.devflowx.audit;

import com.devflowx.model.PipelineLog;
import com.devflowx.repository.PipelineLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final PipelineLogRepository pipelineLogRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public void log(Long releaseId, String stage, String level, String message) {
        PipelineLog log = new PipelineLog();
        log.setReleaseId(releaseId);
        log.setStage(stage);
        log.setLevel(level);
        log.setMessage(message);
        
        // Save to DB (timestamp is set automatically by @PrePersist)
        PipelineLog savedLog = pipelineLogRepository.save(log);
        
        // Broadcast the FULL log object to WebSocket topic
        messagingTemplate.convertAndSend("/topic/logs/" + releaseId, savedLog);
        
        System.out.printf("[%s] [%s] Release %d: %s%n", level, stage, releaseId, message);
    }

    public List<PipelineLog> getLogsByRelease(Long releaseId) {
        return pipelineLogRepository.findByReleaseIdOrderByTimestampAsc(releaseId);
    }
}
