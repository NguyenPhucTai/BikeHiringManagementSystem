package com.BikeHiringManagement.model.request;

import lombok.Data;

@Data
public class BikeCategoryRequest {

    private String name;
    private Double price;
    private String createdUser;
}
