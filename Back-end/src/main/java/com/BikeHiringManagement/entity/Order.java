package com.BikeHiringManagement.entity;

import lombok.Data;
import javax.persistence.*;
import java.util.Date;

@Entity
@Data
@Table(name = "orders")
public class Order extends BaseEntity{

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "expected_start_date")
    private Date expectedStartDate;

    @Column(name = "expected_end_date")
    private Date expectedEndDate;

    @Column(name = "actual_start_date")
    private Date actualStartDate;

    @Column(name = "actual_end_date")
    private Date actualEndDate;

    @Column(name = "calculated_cost")
    private Double calculatedCost;

    @Column(name = "is_used_serivce")
    private Boolean isUsedService;

    @Column(name = "service_description")
    private String serviceDescription;

    @Column(name = "service_cost")
    private Double serviceCost;

    @Column(name = "deposit_type")
    private String deposit_type;

    @Column(name = "deposit_amount")
    private Double deposit_amount;

    @Column(name = "deposit_identify_card")
    private String deposit_identify_card;

    @Column(name = "note")
    private String note;

    @Column(name = "status", length = 50, nullable = false)
    private String status = "IN CART";

    @Column(name = "total_amount")
    private Double totalAmount;

}
