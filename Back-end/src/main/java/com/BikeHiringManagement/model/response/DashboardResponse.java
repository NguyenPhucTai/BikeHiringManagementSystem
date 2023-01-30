package com.BikeHiringManagement.model.response;

import lombok.Data;

@Data
public class DashboardResponse {
    private Integer totalBike;
    private Integer totalManualBike;
    private Integer totalAutoBike;

    private Integer totalOrder;
    private Integer totalOrderClose;
    private Integer totalOrderCancel;
    private Integer totalOrderPending;

    private Double revenue;
    private Double income;
    private Double expense;
}


