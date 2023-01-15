package com.BikeHiringManagement.model.response;

import lombok.Data;

import javax.persistence.Column;
import java.util.Date;
import java.util.List;
@Data
public class CartResponse {
    public Long id;

    public Long customerId;
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

    private String depositType;
    private Double depositAmount;
    private String depositIdentifyCard;
    private String depositHotel;

    public String note;

    public Double totalAmount;
}
