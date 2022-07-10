package com.BikeHiringManagement.entity;

import lombok.Data;
import javax.persistence.*;

@Entity
@Data
@Table(name = "bike")
public class Bike extends BaseEntity{

    @Column(name = "name", length = 100)
    private String name;

    @Column(name = "bike_no", length = 50, nullable = false)
    private String bikeNo;

    @Column(name = "bike_category")
    private Long bikeCategory;

    @Column(name = "status", length = 50, nullable = false)
    private String status = "AVAILABLE";

    @Column(name = "hired_number", nullable = false)
    private Integer hiredNumber = 0;

}
