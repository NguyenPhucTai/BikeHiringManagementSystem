package com.BikeHiringManagement.model.request;

import lombok.Data;

import java.util.List;
@Data
public class PaginationMaintainRequest extends PaginationRequest {
        private String username;
        private Long maintainId;
        private String maintainType;
        private Double maintainCost;
        private List<FilterOptionRequest> filterList;
}
