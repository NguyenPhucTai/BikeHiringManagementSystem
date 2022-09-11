package com.BikeHiringManagement.service.entity;
import com.BikeHiringManagement.constant.Constant;
import com.BikeHiringManagement.entity.BikeColor;
import com.BikeHiringManagement.entity.BikeManufacturer;
import com.BikeHiringManagement.model.Result;
import com.BikeHiringManagement.model.request.ObjectNameRequest;
import com.BikeHiringManagement.repository.BikeManufacturerRepository;
import com.BikeHiringManagement.service.ResponseUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
@Service
public class BikeManufacturerService {
    @Autowired
    BikeManufacturerRepository bikeManufacturerRepository;

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
}
