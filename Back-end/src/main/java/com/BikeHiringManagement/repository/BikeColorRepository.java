package com.BikeHiringManagement.repository;

import com.BikeHiringManagement.entity.BikeColor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface BikeColorRepository extends JpaRepository<BikeColor, Long>, JpaSpecificationExecutor<BikeColor> {
    Boolean existsByName(String name);

    BikeColor findBikeColorById(Long id);
}
