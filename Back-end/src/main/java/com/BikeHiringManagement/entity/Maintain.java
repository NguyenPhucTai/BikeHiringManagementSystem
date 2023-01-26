package com.BikeHiringManagement.entity;

import lombok.Data;
import javax.persistence.*;
import java.util.Date;

@Entity
@Data
@Table(name = "maintain")
public class Maintain extends BaseEntity{
    @Column(name = "date")
    private Date date;

    @Column(name = "cost")
    private Double cost;

    @Column(name = "description")
    private String description;

    @Column(name = "type")
    private String type;
}
