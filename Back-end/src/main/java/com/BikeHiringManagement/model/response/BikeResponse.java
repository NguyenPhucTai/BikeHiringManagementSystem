package com.BikeHiringManagement.model.response;

import lombok.Data;

import java.util.List;

@Data
public class BikeResponse {

    private Long id;
    private String name;
    private String bikeNo;
    private Integer hiredNumber;
    private Long categoryId;
    private String categoryName;
    private Double price;
    private List<AttachmentResponse> imageList;

    public BikeResponse(Long id, String name, String bikeNo, Integer hiredNumber, Long categoryId, String categoryName, Double price) {
        this.id = id;
        this.name = name;
        this.bikeNo = bikeNo;
        this.hiredNumber = hiredNumber;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.price = price;
    }
}
