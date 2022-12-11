package com.BikeHiringManagement.repository;

import com.BikeHiringManagement.entity.BikeColor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface BikeColorRepository extends JpaRepository<BikeColor, Long>, JpaSpecificationExecutor<BikeColor> {

    boolean existsByNameAndIsDeleted(String name, Boolean check);
    boolean existsByIdAndIsDeleted(Long id, Boolean check);
    BikeColor findBikeColorById(Long id);
}
