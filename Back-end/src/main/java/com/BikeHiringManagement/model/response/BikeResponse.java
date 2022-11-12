package com.BikeHiringManagement.model.response;

import lombok.Data;

import java.util.List;

@Data
public class BikeResponse {

    private Long id;
    private String name;
    private String bikeManualId;
    private String bikeNo;
    private Integer hiredNumber;
    private Long bikeCategoryId;
    private String bikeCategoryName;
    private Double price;
    private Long bikeColorId;
    private String bikeColor;
    private Long bikeManufacturerId;
    private String bikeManufacturer;
    private String status;
    private List<AttachmentResponse> imageList;


    public BikeResponse() {
    }

    public BikeResponse(Long id, String name, String bikeManualId, String bikeNo, Integer hiredNumber, Long bikeCategoryId, String bikeCategoryName, Double price, Long bikeColorId, String bikeColor, Long bikeManufacturerId, String bikeManufacturer, String status) {
        this.id = id;
        this.name = name;
        this.bikeManualId = bikeManualId;
        this.bikeNo = bikeNo;
        this.hiredNumber = hiredNumber;
        this.bikeCategoryId = bikeCategoryId;
        this.bikeCategoryName = bikeCategoryName;
        this.price = price;
        this.bikeColorId = bikeColorId;
        this.bikeColor = bikeColor;
        this.bikeManufacturerId = bikeManufacturerId;
        this.bikeManufacturer = bikeManufacturer;
        this.status = status;
    }

}
