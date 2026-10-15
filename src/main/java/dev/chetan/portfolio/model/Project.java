package dev.chetan.portfolio.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "portfolio_projects")
public class Project {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank @Size(max = 120) @Column(nullable = false, length = 120)
    private String title;
    @NotBlank @Size(max = 80) @Column(nullable = false, length = 80)
    private String category;
    @NotBlank @Size(max = 2000) @Column(nullable = false, length = 2000)
    private String description;
    @Column(name = "stack_csv", length = 500)
    private String stackCsv;
    @Size(max = 20) @Column(length = 20)
    private String icon = "⌘";
    @Size(max = 40) @Column(length = 40)
    private String status = "In progress";
    @Size(max = 500) @Column(length = 500)
    private String github;

    protected Project() {}
    public Project(String title, String category, String description, String stackCsv, String icon, String status, String github) {
        this.title=title; this.category=category; this.description=description; this.stackCsv=stackCsv; this.icon=icon; this.status=status; this.github=github;
    }
    public Long getId(){return id;} public String getTitle(){return title;} public String getCategory(){return category;}
    public String getDescription(){return description;} public String getStackCsv(){return stackCsv;} public String getIcon(){return icon;}
    public String getStatus(){return status;} public String getGithub(){return github;}
    public void update(String title,String category,String description,String stackCsv,String icon,String status,String github){
        this.title=title; this.category=category; this.description=description; this.stackCsv=stackCsv; this.icon=icon; this.status=status; this.github=github;
    }
}
