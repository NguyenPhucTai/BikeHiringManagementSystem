package com.BikeHiringManagement.model.request;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class OrderRequest {
    private Date startDate;
    private Date endDate;
    private String customerName;
    private String phoneNumber;
    private String bikeCategoryId;

}
