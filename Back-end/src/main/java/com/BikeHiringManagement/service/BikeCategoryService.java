package com.BikeHiringManagement.service;

import com.BikeHiringManagement.entity.Bike;
import com.BikeHiringManagement.entity.BikeCategory;
import com.BikeHiringManagement.entity.User;
import com.BikeHiringManagement.model.request.BikeCategoryRequest;
import com.BikeHiringManagement.repository.BikeCategoryRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class BikeCategoryService {

    @Autowired
    BikeCategoryRepository bikeCategoryRepository;

    @Autowired
    ModelMapper modelMapper;
    public Integer createBikeCategory(BikeCategoryRequest bikeCategoryRequest){
        try{
            if(bikeCategoryRepository.existsByName(bikeCategoryRequest.getName())){
                return -2;
            }else{
                BikeCategory newBikeCategory = modelMapper.map(bikeCategoryRequest, BikeCategory.class);
                newBikeCategory.setCreatedDate(new Date());
                bikeCategoryRepository.save(newBikeCategory);
                return 1;
            }

        }catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
    }
}
