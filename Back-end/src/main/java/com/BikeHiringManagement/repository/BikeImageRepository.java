package com.BikeHiringManagement.repository;

import com.BikeHiringManagement.entity.BikeImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface BikeImageRepository extends JpaRepository<BikeImage, Long>, JpaSpecificationExecutor<BikeImage> {
    List<BikeImage> findAllByBikeIdOrderByNameAsc(Long id);
}
