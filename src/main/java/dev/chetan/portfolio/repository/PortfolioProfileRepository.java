package dev.chetan.portfolio.repository;

import dev.chetan.portfolio.model.PortfolioProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PortfolioProfileRepository extends JpaRepository<PortfolioProfile, Long> {}
