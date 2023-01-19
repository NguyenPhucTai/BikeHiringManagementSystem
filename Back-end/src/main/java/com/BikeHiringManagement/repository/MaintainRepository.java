package com.BikeHiringManagement.repository;

import com.BikeHiringManagement.entity.Maintain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
public interface MaintainRepository extends JpaRepository<Maintain, Long>, JpaSpecificationExecutor<Maintain> {
    boolean existsByIdAndIsDeleted(Long id, boolean check);

    Maintain findMaintainByIdAndIsDeleted(Long id, boolean check);
}
