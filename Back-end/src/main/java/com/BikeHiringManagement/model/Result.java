package com.BikeHiringManagement.model;

import lombok.Data;

@Data
public class Result {
    private Integer code;
    private String message;

    public Result(Integer code, String message) {
        this.code = code;
        this.message = message;
    }
}
