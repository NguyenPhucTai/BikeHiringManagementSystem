package com.BikeHiringManagement.service.entity;

import com.BikeHiringManagement.constant.Constant;
import com.BikeHiringManagement.dto.PageDto;
import com.BikeHiringManagement.entity.Bike;
import com.BikeHiringManagement.entity.BikeCategory;
import com.BikeHiringManagement.entity.BikeColor;
import com.BikeHiringManagement.model.ComparedObject;
import com.BikeHiringManagement.model.HistoryObject;
import com.BikeHiringManagement.model.Result;
import com.BikeHiringManagement.model.request.BikeCategoryCreateRequest;
import com.BikeHiringManagement.model.request.PaginationRequest;
import com.BikeHiringManagement.repository.BikeCategoryRepository;
import com.BikeHiringManagement.service.CheckEntityExistService;
import com.BikeHiringManagement.service.HistoryService;
import com.BikeHiringManagement.service.ResponseUtils;
import com.BikeHiringManagement.specification.BikeCategorySpecification;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@Service
public class BikeCategoryService {

    @Autowired
    BikeCategoryRepository bikeCategoryRepository;

    @Autowired
    BikeCategorySpecification bikeCategorySpecification;

    @Autowired
    ResponseUtils responseUtils;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    CheckEntityExistService checkEntityExistService;

    @Autowired
    HistoryService historyService;

    public Result createBikeCategory(BikeCategoryCreateRequest bikeCategoryRequest){
        try{
            if(bikeCategoryRepository.existsBikeCategoriesByNameAndAndIsDeleted(bikeCategoryRequest.getName(), false)){
                return new Result(Constant.LOGIC_ERROR_CODE, "The bike category has been existed!!!");
            }

            BikeCategory newBikeCategory = modelMapper.map(bikeCategoryRequest, BikeCategory.class);
            newBikeCategory.setCreatedDate(new Date());
            newBikeCategory.setCreatedUser(bikeCategoryRequest.getUsername());
            BikeCategory savedBikeCategory =  bikeCategoryRepository.save(newBikeCategory);

            HistoryObject historyObject = new HistoryObject();
            historyObject.setUsername(bikeCategoryRequest.getUsername());
            historyObject.setEntityId(savedBikeCategory.getId());
            historyService.saveHistory(Constant.HISTORY_CREATE, savedBikeCategory, historyObject);

            return new Result(Constant.SUCCESS_CODE, "Create new bike category successfully");

        }catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "Fail");
        }
    }

    public Result updateBikeCategory(BikeCategoryCreateRequest bikeCategoryRequest){
        try{

            if(!checkEntityExistService.isEntityExisted(Constant.BIKE_CATEGORY, "id", bikeCategoryRequest.getId())){
                return new Result(Constant.LOGIC_ERROR_CODE, "The bike category has not been existed!!!");
            }
            BikeCategory bikeCategory = bikeCategoryRepository.findBikeCategoriesById(bikeCategoryRequest.getId());

            HistoryObject historyObject = new HistoryObject();
            historyObject.setUsername(bikeCategoryRequest.getUsername());
            historyObject.setEntityId(bikeCategory.getId());
            historyObject.getComparingMap().put("name", new ComparedObject(bikeCategory.getName(), bikeCategoryRequest.getName()));
            historyObject.getComparingMap().put("price", new ComparedObject(bikeCategory.getPrice(), bikeCategoryRequest.getPrice()));
            historyService.saveHistory(Constant.HISTORY_UPDATE, bikeCategory, historyObject);

            bikeCategory.setModifiedDate(new Date());
            bikeCategory.setModifiedUser(bikeCategoryRequest.getUsername());
            bikeCategory.setPrice(bikeCategoryRequest.getPrice());
            bikeCategory.setName(bikeCategoryRequest.getName());
            bikeCategoryRepository.save(bikeCategory);
            return new Result(Constant.SUCCESS_CODE, "Update new bike category successfully");

        }catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "Fail");
        }
    }

    public PageDto getBikeCategory(PaginationRequest filterObjectRequest) {
        try {
            Sort sort = responseUtils.getSort(filterObjectRequest.getSortBy(), filterObjectRequest.getSortType());
            Integer pageNum = filterObjectRequest.getPage() - 1;
            Page<BikeCategory> pageResult = bikeCategoryRepository.findAll(bikeCategorySpecification.filterBikeCategory(filterObjectRequest.getSearchKey()), PageRequest.of(pageNum, filterObjectRequest.getLimit(), sort));
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

    public Result deleteBikeCategory(Long id, String username){
        try{
            if(!checkEntityExistService.isEntityExisted(Constant.BIKE_CATEGORY, "id", id)){
                return new Result(Constant.LOGIC_ERROR_CODE, "The bike category has not been existed!!!");
            }

            BikeCategory bikeCategory = bikeCategoryRepository.findBikeCategoriesById(id);
            if(bikeCategory.getIsDeleted() == true){
                return new Result(Constant.LOGIC_ERROR_CODE, "The bike category has not been existed!!!");
            }
            bikeCategory.setModifiedDate(new Date());
            bikeCategory.setModifiedUser(username);
            bikeCategory.setIsDeleted(true);
            bikeCategoryRepository.save(bikeCategory);

            HistoryObject historyObject = new HistoryObject();
            historyObject.setUsername(username);
            historyObject.setEntityId(bikeCategory.getId());
            historyService.saveHistory(Constant.HISTORY_DELETE, bikeCategory, historyObject);
            return new Result(Constant.SUCCESS_CODE, "Delete bike category successfully");
        }catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "Fail");
        }
    }

}
