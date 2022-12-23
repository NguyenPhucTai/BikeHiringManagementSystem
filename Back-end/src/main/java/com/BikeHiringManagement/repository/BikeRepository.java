package com.BikeHiringManagement.repository;

import com.BikeHiringManagement.entity.Bike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BikeRepository extends JpaRepository<Bike, Long>, JpaSpecificationExecutor<Bike> {
    boolean existsByIdAndIsDeleted(Long id, Boolean check);
    boolean existsByNameAndIsDeleted(String name, Boolean check);
    boolean existsByBikeNoAndName(String bikeNo, String name);

    Bike findBikeById(Long id);

    @Query("SELECT b, ct.name FROM Bike b inner join BikeCategory ct on b.bikeCategoryId = ct.id")
    List<Bike> findBikeByIdCustom();
}
