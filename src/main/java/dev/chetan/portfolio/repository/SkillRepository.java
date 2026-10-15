package dev.chetan.portfolio.repository;
import dev.chetan.portfolio.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
public interface SkillRepository extends JpaRepository<Skill, Long> {}
