package com.BikeHiringManagement.model;

import lombok.Data;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

@Data
public class HistoryObject {
    private String username;
    private Long entityId;
    private HashMap<String, ComparedObject> comparingMap;

    public HistoryObject() {
        comparingMap= new HashMap<>();
    }


}
