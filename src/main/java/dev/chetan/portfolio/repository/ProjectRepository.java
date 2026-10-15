package dev.chetan.portfolio.repository;
import dev.chetan.portfolio.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ProjectRepository extends JpaRepository<Project, Long> {}
