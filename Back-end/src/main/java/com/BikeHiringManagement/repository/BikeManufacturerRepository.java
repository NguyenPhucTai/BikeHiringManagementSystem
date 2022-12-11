package com.BikeHiringManagement.repository;

import com.BikeHiringManagement.entity.BikeManufacturer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface BikeManufacturerRepository extends JpaRepository<BikeManufacturer, Long>, JpaSpecificationExecutor<BikeManufacturer> {

    boolean existsByNameAndIsDeleted(String name, Boolean check);

    boolean existsByIdAndIsDeleted(Long id, Boolean check);
    boolean existsById(Long id);
    BikeManufacturer findBikeManufacturerById(Long id);
}
