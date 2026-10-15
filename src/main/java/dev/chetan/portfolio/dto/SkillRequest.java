package dev.chetan.portfolio.dto;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
public record SkillRequest(@NotBlank @Size(max=80) String name, @NotBlank @Size(max=40) String group, @Min(0) @Max(100) int level) {}
