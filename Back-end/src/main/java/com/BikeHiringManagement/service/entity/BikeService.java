package com.BikeHiringManagement.service.entity;

import com.BikeHiringManagement.constant.Constant;
import com.BikeHiringManagement.dto.PageDto;
import com.BikeHiringManagement.entity.Bike;
import com.BikeHiringManagement.entity.BikeCategory;
import com.BikeHiringManagement.entity.BikeImage;
import com.BikeHiringManagement.model.ComparedObject;
import com.BikeHiringManagement.model.HistoryObject;
import com.BikeHiringManagement.model.Result;
import com.BikeHiringManagement.model.request.AttachmentRequest;
import com.BikeHiringManagement.model.request.BikeCategoryCreateRequest;
import com.BikeHiringManagement.model.request.BikeCreateRequest;
import com.BikeHiringManagement.model.request.PaginationBikeRequest;
import com.BikeHiringManagement.model.response.AttachmentResponse;
import com.BikeHiringManagement.model.response.BikeResponse;
import com.BikeHiringManagement.repository.BikeCategoryRepository;
import com.BikeHiringManagement.repository.BikeImageRepository;
import com.BikeHiringManagement.repository.BikeRepository;
import com.BikeHiringManagement.service.CheckEntityExistService;
import com.BikeHiringManagement.service.HistoryService;
import com.BikeHiringManagement.service.ResponseUtils;
import com.BikeHiringManagement.specification.BikeSpecification;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class BikeService {

    @Autowired
    BikeRepository bikeRepository;

    @Autowired
    BikeCategoryRepository bikeCategoryRepository;

    @Autowired
    BikeImageRepository bikeImageRepository;

    @Autowired
    BikeSpecification bikeSpecification;

    @Autowired
    ResponseUtils responseUtils;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    HistoryService historyService;

    @Autowired
    CheckEntityExistService checkEntityExistService;

    /*
    @Autowired
    HistoryService historyService;
     */
    public Result createBike(BikeCreateRequest bikeRequest, String username){
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

            HistoryObject historyObject = new HistoryObject();
            historyObject.setUsername(username);
            historyObject.setEntityId(savedBike.getId());
            historyService.saveHistory(Constant.HISTORY_CREATE, savedBike, historyObject);

            return new Result(Constant.SUCCESS_CODE, "Create new bike successfully");
        }catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "Fail");
        }
    }

    public PageDto getBikePagination(PaginationBikeRequest paginationBikeRequest) {
        try {
            String searchKey = paginationBikeRequest.getSearchKey();
            Integer page = paginationBikeRequest.getPage();
            Integer limit = paginationBikeRequest.getLimit();
            String sortBy = paginationBikeRequest.getSortBy();
            String sortType = paginationBikeRequest.getSortType();
            Long categoryId = paginationBikeRequest.getCategoryId();

            Map<String, Object> mapBike = bikeSpecification.getListBike(searchKey, page, limit, sortBy, sortType, categoryId);
            List<BikeResponse> listRes = (List<BikeResponse>) mapBike.get("data");
            Long totalItems = (Long) mapBike.get("count");
            Integer totalPage = responseUtils.getPageCount(totalItems, limit);

            List<BikeResponse> listResult = new ArrayList<>();
            for(BikeResponse bikeResponse : listRes){
                List<BikeImage> listImage = bikeImageRepository.findAllByBikeIdOrderByNameAsc(bikeResponse.getId());

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

    public Result getBikeById(Long bikeId){
        try{
            Result result = new Result();
            Map<String, Object> mapBike = bikeSpecification.getBikeById(bikeId);
            BikeResponse bikeResponse = (BikeResponse) mapBike.get("data");

            List<BikeImage> listImage = bikeImageRepository.findAllByBikeIdOrderByNameAsc(bikeResponse.getId());
            List<AttachmentResponse> listImageResponse = new ArrayList<>();
            if(!listImage.isEmpty()){
                for(BikeImage bikeImage : listImage){
                    AttachmentResponse attachmentResponse = new AttachmentResponse();
                    attachmentResponse.setFilePath(bikeImage.getPath());
                    attachmentResponse.setFileName(bikeImage.getName());
                    listImageResponse.add(attachmentResponse);
                }
            }
            bikeResponse.setImageList(listImageResponse);

            result.setMessage("Get successful");
            result.setCode(Constant.SUCCESS_CODE);
            result.setObject(bikeResponse);
            return  result;

        }catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "System error", null);
        }
    }

    /*
    public PageDto getBike(String searchKey, Integer page, Integer limit, String sortBy, String sortType, Long categoryId) {
        try {
            Map<String, Object> mapBike = bikeSpecification.getListBike(searchKey, page, limit, sortBy, sortType, categoryId);
            List<BikeResponse> listRes = (List<BikeResponse>) mapBike.get("data");
            Long totalItems = (Long) mapBike.get("count");
            Integer totalPage = responseUtils.getPageCount(totalItems, limit);

            if(categoryId != null){
                 listRes = listRes.stream().filter(c -> c.getCategoryId() == categoryId).collect(Collectors.toList());
            }


            List<BikeResponse> listResult = new ArrayList<>();
            for(BikeResponse bikeResponse : listRes){
                List<BikeImage> listImage = bikeImageRepository.findAllByBikeIdOrderByNameAsc(bikeResponse.getId());

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
     */
    public Result deleteBike(Long id, String username){
        try{
            Bike bike = bikeRepository.findBikeById(id);
            if(bike.getIsDeleted() == true){
                return new Result(Constant.LOGIC_ERROR_CODE, "The bike has not been existed!!!");
            }
            bike.setModifiedDate(new Date());
            bike.setModifiedUser(username);
            bike.setIsDeleted(true);
            bikeRepository.save(bike);

            HistoryObject historyObject = new HistoryObject();
            historyObject.setUsername(username);
            historyObject.setEntityId(bike.getId());
            historyService.saveHistory(Constant.HISTORY_DELETE, bike, historyObject);
            return new Result(Constant.SUCCESS_CODE, "Delete bike successfully");
        }catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "Fail");
        }
    }

    public Result updateBike(BikeCreateRequest bikeRequest){
        try{

            if(!checkEntityExistService.isEntityExisted(Constant.BIKE, "id", bikeRequest.getId())){
                return new Result(Constant.LOGIC_ERROR_CODE, "The bike has not been existed!!!");
            }
            Bike bike = bikeRepository.findBikeById(bikeRequest.getId());
            /*
            HistoryObject historyObject = new HistoryObject();
            historyObject.setUsername(bikeCategoryRequest.getUsername());
            historyObject.setEntityId(bikeCategory.getId());
            historyObject.getComparingMap().put("name", new ComparedObject(bikeCategory.getName(), bikeCategoryRequest.getName()));
            historyObject.getComparingMap().put("price", new ComparedObject(bikeCategory.getPrice(), bikeCategoryRequest.getPrice()));
            historyService.saveHistory(Constant.HISTORY_UPDATE, bikeCategory, historyObject);
            */
            bike.setModifiedDate(new Date());
            bike.setModifiedUser(bikeRequest.getUsername());
            bike.setName(bikeRequest.getName());
            bikeRepository.save(bike);
            return new Result(Constant.SUCCESS_CODE, "Update new bike successfully");

        }catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "Fail");
        }
    }
}
