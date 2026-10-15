package dev.chetan.portfolio.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "portfolio_profile")
public class PortfolioProfile {
    @Id
    private Long id = 1L;

    @NotBlank @Size(max=120) @Column(nullable=false, length=120)
    private String name;
    @NotBlank @Size(max=120) @Column(nullable=false, length=120)
    private String role;
    @Size(max=2000) @Column(length=2000)
    private String bio;
    @Size(max=150) @Column(length=150)
    private String email;
    @Size(max=500) @Column(length=500)
    private String githubUrl;
    @Size(max=500) @Column(length=500)
    private String linkedinUrl;
    @Size(max=300) @Column(length=300)
    private String availability;
    @Size(max=500) @Column(length=500)
    private String targetRoles;
    @Size(max=150) @Column(length=150)
    private String location;
    @Size(max=500) @Column(length=500)
    private String resumeUrl;

    protected PortfolioProfile() {}
    public PortfolioProfile(String name, String role, String bio, String email, String githubUrl,
            String linkedinUrl, String availability, String targetRoles, String location, String resumeUrl) {
        this.id=1L; update(name,role,bio,email,githubUrl,linkedinUrl,availability,targetRoles,location,resumeUrl);
    }
    public Long getId(){return id;}
    public String getName(){return name;} public String getRole(){return role;} public String getBio(){return bio;}
    public String getEmail(){return email;} public String getGithubUrl(){return githubUrl;} public String getLinkedinUrl(){return linkedinUrl;}
    public String getAvailability(){return availability;} public String getTargetRoles(){return targetRoles;}
    public String getLocation(){return location;} public String getResumeUrl(){return resumeUrl;}
    public void update(String name,String role,String bio,String email,String githubUrl,String linkedinUrl,
            String availability,String targetRoles,String location,String resumeUrl) {
        this.name=name; this.role=role; this.bio=bio; this.email=email; this.githubUrl=githubUrl;
        this.linkedinUrl=linkedinUrl; this.availability=availability; this.targetRoles=targetRoles;
        this.location=location; this.resumeUrl=resumeUrl;
    }
}
