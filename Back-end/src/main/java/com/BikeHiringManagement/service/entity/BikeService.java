package com.BikeHiringManagement.service.entity;

import com.BikeHiringManagement.constant.Constant;
import com.BikeHiringManagement.entity.Bike;
import com.BikeHiringManagement.entity.BikeImage;
import com.BikeHiringManagement.model.Result;
import com.BikeHiringManagement.model.request.AttachmentRequest;
import com.BikeHiringManagement.model.request.BikeRequest;
import com.BikeHiringManagement.repository.BikeImageRepository;
import com.BikeHiringManagement.repository.BikeRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class BikeService {

    @Autowired
    BikeRepository bikeRepository;

    @Autowired
    BikeImageRepository bikeImageRepository;

    @Autowired
    ModelMapper modelMapper;

    public Result createBike(BikeRequest bikeRequest, String username){
        try{
            if(bikeRepository.existsByBikeNoAndName(bikeRequest.getBikeNo(), bikeRequest.getName())){
                return new Result(Constant.LOGIC_ERROR_CODE, "The bike number has been existed!!!");
            }

            Bike newBike = modelMapper.map(bikeRequest, Bike.class);
            newBike.setCreatedDate(new Date());
            newBike.setCreatedUser(username);
            Bike savedBike = bikeRepository.save(newBike);

            List<BikeImage> saveList = new ArrayList<>();
            for(AttachmentRequest item : bikeRequest.getFiles()){
                BikeImage bikeImage = new BikeImage();
                bikeImage.setBikeId(savedBike.getId());
                bikeImage.setName(item.getFileName());
                bikeImage.setPath(item.getFilePath());
                bikeImage.setCreatedDate(new Date());
                bikeImage.setCreatedUser(username);
                saveList.add(bikeImage);
            }

            bikeImageRepository.saveAll(saveList);
            return new Result(Constant.SUCCESS_CODE, "Create new bike successfully");
        }catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "Fail");
        }
    }
}
