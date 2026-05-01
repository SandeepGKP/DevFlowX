package com.devflowx.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;
import java.io.IOException;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @org.springframework.beans.factory.annotation.Value("${CORS_ALLOWED_ORIGINS:http://localhost:5173}")
    private String allowedOrigins;

    @Override
    public void addCorsMappings(org.springframework.web.servlet.config.annotation.CorsRegistry registry) {
        String[] origins = allowedOrigins.split(",");
        registry.addMapping("/**")
                .allowedOrigins(origins)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // THE "DEEP-SEARCH" UNIVERSAL RESOLVER.
        // This is the most robust way to host nested SPAs.
        // It starts at the requested sub-route and searches upwards
        // until it finds the app's index.html foundation.
        registry.addResourceHandler("/workspaces/**")
                .addResourceLocations("file:workspaces/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource requestedResource = location.createRelative(resourcePath);

                        // 1. If the physical file exists (JS, CSS, PNG), serve it!
                        if (requestedResource.exists() && requestedResource.isReadable()) {
                            return requestedResource;
                        }

                        // 2. Otherwise, find the correct index.html by climbing up the tree.
                        // This handles nested deployments like /client/build/ perfectly.
                        String currentPath = resourcePath;
                        while (currentPath.contains("/")) {
                            // Move one directory up
                            currentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
                            Resource index = location.createRelative(currentPath + "/index.html");
                            if (index.exists() && index.isReadable()) {
                                return index;
                            }
                        }

                        // Fallback to the very first index.html found in the release folder
                        String release = resourcePath.split("/")[0];
                        return location.createRelative(release + "/index.html");
                    }
                });
    }
}
