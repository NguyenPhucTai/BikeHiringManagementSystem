package com.BikeHiringManagement.model.request;

import lombok.Data;

@Data
public class PaginationBikeRequest extends PaginationRequest {
    private Long categoryId;
}
