package com.BikeHiringManagement.repository;

import com.BikeHiringManagement.entity.BikeImage;
import com.BikeHiringManagement.entity.MaintainBike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface MaintainBikeRepository extends JpaRepository<MaintainBike, Long>, JpaSpecificationExecutor<MaintainBike> {
    List<MaintainBike> findAllByMaintainIdAndIsDeleted(Long id, boolean check);
    Boolean existsByMaintainIdAndIsDeleted(Long maintainId, boolean check);

    MaintainBike findAllByMaintainIdAndBikeId(Long maintainId, Long bikeId);
}
