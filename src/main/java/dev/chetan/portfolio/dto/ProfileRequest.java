package dev.chetan.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProfileRequest(
    @NotBlank @Size(max=120) String name,
    @NotBlank @Size(max=120) String role,
    @Size(max=2000) String bio,
    @Size(max=150) String email,
    @Size(max=500) String githubUrl,
    @Size(max=500) String linkedinUrl,
    @Size(max=300) String availability,
    @Size(max=500) String targetRoles,
    @Size(max=150) String location,
    @Size(max=500) String resumeUrl
) {}
