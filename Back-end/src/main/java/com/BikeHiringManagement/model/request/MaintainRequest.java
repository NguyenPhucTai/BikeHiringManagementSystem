package com.BikeHiringManagement.model.request;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class MaintainRequest {
    private Date maintainDate;
    private Double cost;
    private String description;
    private String type;
    private List<BikeIDListRequest> bikeIDList;
}
