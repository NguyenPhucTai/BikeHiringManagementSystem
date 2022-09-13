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
    private Long categoryId;
    private String categoryName;
    private Double price;
    private Long bikeColorId;
    private String bikeColor;
    private Long bikeManufacturerId;
    private String bikeManufacturer;
    private List<AttachmentResponse> imageList;

    public BikeResponse(Long id, String name, String bikeManualId, String bikeNo, Integer hiredNumber, Long categoryId, String categoryName, Double price, Long bikeColorId, String bikeColor, Long bikeManufacturerId, String bikeManufacturer) {
        this.id = id;
        this.name = name;
        this.bikeManualId = bikeManualId;
        this.bikeNo = bikeNo;
        this.hiredNumber = hiredNumber;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.price = price;
        this.bikeColorId = bikeColorId;
        this.bikeColor = bikeColor;
        this.bikeManufacturerId = bikeManufacturerId;
        this.bikeManufacturer = bikeManufacturer;
    }
}
