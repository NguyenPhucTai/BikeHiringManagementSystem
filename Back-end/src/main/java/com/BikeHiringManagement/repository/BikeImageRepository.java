package com.BikeHiringManagement.repository;

import com.BikeHiringManagement.entity.BikeImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface BikeImageRepository extends JpaRepository<BikeImage, Long>, JpaSpecificationExecutor<BikeImage> {

}
