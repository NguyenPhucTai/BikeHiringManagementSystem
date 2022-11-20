package com.BikeHiringManagement.service;

import com.BikeHiringManagement.entity.History;
import com.BikeHiringManagement.model.HistoryObject;
import com.BikeHiringManagement.repository.HistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map.*;

@Service
public class HistoryService {

    @Autowired
    HistoryRepository historyRepository;

    public void saveHistory(String actionType, Object object, HistoryObject historyObject){

        switch (actionType) {
            case "LOGIN":
                History historyLogin = new History();
                historyLogin.setUserName(historyObject.getUsername());
                historyLogin.setDate(new Date());
                historyLogin.setActionType(actionType);
                historyRepository.save(historyLogin);
            case "CREATE":
                History historyCreate = new History();
                historyCreate.setUserName(historyObject.getUsername());
                historyCreate.setDate(new Date());
                historyCreate.setActionType(actionType);
                historyCreate.setEntityName(object.getClass().getSimpleName());
                historyCreate.setEntityId(historyObject.getEntityId());
                historyRepository.save(historyCreate);
            case "UPDATE":
                HashMap<String, Object> result = getDiffObject(historyObject);
                List<History> saveList = new ArrayList<>();
                for(Entry<String, Object> entry: result.entrySet()){
                    History historyUpdate = new History();
                    historyUpdate.setUserName(historyObject.getUsername());
                    historyUpdate.setDate(new Date());
                    historyUpdate.setActionType(actionType);
                    historyUpdate.setEntityName(object.getClass().getSimpleName());
                    historyUpdate.setEntityId(historyObject.getEntityId());
                    historyUpdate.setFieldName(entry.getKey());
                    historyUpdate.setPreviousValue(entry.getValue().toString());
                    saveList.add(historyUpdate);
                }
                historyRepository.saveAll(saveList);
            case "DELETE":
                History historyDelete = new History();
                historyDelete.setUserName(historyObject.getUsername());
                historyDelete.setDate(new Date());
                historyDelete.setActionType(actionType);
                historyDelete.setEntityName(object.getClass().getSimpleName());
                historyDelete.setEntityId(historyObject.getEntityId());
                historyRepository.save(historyDelete);
        }
    }

    public HashMap<String, Object> getDiffObject (HistoryObject historyObject){
        HashMap<String, Object> result = new HashMap<>();

        for(Entry<String, Object> entry: historyObject.getOriginalMap().entrySet()){
            if(!entry.getValue().toString().equalsIgnoreCase(historyObject.getNewMap().get(entry.getKey()).toString())){
                result.put(entry.getKey(), entry.getValue());
            }
        }
        return result;
    }
}
