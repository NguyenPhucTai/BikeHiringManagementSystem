package com.BikeHiringManagement.entity;

import lombok.Data;
import javax.persistence.*;
import java.util.Date;

@Entity
@Data
@Table(name = "orders")
public class Order extends BaseEntity{

    @Column(name = "start_date")
    private Date startDate;

    @Column(name = "end_date")
    private Date endDate;

    @Column(name = "deposit")
    private Double deposit;

    @Column(name = "excess_cash")
    private Double excessCash;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "status", length = 50, nullable = false)
    private String status;

    @Column(name = "gasoline")
    private Double gasoline;

}
