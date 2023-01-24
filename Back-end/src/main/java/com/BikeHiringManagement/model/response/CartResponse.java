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

    public String status;
    private Boolean isUsedMonthHiring;
    private Integer bikeNumber;

    public CartResponse(){

    }

    public CartResponse(Long id, Long customerId, String customerName, String phoneNumber, Date expectedStartDate, Date expectedEndDate, String status) {
        this.id = id;
        this.customerId = customerId;
        this.customerName = customerName;
        this.phoneNumber = phoneNumber;
        this.expectedStartDate = expectedStartDate;
        this.expectedEndDate = expectedEndDate;
        this.status = status;
    }

    public CartResponse(Long id,  String customerName, String phoneNumber, Date expectedStartDate, Date expectedEndDate, String status) {
        this.id = id;
        this.customerName = customerName;
        this.phoneNumber = phoneNumber;
        this.expectedStartDate = expectedStartDate;
        this.expectedEndDate = expectedEndDate;
        this.status = status;
    }
}
