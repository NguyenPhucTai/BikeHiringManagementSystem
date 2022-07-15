package com.BikeHiringManagement.model.request;

import lombok.Data;

import java.util.List;

@Data
public class BikeRequest {
    private String name;
    private String bikeNo;
    private Long bikeCategory;
    private List<AttachmentRequest> files;
}
