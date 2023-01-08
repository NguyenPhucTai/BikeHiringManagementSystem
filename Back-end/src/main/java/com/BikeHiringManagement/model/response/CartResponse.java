package com.BikeHiringManagement.model.response;

import lombok.Data;

import java.util.List;
@Data
public class CartResponse {
    public Long orderId;
    public List<BikeResponse> listBike;
}
