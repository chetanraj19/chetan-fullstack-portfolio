package dev.chetan.portfolio.config;

import dev.chetan.portfolio.model.Project;
import dev.chetan.portfolio.model.PortfolioProfile;
import dev.chetan.portfolio.repository.PortfolioProfileRepository;
import dev.chetan.portfolio.model.Skill;
import dev.chetan.portfolio.repository.ProjectRepository;
import dev.chetan.portfolio.repository.SkillRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PortfolioDataInitializer {
    @Bean CommandLineRunner seedPortfolioData(ProjectRepository projects, SkillRepository skills, PortfolioProfileRepository profiles) {
        return args -> {
            if (!profiles.existsById(1L)) profiles.save(new PortfolioProfile("Chetan Raj Gour", "Java Backend Developer", "MCA student and aspiring Java backend developer turning ideas into reliable, thoughtful software.", "chetan.gour@example.com", "https://github.com/", "https://www.linkedin.com/", "Open to internships and entry-level opportunities", "Java Developer · Backend Intern · Associate Software Engineer", "Madhya Pradesh, India", ""));
            if (projects.count()==0) {
                projects.save(new Project("College Management System","Full Stack","A web application for managing students, courses, attendance and administrative workflows.","Flask, MySQL, HTML, CSS, JavaScript","⌘","Featured","https://github.com/"));
                projects.save(new Project("Time Capsule API","Backend","A Java backend project focused on creating and managing time-locked digital messages through REST endpoints.","Java, Spring Boot, JPA, REST API","◷","In progress","https://github.com/"));
                projects.save(new Project("Placement Readiness Tracker","Full Stack","A placement preparation tracker for skills, certifications, DSA practice and mock interviews.","Java, Spring Boot, MySQL, JavaScript","↗","Planned","https://github.com/"));
            }
            if (skills.count()==0) {
                skills.save(new Skill("Java","Backend",85)); skills.save(new Skill("Spring Boot","Backend",72));
                skills.save(new Skill("REST APIs","Backend",76)); skills.save(new Skill("MySQL","Database",78));
                skills.save(new Skill("JPA / Hibernate","Backend",68)); skills.save(new Skill("HTML & CSS","Frontend",75));
                skills.save(new Skill("JavaScript","Frontend",65)); skills.save(new Skill("Git & GitHub","Tools",70));
            }
        };
    }
}
