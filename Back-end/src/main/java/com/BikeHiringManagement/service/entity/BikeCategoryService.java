package com.BikeHiringManagement.service.entity;

import com.BikeHiringManagement.constant.Constant;
import com.BikeHiringManagement.entity.Bike;
import com.BikeHiringManagement.entity.BikeCategory;
import com.BikeHiringManagement.entity.User;
import com.BikeHiringManagement.model.Result;
import com.BikeHiringManagement.model.request.BikeCategoryRequest;
import com.BikeHiringManagement.repository.BikeCategoryRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Locale;

@Service
public class BikeCategoryService {

    @Autowired
    BikeCategoryRepository bikeCategoryRepository;

    @Autowired
    ModelMapper modelMapper;


    public Result createBikeCategory(BikeCategoryRequest bikeCategoryRequest){
        try{
            if(bikeCategoryRepository.existsByName(bikeCategoryRequest.getName())){
                return new Result(Constant.LOGIC_ERROR_CODE, "The bike category has been existed!!!");
            }else{
                BikeCategory newBikeCategory = modelMapper.map(bikeCategoryRequest, BikeCategory.class);
                newBikeCategory.setCreatedDate(new Date());
                newBikeCategory.setCreatedUser(bikeCategoryRequest.getUsername());
                bikeCategoryRepository.save(newBikeCategory);
                return new Result(Constant.SUCCESS_CODE, "Create new bike category successfully");
            }

        }catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "Fail");
        }
    }

    public Result updateBikeCategory(BikeCategoryRequest bikeCategoryRequest){
        try{

            if(!bikeCategoryRepository.existsById(bikeCategoryRequest.getId())){
                return new Result(Constant.LOGIC_ERROR_CODE, "The bike category has not been existed!!!");
            }
            else{
                BikeCategory bikeCategory = bikeCategoryRepository.findBikeCategoriesById(bikeCategoryRequest.getId());
                bikeCategory.setModifiedDate(new Date());
                bikeCategory.setModifiedUser(bikeCategoryRequest.getUsername());
                bikeCategory.setPrice(bikeCategoryRequest.getPrice());
                bikeCategoryRepository.save(bikeCategory);
                return new Result(Constant.SUCCESS_CODE, "Update new bike category successfully");
            }

        }catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "Fail");
        }
    }
}
