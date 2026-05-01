package com.devflowx.repository;

import com.devflowx.model.PipelineLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PipelineLogRepository extends JpaRepository<PipelineLog, Long> {
    List<PipelineLog> findByReleaseIdOrderByTimestampAsc(Long releaseId);
}
