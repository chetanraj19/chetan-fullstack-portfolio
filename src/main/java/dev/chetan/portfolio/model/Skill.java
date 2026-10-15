package dev.chetan.portfolio.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "portfolio_skills")
public class Skill {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank @Size(max=80) @Column(nullable=false, length=80)
    private String name;
    @NotBlank @Size(max=40) @Column(nullable=false, length=40)
    private String groupName;
    @Min(0) @Max(100) @Column(nullable=false)
    private int level;
    protected Skill() {}
    public Skill(String name,String groupName,int level){this.name=name;this.groupName=groupName;this.level=level;}
    public Long getId(){return id;} public String getName(){return name;} public String getGroupName(){return groupName;} public int getLevel(){return level;}
    public void update(String name,String groupName,int level){this.name=name;this.groupName=groupName;this.level=level;}
}
