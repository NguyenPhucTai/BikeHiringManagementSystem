package com.BikeHiringManagement.service.entity;
import com.BikeHiringManagement.constant.Constant;
import com.BikeHiringManagement.dto.PageDto;
import com.BikeHiringManagement.entity.BikeCategory;
import com.BikeHiringManagement.entity.BikeColor;
import com.BikeHiringManagement.model.Result;
import com.BikeHiringManagement.model.request.ObjectNameRequest;
import com.BikeHiringManagement.repository.BikeColorRepository;
import com.BikeHiringManagement.service.ResponseUtils;
import com.BikeHiringManagement.specification.BikeCategorySpecification;
import com.BikeHiringManagement.specification.BikeColorSpecification;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

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

    public Result createBikeColor(ObjectNameRequest bikeColorRequest){
        try{
            if(bikeColorRepository.existsByName(bikeColorRequest.getName())){
                return new Result(Constant.LOGIC_ERROR_CODE, "The bike color has been existed!!!");
            }else{
                BikeColor newBikeColor = modelMapper.map(bikeColorRequest, BikeColor.class);
                newBikeColor.setCreatedDate(new Date());
                newBikeColor.setCreatedUser(bikeColorRequest.getUsername());
                bikeColorRepository.save(newBikeColor);
                return new Result(Constant.SUCCESS_CODE, "Create new bike color successfully");
            }

        }catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "Fail");
        }
    }

    public PageDto getBikeColor(String searchKey, Integer page, Integer limit, String sortBy, String sortType) {
        try {
            Sort sort = responseUtils.getSort(sortBy, sortType);
            Integer pageNum = page - 1;
            Page<BikeColor> pageResult = bikeColorRepository.findAll(bikeColorSpecification.filterBikeColor(searchKey), PageRequest.of(pageNum, limit, sort));
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
