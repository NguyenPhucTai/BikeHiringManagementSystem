package com.BikeHiringManagement.service.entity;
import com.BikeHiringManagement.constant.Constant;
import com.BikeHiringManagement.entity.BikeColor;
import com.BikeHiringManagement.model.Result;
import com.BikeHiringManagement.model.request.ObjectNameRequest;
import com.BikeHiringManagement.repository.BikeColorRepository;
import com.BikeHiringManagement.service.ResponseUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class BikeColorService {
    @Autowired
    BikeColorRepository bikeColorRepository;

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
}
