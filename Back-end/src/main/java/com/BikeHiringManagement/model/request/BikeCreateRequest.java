package com.BikeHiringManagement.model.request;

import lombok.Data;

import java.util.List;

@Data
public class BikeCreateRequest {
    private String name;
    private String bikeNo;
    private String bikeManualId;
    private Long bikeCategoryId;
    private Long bikeColorId;
    private Long bikeManufacturerId;
    private List<AttachmentRequest> files;
}
