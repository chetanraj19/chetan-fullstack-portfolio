package dev.chetan.portfolio.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
public record ProjectRequest(
 @NotBlank @Size(max=120) String title,
 @NotBlank @Size(max=80) String category,
 @NotBlank @Size(max=2000) String description,
 @Size(max=500) String stack,
 @Size(max=20) String icon,
 @Size(max=40) String status,
 @Size(max=500) String github
) {}
