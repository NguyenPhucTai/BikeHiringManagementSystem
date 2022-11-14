package com.BikeHiringManagement.repository;

import com.BikeHiringManagement.entity.BikeManufacturer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface BikeManufacturerRepository extends JpaRepository<BikeManufacturer, Long>, JpaSpecificationExecutor<BikeManufacturer> {
    Boolean existsByName(String name);
}
