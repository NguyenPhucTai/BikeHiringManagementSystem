package com.BikeHiringManagement.repository;

import com.BikeHiringManagement.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {
    boolean existsByCreatedUserAndStatusAndIsDeleted(String username, String status, boolean check);

    Order findByCreatedUserAndStatusAndIsDeleted(String username, String status, boolean check);
}
