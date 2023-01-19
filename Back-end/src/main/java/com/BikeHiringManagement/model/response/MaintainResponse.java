package com.BikeHiringManagement.model.response;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class MaintainResponse {
    public Long id;
    public Date maintainDate;
    public Double maintainCost;
    public String maintainDescription;
    public String maintainType;

    public List<BikeResponse> listBike;
}
