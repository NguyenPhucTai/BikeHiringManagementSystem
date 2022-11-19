package com.BikeHiringManagement.service.entity;
import com.BikeHiringManagement.constant.Constant;
import com.BikeHiringManagement.dto.PageDto;
import com.BikeHiringManagement.entity.BikeCategory;
import com.BikeHiringManagement.entity.BikeManufacturer;
import com.BikeHiringManagement.model.Result;
import com.BikeHiringManagement.model.request.BikeCategoryCreateRequest;
import com.BikeHiringManagement.model.request.BikeManafacturerRequest;
import com.BikeHiringManagement.model.request.PaginationRequest;
import com.BikeHiringManagement.model.request.ObjectNameRequest;
import com.BikeHiringManagement.repository.BikeManufacturerRepository;
import com.BikeHiringManagement.service.CheckEntityExistService;
import com.BikeHiringManagement.service.ResponseUtils;
import com.BikeHiringManagement.specification.BikeManufacturerSpecification;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class BikeManufacturerService {
    @Autowired
    BikeManufacturerRepository bikeManufacturerRepository;

    @Autowired
    BikeManufacturerSpecification bikeManufacturerSpecification;

    @Autowired
    ResponseUtils responseUtils;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    CheckEntityExistService checkEntityExistService;

    public Result createBikeManufacturer(ObjectNameRequest bikeManufacturerRequest){
        try{
            if(checkEntityExistService.isEntityExisted(Constant.BIKE_MANUFACTURER, "name", bikeManufacturerRequest.getName())){
                return new Result(Constant.LOGIC_ERROR_CODE, "The bike manufacturer has been existed!!!");
            }else{
                BikeManufacturer newBikeManufacturer = modelMapper.map(bikeManufacturerRequest, BikeManufacturer.class);
                newBikeManufacturer.setCreatedDate(new Date());
                newBikeManufacturer.setCreatedUser(bikeManufacturerRequest.getUsername());
                bikeManufacturerRepository.save(newBikeManufacturer);
                return new Result(Constant.SUCCESS_CODE, "Create new bike manufacturer successfully");
            }

        }catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "Fail");
        }
    }

    public PageDto getBikeManufacturer(PaginationRequest filterObjectRequest) {
        try {
            Sort sort = responseUtils.getSort(filterObjectRequest.getSortBy(), filterObjectRequest.getSortType());
            Integer pageNum = filterObjectRequest.getPage() - 1;
            Page<BikeManufacturer> pageResult = bikeManufacturerRepository.findAll(bikeManufacturerSpecification.filterBikeManufacturer(filterObjectRequest.getSearchKey()), PageRequest.of(pageNum, filterObjectRequest.getLimit(), sort));
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

    public Result getBikeManufacturerById(Long id){
        try{
            Result result = new Result();
            BikeManufacturer bikeManufacturer = bikeManufacturerRepository.findBikeManufacturerById(id);
            if(!bikeManufacturerRepository.existsById(id)){
                return new Result(Constant.LOGIC_ERROR_CODE, "Bike manufacturer id is invalid !!!");
            }

            result.setMessage("Get successful");
            result.setCode(Constant.SUCCESS_CODE);
            result.setObject(bikeManufacturer);
            return  result;

        }catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "System error", null);
        }
    }

    public Result updateBikeManufacturer(BikeManafacturerRequest bikeManafacturerRequest){
        try{

            if(!checkEntityExistService.isEntityExisted(Constant.BIKE_MANUFACTURER, "id", bikeManafacturerRequest.getId())){
                return new Result(Constant.LOGIC_ERROR_CODE, "The bike manufacturer has not been existed!!!");
            }
            BikeManufacturer bikeManufacturer = bikeManufacturerRepository.findBikeManufacturerById(bikeManafacturerRequest.getId());
            bikeManufacturer.setModifiedDate(new Date());
            bikeManufacturer.setModifiedUser(bikeManafacturerRequest.getUsername());
            bikeManufacturer.setName(bikeManafacturerRequest.getName());
            bikeManufacturerRepository.save(bikeManufacturer);
            return new Result(Constant.SUCCESS_CODE, "Update new bike manufacturer successfully");

        }catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "Fail");
        }
    }

    public Result deleteBikeManufacturer(Long id, String username){
        try{
            if(!checkEntityExistService.isEntityExisted(Constant.BIKE_MANUFACTURER, "id", id)){
                return new Result(Constant.LOGIC_ERROR_CODE, "The bike manufacturer has not been existed!!!");
            }

            BikeManufacturer bikeManufacturer = bikeManufacturerRepository.findBikeManufacturerById(id);
            if(bikeManufacturer.getIsDeleted() == true){
                return new Result(Constant.LOGIC_ERROR_CODE, "The bike manufacturer has not been existed!!!");
            }

            bikeManufacturer.setModifiedDate(new Date());
            bikeManufacturer.setModifiedUser(username);
            bikeManufacturer.setIsDeleted(true);
            bikeManufacturerRepository.save(bikeManufacturer);
            return new Result(Constant.SUCCESS_CODE, "Delete bike manufacturer successfully");

        }catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "Fail");
        }
    }
}
