package dev.chetan.portfolio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactRequest(
        @NotBlank(message = "Please enter your name.")
        @Size(max = 100, message = "Name must be 100 characters or fewer.")
        String name,

        @NotBlank(message = "Please enter your email.")
        @Email(message = "Please enter a valid email address.")
        @Size(max = 150, message = "Email must be 150 characters or fewer.")
        String email,

        @NotBlank(message = "Please enter a subject.")
        @Size(max = 120, message = "Subject must be 120 characters or fewer.")
        String subject,

        @NotBlank(message = "Please enter a message.")
        @Size(min = 10, max = 3000, message = "Message must be between 10 and 3000 characters.")
        String message
) {}
