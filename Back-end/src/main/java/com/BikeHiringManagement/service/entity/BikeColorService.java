package com.BikeHiringManagement.service.entity;
import com.BikeHiringManagement.constant.Constant;
import com.BikeHiringManagement.dto.PageDto;
import com.BikeHiringManagement.entity.BikeCategory;
import com.BikeHiringManagement.entity.BikeColor;
import com.BikeHiringManagement.entity.BikeManufacturer;
import com.BikeHiringManagement.model.ComparedObject;
import com.BikeHiringManagement.model.HistoryObject;
import com.BikeHiringManagement.model.Result;
import com.BikeHiringManagement.model.request.BikeColorRequest;
import com.BikeHiringManagement.model.request.BikeManafacturerRequest;
import com.BikeHiringManagement.model.request.PaginationRequest;
import com.BikeHiringManagement.model.request.ObjectNameRequest;
import com.BikeHiringManagement.repository.BikeColorRepository;
import com.BikeHiringManagement.service.CheckEntityExistService;
import com.BikeHiringManagement.service.HistoryService;
import com.BikeHiringManagement.service.ResponseUtils;
import com.BikeHiringManagement.specification.BikeColorSpecification;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.Date;

@Service
public class BikeColorService {
    @Autowired
    BikeColorRepository bikeColorRepository;

    @Autowired
    BikeColorSpecification bikeColorSpecification;
    @Autowired
    ResponseUtils responseUtils;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    CheckEntityExistService checkEntityExistService;

    @Autowired
    HistoryService historyService;

    public Result createBikeColor(ObjectNameRequest bikeColorRequest){
        try{
            if(checkEntityExistService.isEntityExisted(Constant.BIKE_COLOR, "name", bikeColorRequest.getName())){
                return new Result(Constant.LOGIC_ERROR_CODE, "The bike color has been existed!!!");
            }else{
                BikeColor newBikeColor = modelMapper.map(bikeColorRequest, BikeColor.class);
                newBikeColor.setCreatedDate(new Date());
                newBikeColor.setCreatedUser(bikeColorRequest.getUsername());
                BikeColor savedBikeColor =  bikeColorRepository.save(newBikeColor);

                HistoryObject historyObject = new HistoryObject();
                historyObject.setUsername(bikeColorRequest.getUsername());
                historyObject.setEntityId(savedBikeColor.getId());
                historyService.saveHistory(Constant.HISTORY_CREATE, savedBikeColor, historyObject);

                return new Result(Constant.SUCCESS_CODE, "Create new bike color successfully");
            }

        }catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "Fail");
        }
    }

    public PageDto getBikeColor(PaginationRequest filterObjectRequest) {
        try {
            Sort sort = responseUtils.getSort(filterObjectRequest.getSortBy(), filterObjectRequest.getSortType());
            Integer pageNum = filterObjectRequest.getPage() - 1;
            Page<BikeColor> pageResult = bikeColorRepository.findAll(bikeColorSpecification.filterBikeColor(filterObjectRequest.getSearchKey()), PageRequest.of(pageNum, filterObjectRequest.getLimit(), sort));
            return PageDto.builder()
                    .content(pageResult.getContent())
                    .numberOfElements(pageResult.getNumberOfElements())
                    .page(filterObjectRequest.getPage())
                    .size(pageResult.getSize())
                    .totalPages(pageResult.getTotalPages())
                    .totalElements(pageResult.getTotalElements())
                    .build();
        } catch (Exception e) {
            return null;
        }
    }
    public Result getBikeColorById(Long id){
        try{
            Result result = new Result();
            BikeColor bikeColor = bikeColorRepository.findBikeColorById(id);
            if(!bikeColorRepository.existsById(id)){
                return new Result(Constant.LOGIC_ERROR_CODE, "Bike color id is invalid !!!");
            }

            result.setMessage("Get successful");
            result.setCode(Constant.SUCCESS_CODE);
            result.setObject(bikeColor);
            return  result;

        }catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "System error", null);
        }
    }
    public Result updateBikeColor(BikeColorRequest bikeColorRequest){
        try{

            if(!checkEntityExistService.isEntityExisted(Constant.BIKE_COLOR, "id", bikeColorRequest.getId())){
                return new Result(Constant.LOGIC_ERROR_CODE, "The bike color has not been existed!!!");
            }
            BikeColor bikeColor = bikeColorRepository.findBikeColorById(bikeColorRequest.getId());

            HistoryObject historyObject = new HistoryObject();
            historyObject.setUsername(bikeColorRequest.getUsername());
            historyObject.setEntityId(bikeColor.getId());
            historyObject.getComparingMap().put("name", new ComparedObject(bikeColor.getName(), bikeColorRequest.getName()));
            historyService.saveHistory(Constant.HISTORY_UPDATE, bikeColor, historyObject);

            bikeColor.setModifiedDate(new Date());
            bikeColor.setModifiedUser(bikeColorRequest.getUsername());
            bikeColor.setName(bikeColorRequest.getName());
            bikeColorRepository.save(bikeColor);
            return new Result(Constant.SUCCESS_CODE, "Update new bike color successfully");

        }catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "Fail");
        }
    }

    public Result deleteBikeColor(Long id, String username){
        try{
            if(!checkEntityExistService.isEntityExisted(Constant.BIKE_COLOR, "id", id)){
                return new Result(Constant.LOGIC_ERROR_CODE, "The bike color has not been existed!!!");
            }

            BikeColor bikeColor = bikeColorRepository.findBikeColorById(id);
            if(bikeColor.getIsDeleted() == true){
                return new Result(Constant.LOGIC_ERROR_CODE, "The bike color has not been existed!!!");
            }

            bikeColor.setModifiedDate(new Date());
            bikeColor.setModifiedUser(username);
            bikeColor.setIsDeleted(true);
            bikeColorRepository.save(bikeColor);

            HistoryObject historyObject = new HistoryObject();
            historyObject.setUsername(username);
            historyObject.setEntityId(bikeColor.getId());
            historyService.saveHistory(Constant.HISTORY_DELETE, bikeColor, historyObject);
            return new Result(Constant.SUCCESS_CODE, "Delete bike color successfully");
        }catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "Fail");
        }
    }
}
