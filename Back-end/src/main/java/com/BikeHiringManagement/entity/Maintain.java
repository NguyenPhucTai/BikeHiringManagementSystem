package com.BikeHiringManagement.entity;

import lombok.Data;
import javax.persistence.*;
import java.util.Date;

@Entity
@Data
@Table(name = "maintain")
public class Maintain extends BaseEntity{
    @Column(name = "maintain_date")
    private Date maintainDate;

    @Column(name = "maintain_cost")
    private Double maintainCost;

    @Column(name = "maintain_description")
    private String maintainDescription;

    @Column(name = "maintain_type")
    private String maintainType;
}
