package com.BikeHiringManagement.repository;

import com.BikeHiringManagement.entity.Bike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface BikeRepository extends JpaRepository<Bike, Long>, JpaSpecificationExecutor<Bike> {
    Boolean existsByBikeNoAndName(String bikeNo, String name);
}
