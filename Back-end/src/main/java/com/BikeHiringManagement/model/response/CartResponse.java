package com.BikeHiringManagement.model.response;

import lombok.Data;

import javax.persistence.Column;
import java.util.Date;
import java.util.List;
@Data
public class CartResponse {
    public Long orderId;

    public String customerName;
    public String phoneNumber;

    public List<BikeResponse> listBike;
    public Date expectedStartDate;
    public Date expectedEndDate;
    public Date actualStartDate;
    public Date actualEndDate;
    public Double calculatedCost;

    public Boolean isUsedService;
    public String serviceDescription;
    public Double serviceCost;

    public String deposit_type;
    public Double deposit_amount;
    public String deposit_identify_card;

    public String note;

    public Double totalAmount;
}
