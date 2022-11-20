package com.BikeHiringManagement.model;

import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class HistoryObject {
    private HashMap<String, Object> originalMap;
    private HashMap<String, Object> newMap;
    private String username;
    private Long entityId;

    public HistoryObject() {
        originalMap = new HashMap<>();
        newMap = new HashMap<>();
    }


}
