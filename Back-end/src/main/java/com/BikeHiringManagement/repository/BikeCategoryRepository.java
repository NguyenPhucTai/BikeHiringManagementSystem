package com.BikeHiringManagement.repository;

import com.BikeHiringManagement.entity.BikeCategory;
import com.BikeHiringManagement.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface BikeCategoryRepository extends JpaRepository<BikeCategory, Long>, JpaSpecificationExecutor<BikeCategory> {
    Boolean existsByName(String name);
}
