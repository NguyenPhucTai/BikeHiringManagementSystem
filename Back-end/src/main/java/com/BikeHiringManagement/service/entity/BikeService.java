package com.BikeHiringManagement.service.entity;

import com.BikeHiringManagement.constant.Constant;
import com.BikeHiringManagement.dto.PageDto;
import com.BikeHiringManagement.entity.Bike;
import com.BikeHiringManagement.entity.BikeImage;
import com.BikeHiringManagement.model.Result;
import com.BikeHiringManagement.model.request.AttachmentRequest;
import com.BikeHiringManagement.model.request.BikeRequest;
import com.BikeHiringManagement.model.response.AttachmentResponse;
import com.BikeHiringManagement.model.response.BikeResponse;
import com.BikeHiringManagement.repository.BikeImageRepository;
import com.BikeHiringManagement.repository.BikeRepository;
import com.BikeHiringManagement.service.ResponseUtils;
import com.BikeHiringManagement.specification.BikeSpecification;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BikeService {

    @Autowired
    BikeRepository bikeRepository;

    @Autowired
    BikeImageRepository bikeImageRepository;

    @Autowired
    BikeSpecification bikeSpecification;

    @Autowired
    ResponseUtils responseUtils;

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

    public PageDto getBike(String searchKey, Integer page, Integer limit, String sortBy, String sortType, Long categoryId) {
        try {
            Map<String, Object> mapBike = bikeSpecification.getListBike(searchKey, page, limit, sortBy, sortType);
            List<BikeResponse> listRes = (List<BikeResponse>) mapBike.get("data");
            Long totalItems = (Long) mapBike.get("count");
            Integer totalPage = responseUtils.getPageCount(totalItems, limit);

            if(categoryId != null){
                 listRes = listRes.stream().filter(c -> c.getCategoryId() == categoryId).collect(Collectors.toList());
            }


            List<BikeResponse> listResult = new ArrayList<>();
            for(BikeResponse bikeResponse : listRes){
                List<BikeImage> listImage = bikeImageRepository.findAllByBikeId(bikeResponse.getId());

                if(!listImage.isEmpty()){

                    List<AttachmentResponse> listImageResponse = new ArrayList<>();
                    for(BikeImage bikeImage : listImage){
                        AttachmentResponse attachmentResponse = new AttachmentResponse();
                        attachmentResponse.setFilePath(bikeImage.getPath());
                        attachmentResponse.setFileName(bikeImage.getName());
                        listImageResponse.add(attachmentResponse);
                    }
                    bikeResponse.setImageList(listImageResponse);
                }
                listResult.add(bikeResponse);
            }

            return PageDto.builder()
                    .content(listResult)
                    .numberOfElements(Math.toIntExact(totalItems))
                    .page(page)
                    .size(limit)
                    .totalPages(totalPage)
                    .totalElements(totalItems)
                    .build();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
