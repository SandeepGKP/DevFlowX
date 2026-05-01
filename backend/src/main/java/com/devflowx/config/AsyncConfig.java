package com.devflowx.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        
        // LIMIT CONCURRENCY TO 1
        // This acts as a background worker queue, preventing memory spikes
        // from multiple simultaneous builds.
        executor.setCorePoolSize(1);
        executor.setMaxPoolSize(1);
        
        // Queue capacity for pending deployments
        executor.setQueueCapacity(50);
        
        executor.setThreadNamePrefix("DevFlowX-Worker-");
        executor.initialize();
        return executor;
    }
}
