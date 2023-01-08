package com.BikeHiringManagement.repository;

import com.BikeHiringManagement.entity.Order;
import com.BikeHiringManagement.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long>, JpaSpecificationExecutor<OrderDetail> {
    Boolean existsByOrderIdAndBikeIdAndIsDeleted(Long orderId, Long bikeId, boolean isExisted);

    List<OrderDetail> findAllOrderDetailByOrderId(Long orderId);
}
