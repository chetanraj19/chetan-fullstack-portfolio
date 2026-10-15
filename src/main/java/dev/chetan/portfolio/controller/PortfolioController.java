package dev.chetan.portfolio.controller;

import dev.chetan.portfolio.dto.ContactRequest;
import dev.chetan.portfolio.dto.ProjectRequest;
import dev.chetan.portfolio.dto.ProfileRequest;
import dev.chetan.portfolio.dto.SkillRequest;
import dev.chetan.portfolio.model.ContactMessage;
import dev.chetan.portfolio.model.Project;
import dev.chetan.portfolio.model.PortfolioProfile;
import dev.chetan.portfolio.model.Skill;
import dev.chetan.portfolio.repository.ContactMessageRepository;
import dev.chetan.portfolio.repository.ProjectRepository;
import dev.chetan.portfolio.repository.PortfolioProfileRepository;
import dev.chetan.portfolio.repository.SkillRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;

@RestController
@RequestMapping("/api")
public class PortfolioController {
    private final ContactMessageRepository contactRepository;
    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;
    private final PortfolioProfileRepository profileRepository;

    public PortfolioController(ContactMessageRepository contactRepository, ProjectRepository projectRepository, SkillRepository skillRepository, PortfolioProfileRepository profileRepository) {
        this.contactRepository=contactRepository; this.projectRepository=projectRepository; this.skillRepository=skillRepository; this.profileRepository=profileRepository;
    }

    @GetMapping("/health") public Map<String,Object> health(){return Map.of("status","UP","application","Chetan Portfolio API");}
    @GetMapping("/profile") public Map<String,Object> profile(){ return profileMap(getProfile()); }
    @GetMapping("/admin/profile") public Map<String,Object> adminProfile(){ return profileMap(getProfile()); }
    @PutMapping("/admin/profile") public Map<String,Object> updateProfile(@Valid @RequestBody ProfileRequest r) {
        PortfolioProfile profile=getProfile();
        profile.update(r.name().trim(),r.role().trim(),clean(r.bio()),clean(r.email()),clean(r.githubUrl()),
            clean(r.linkedinUrl()),clean(r.availability()),clean(r.targetRoles()),clean(r.location()),clean(r.resumeUrl()));
        return profileMap(profileRepository.save(profile));
    }
    private PortfolioProfile getProfile() {
        return profileRepository.findById(1L).orElseGet(() -> profileRepository.save(new PortfolioProfile(
            "Chetan Raj Gour","Java Backend Developer",
            "MCA student and aspiring Java backend developer turning ideas into reliable, thoughtful software.",
            "chetan.gour@example.com","https://github.com/","https://www.linkedin.com/",
            "Open to internships and entry-level opportunities",
            "Java Developer · Backend Intern · Associate Software Engineer","Madhya Pradesh, India","")));
    }
    private Map<String,Object> profileMap(PortfolioProfile p) {
        Map<String,Object> m=new LinkedHashMap<>();
        m.put("name",p.getName()); m.put("role",p.getRole()); m.put("bio",p.getBio()); m.put("email",p.getEmail());
        m.put("githubUrl",p.getGithubUrl()); m.put("linkedinUrl",p.getLinkedinUrl()); m.put("availability",p.getAvailability());
        m.put("targetRoles",p.getTargetRoles()); m.put("location",p.getLocation()); m.put("resumeUrl",p.getResumeUrl());
        m.put("education","MCA · LNCT Bhopal");
        return m;
    }

    @GetMapping("/skills") public List<Map<String,Object>> skills(){
        return skillRepository.findAll().stream().map(this::skillMap).toList();
    }
    @GetMapping("/projects") public List<Map<String,Object>> projects(){
        return projectRepository.findAll().stream().map(this::projectMap).toList();
    }

    @PostMapping("/contact") public ResponseEntity<Map<String,String>> contact(@Valid @RequestBody ContactRequest request){
        ContactMessage saved=contactRepository.save(new ContactMessage(request.name().trim(),request.email().trim(),request.subject().trim(),request.message().trim()));
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("status","success","message","Thanks for reaching out! Your message has been saved.","id",saved.getId().toString()));
    }

    @GetMapping("/admin/projects") public List<Map<String,Object>> adminProjects(){return projectRepository.findAll().stream().map(this::projectMap).toList();}
    @PostMapping("/admin/projects") public ResponseEntity<Map<String,Object>> createProject(@Valid @RequestBody ProjectRequest r){
        Project saved=projectRepository.save(new Project(r.title().trim(),r.category().trim(),r.description().trim(),clean(r.stack()),defaultIfBlank(r.icon(),"⌘"),defaultIfBlank(r.status(),"In progress"),clean(r.github())));
        return ResponseEntity.status(HttpStatus.CREATED).body(projectMap(saved));
    }
    @PutMapping("/admin/projects/{id}") public Map<String,Object> updateProject(@PathVariable Long id,@Valid @RequestBody ProjectRequest r){
        Project project=projectRepository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Project not found"));
        project.update(r.title().trim(),r.category().trim(),r.description().trim(),clean(r.stack()),defaultIfBlank(r.icon(),"⌘"),defaultIfBlank(r.status(),"In progress"),clean(r.github()));
        return projectMap(projectRepository.save(project));
    }
    @DeleteMapping("/admin/projects/{id}") public ResponseEntity<Void> deleteProject(@PathVariable Long id){
        if(!projectRepository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Project not found");
        projectRepository.deleteById(id); return ResponseEntity.noContent().build();
    }

    @GetMapping("/admin/skills") public List<Map<String,Object>> adminSkills(){return skillRepository.findAll().stream().map(this::skillMap).toList();}
    @PostMapping("/admin/skills") public ResponseEntity<Map<String,Object>> createSkill(@Valid @RequestBody SkillRequest r){
        Skill saved=skillRepository.save(new Skill(r.name().trim(),r.group().trim(),r.level()));
        return ResponseEntity.status(HttpStatus.CREATED).body(skillMap(saved));
    }
    @PutMapping("/admin/skills/{id}") public Map<String,Object> updateSkill(@PathVariable Long id,@Valid @RequestBody SkillRequest r){
        Skill skill=skillRepository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Skill not found"));
        skill.update(r.name().trim(),r.group().trim(),r.level()); return skillMap(skillRepository.save(skill));
    }
    @DeleteMapping("/admin/skills/{id}") public ResponseEntity<Void> deleteSkill(@PathVariable Long id){
        if(!skillRepository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Skill not found");
        skillRepository.deleteById(id); return ResponseEntity.noContent().build();
    }
    @GetMapping("/admin/messages") public List<Map<String,Object>> adminMessages(){
        return contactRepository.findAll().stream().sorted(Comparator.comparing(ContactMessage::getCreatedAt).reversed()).map(m -> Map.<String,Object>of("id",m.getId(),"name",m.getName(),"email",m.getEmail(),"subject",m.getSubject(),"message",m.getMessage(),"createdAt",m.getCreatedAt().toString())).toList();
    }
    private Map<String,Object> projectMap(Project p){return Map.of("id",p.getId(),"title",p.getTitle(),"category",p.getCategory(),"description",p.getDescription(),"stack",splitStack(p.getStackCsv()),"icon",defaultIfBlank(p.getIcon(),"⌘"),"status",defaultIfBlank(p.getStatus(),"Project"),"github",defaultIfBlank(p.getGithub(),"#projects"));}
    private Map<String,Object> skillMap(Skill s){return Map.of("id",s.getId(),"name",s.getName(),"group",s.getGroupName(),"level",s.getLevel());}
    private String clean(String value){return value==null?"":value.trim();}
    private String defaultIfBlank(String value,String fallback){return value==null||value.isBlank()?fallback:value.trim();}
    private List<String> splitStack(String stack){if(stack==null||stack.isBlank())return List.of();return Arrays.stream(stack.split(",")).map(String::trim).filter(s->!s.isBlank()).toList();}
}
