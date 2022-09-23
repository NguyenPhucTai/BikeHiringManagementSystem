package com.BikeHiringManagement.model.request;

import lombok.Data;

import java.util.List;

@Data
public class PaginationBikeRequest extends PaginationRequest {
    private Long categoryId;
    private List<FilterOptionRequest> filterList;
}