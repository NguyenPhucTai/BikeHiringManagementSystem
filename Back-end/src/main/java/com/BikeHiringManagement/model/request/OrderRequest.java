package com.BikeHiringManagement.model.request;
import com.BikeHiringManagement.model.response.BikeResponse;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class OrderRequest {
    //private Long id;

    //private Long customerId;
    //private String customerName;
    //private String phoneNumber;
    private String tempCustomerPhone;
    private String tempCustomerName;

    //private List<BikeResponse> listBike;
    private Date expectedStartDate;
    private Date expectedEndDate;
    private Date actualStartDate;
    private Date actualEndDate;
    //private Double calculatedCost;

    private Boolean isUsedService;
    private String serviceDescription;
    private Double serviceCost;

    private String depositType;
    private Double depositAmount;
    private String depositIdentifyCard;
    private String depositHotel;

    private String note;

    private Long bikeId;

    //private Double totalAmount;
}
