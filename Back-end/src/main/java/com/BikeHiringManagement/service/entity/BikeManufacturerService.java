package com.BikeHiringManagement.service.entity;
import com.BikeHiringManagement.constant.Constant;
import com.BikeHiringManagement.dto.PageDto;
import com.BikeHiringManagement.entity.BikeColor;
import com.BikeHiringManagement.entity.BikeManufacturer;
import com.BikeHiringManagement.model.Result;
import com.BikeHiringManagement.model.request.ObjectNameRequest;
import com.BikeHiringManagement.repository.BikeManufacturerRepository;
import com.BikeHiringManagement.service.ResponseUtils;
import com.BikeHiringManagement.specification.BikeColorSpecification;
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

    public Result createBikeManufacturer(ObjectNameRequest bikeManufacturerRequest){
        try{
            if(bikeManufacturerRepository.existsByName(bikeManufacturerRequest.getName())){
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

    public PageDto getBikeManufacturer(String searchKey, Integer page, Integer limit, String sortBy, String sortType) {
        try {
            Sort sort = responseUtils.getSort(sortBy, sortType);
            Integer pageNum = page - 1;
            Page<BikeManufacturer> pageResult = bikeManufacturerRepository.findAll(bikeManufacturerSpecification.filterBikeManufacturer(searchKey), PageRequest.of(pageNum, limit, sort));
            return PageDto.builder()
                    .content(pageResult.getContent())
                    .numberOfElements(pageResult.getNumberOfElements())
                    .page(page)
                    .size(pageResult.getSize())
                    .totalPages(pageResult.getTotalPages())
                    .totalElements(pageResult.getTotalElements())
                    .build();
        } catch (Exception e) {
            return null;
        }
    }
}
