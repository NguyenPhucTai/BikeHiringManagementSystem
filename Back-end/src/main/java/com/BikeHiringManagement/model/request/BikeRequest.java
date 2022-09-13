package com.BikeHiringManagement.model.request;

import lombok.Data;

import java.util.List;

@Data
public class BikeRequest {
    private String name;
    private String bikeNo;
    private String bikeManualId;
    private Long bikeCategory;
    private Long bikeColor;
    private Long bikeManufacturer;
    private List<AttachmentRequest> files;
}
