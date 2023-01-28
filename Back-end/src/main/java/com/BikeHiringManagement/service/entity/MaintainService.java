package com.BikeHiringManagement.service.entity;
import com.BikeHiringManagement.constant.Constant;
import com.BikeHiringManagement.dto.PageDto;
import com.BikeHiringManagement.entity.*;
import com.BikeHiringManagement.model.request.*;
import com.BikeHiringManagement.model.response.AttachmentResponse;
import com.BikeHiringManagement.model.response.BikeResponse;
import com.BikeHiringManagement.model.response.MaintainResponse;
import com.BikeHiringManagement.model.temp.ComparedObject;
import com.BikeHiringManagement.model.temp.HistoryObject;
import com.BikeHiringManagement.model.temp.Result;
import com.BikeHiringManagement.repository.BikeRepository;
import com.BikeHiringManagement.repository.MaintainBikeRepository;
import com.BikeHiringManagement.repository.MaintainRepository;
import com.BikeHiringManagement.service.system.CheckEntityExistService;
import com.BikeHiringManagement.service.system.ResponseUtils;
import com.BikeHiringManagement.specification.BikeSpecification;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MaintainService {
    @Autowired
    MaintainRepository maintainRepository;
    @Autowired
    MaintainBikeRepository maintainBikeRepository;

    @Autowired
    BikeRepository bikeRepository;
    @Autowired
    BikeSpecification bikeSpecification;
    @Autowired
    ResponseUtils responseUtils;
    @Autowired
    ModelMapper modelMapper;
    @Autowired
    CheckEntityExistService checkEntityExistService;
    @Autowired
    HistoryService historyService;

    public Result createMaintain(MaintainRequest maintainRequest, String username){
        try{
            String type = maintainRequest.getType();
            String title = maintainRequest.getTitle();
            String description = maintainRequest.getDescription();
            Double cost = maintainRequest.getCost();
            Date date = maintainRequest.getDate();
            String stringListManualId = maintainRequest.getStringListManualId();

            List<String> listInvalidManualId = new ArrayList<>();
            List<Bike> listBike = new ArrayList<>();
            String error_message = null;

            // IF STATUS = BIKE -> check valid bike manual ID
            if(type.equalsIgnoreCase(Constant.STATUS_MAINTAIN_BIKE))
            {
                if(stringListManualId == null || stringListManualId.isEmpty()){
                    error_message = "Please input bike manual ID list";
                    return new Result(Constant.LOGIC_ERROR_CODE, error_message);
                }

                String[] arrManualId = stringListManualId.split(",");
                for (int i = 0; i < arrManualId.length; i++) {
                    // IF valid manual ID -> get Bike list
                    if(bikeRepository.existsByBikeManualIdAndIsDeleted(arrManualId[i].trim(), Boolean.FALSE)){
                        Bike bike = bikeRepository.findBikeByBikeManualId(arrManualId[i].trim());
                        listBike.add(bike);
                    }
                    // IF invalid manual ID -> add to error list
                    else{
                        listInvalidManualId.add(arrManualId[i]);
                    }
                }
            }

            // IF error list have value -> Throw error
            if(type.equalsIgnoreCase(Constant.STATUS_MAINTAIN_BIKE) && listInvalidManualId.size() > 0){
                error_message = "Invalid manual IDs:";
                for(String id : listInvalidManualId){
                    error_message += id + ",";
                }
                error_message = error_message.substring(0, error_message.length() - 1);
                return new Result(Constant.LOGIC_ERROR_CODE, error_message);
            }

            // Save maintain
            Maintain newMaintain = modelMapper.map(maintainRequest, Maintain.class);
            newMaintain.setCreatedDate(new Date());
            newMaintain.setCreatedUser(username);
            Maintain savedMaintain =  maintainRepository.save(newMaintain);

            // Save maintain detail
            if(type.equalsIgnoreCase(Constant.STATUS_MAINTAIN_BIKE) && listBike.size() > 0){
                List<MaintainBike> maintainBikeList = new ArrayList<>();
                for(Bike bike : listBike){
                    MaintainBike newMaintainBike = new MaintainBike();
                    newMaintainBike.setMaintainId(savedMaintain.getId());
                    newMaintainBike.setBikeId(bike.getId());
                    newMaintainBike.setCreatedDate(new Date());
                    newMaintainBike.setCreatedUser(username);
                    maintainBikeList.add(newMaintainBike);
                }
                maintainBikeRepository.saveAll(maintainBikeList);
            }

            //save history
            HistoryObject historyObject = new HistoryObject();
            historyObject.setUsername(username);
            historyObject.setEntityId(savedMaintain.getId());
            historyService.saveHistory(Constant.HISTORY_CREATE, savedMaintain, historyObject);

            return new Result(Constant.SUCCESS_CODE, "Create new maintain successfully");
        }catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "Fail");
        }
    }

    public Result getMaintainLogById(Long id){
        try{
            Result result = new Result();
            if(!maintainRepository.existsByIdAndIsDeleted(id,false)){
                return new Result(Constant.LOGIC_ERROR_CODE, "Maintain id is invalid !!!");
            }
            Maintain maintainLog = maintainRepository.findMaintainByIdAndIsDeleted(id, false);
            //another maintain
            if(!Objects.equals(maintainLog.getType(), "MAINTAIN_BIKE")){
                result.setMessage("Get successful");
                result.setCode(Constant.SUCCESS_CODE);
                result.setObject(maintainLog);
            }
            //maintain type is bike
            else {
                List<MaintainBike> listMaintainBike = maintainBikeRepository.findAllByMaintainIdAndIsDeleted(id,false);
                List<Long> listBikeID = new ArrayList<>();
                for(MaintainBike item:listMaintainBike) {
                    listBikeID.add(item.getBikeId());
                }
                Map<String, Object> mapBike = bikeSpecification.getBikeListById(listBikeID);
                List<BikeResponse> listRes = (List<BikeResponse>) mapBike.get("data");
                MaintainResponse maintainResponse = modelMapper.map(maintainLog, MaintainResponse.class);
                maintainResponse.setListBike(listRes);

                maintainResponse.setId(maintainResponse.getId());
                maintainResponse.setMaintainCost(maintainLog.getCost());
                maintainResponse.setMaintainDate(maintainLog.getDate());
                maintainResponse.setMaintainType(maintainLog.getType());
                maintainResponse.setMaintainDescription(maintainLog.getDescription());

                result.setMessage("Get successful");
                result.setCode(Constant.SUCCESS_CODE);
                result.setObject(maintainResponse);
            }
            return  result;

        }catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "System error", null);
        }
    }
    /*
    public PageDto getMaintainPagination(PaginationMaintainRequest paginationMaintainRequest) {
        try {
            String searchKey = paginationMaintainRequest.getSearchKey();
            Integer page = paginationMaintainRequest.getPage();
            Integer limit = paginationMaintainRequest.getLimit();
            String sortBy = paginationMaintainRequest.getSortBy();
            String sortType = paginationMaintainRequest.getSortType();
            Long maintainId = paginationMaintainRequest.getMaintainId();
            String username = paginationMaintainRequest.getUsername();
            String maintainType = paginationMaintainRequest.getMaintainType();
            Double maintainCost = paginationMaintainRequest.getMaintainCost();

            Map<String, Object> mapBike = bikeSpecification.getBikePaginationforMaintain(searchKey, page, limit, sortBy, sortType, maintainId, maintainType, maintainCost);
            List<BikeResponse> listRes = (List<BikeResponse>) mapBike.get("data");
            Long totalItems = (Long) mapBike.get("count");
            Integer totalPage = responseUtils.getPageCount(totalItems, limit);

            // Image handling
            List<BikeResponse> listResult = new ArrayList<>();
            for(BikeResponse bikeResponse : listRes){
                List<BikeImage> listImage = bikeImageRepository.findAllByBikeIdAndIsDeletedOrderByNameAsc(bikeResponse.getId(), false);

                if(!listImage.isEmpty()){

                    List<AttachmentResponse> listImageResponse = new ArrayList<>();
                    for(BikeImage bikeImage : listImage){
                        AttachmentResponse attachmentResponse = new AttachmentResponse();
                        attachmentResponse.setId(bikeImage.getId());
                        attachmentResponse.setFilePath(bikeImage.getPath());
                        attachmentResponse.setFileName(bikeImage.getName());
                        listImageResponse.add(attachmentResponse);
                    }
                    bikeResponse.setImageList(listImageResponse);
                }
                listResult.add(bikeResponse);
            }

            // Get orderId IF in CART
            if(isInCart != null)
            {
                if(orderRepository.existsByCreatedUserAndStatusAndIsDeleted(username, "IN CART", false))
                {
                    Order order = orderRepository.findByCreatedUserAndStatusAndIsDeleted(username, "IN CART", false);
                    List<OrderDetail> listOrderDetail = orderDetailRepository.findAllOrderDetailByOrderIdAndIsDeleted(order.getId(), false);
                    for(OrderDetail item : listOrderDetail)
                    {
                        for(BikeResponse bikeResponse : listResult)
                        {
                            if(bikeResponse.getId() == item.getBikeId())
                            {
                                bikeResponse.setOrderId(order.getId());
                            }
                        }
                    }
                }
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
    public Result updateMaintain(MaintainRequest maintainRequest, Long maintainId, String username){
        try{
//            if(!maintainBikeRepository.existsByMaintainIdAndIsDeleted(maintainId, false)){
//                return new Result(Constant.LOGIC_ERROR_CODE, "The maintain Id has not been existed!!!");
//            }
//            Maintain maintain = maintainRepository.findMaintainByIdAndIsDeleted(maintainId, false);
//            List<MaintainBike> listMaintainBike = maintainBikeRepository.findAllByMaintainIdAndIsDeleted(maintainId,false);
//            List<BikeIDListRequest> listBikeIdRequest = maintainRequest.getBikeIDList();
//            // Save new maintain log
//            maintain.setModifiedDate(new Date());
//            maintain.setModifiedUser(username);
//            maintain.setCost(maintainRequest.getCost());
//            maintain.setDate(maintainRequest.getDate());
//            maintain.setDescription(maintainRequest.getDescription());
//
//            if(listBikeIdRequest.isEmpty()){
//                maintainRepository.save(maintain);
//                return new Result(Constant.SUCCESS_CODE, "Update new maintain log successfully");
//            }
//            else{
//                List<MaintainBike> saveList = new ArrayList<>();
//                for (BikeIDListRequest item : maintainRequest.getBikeIDList()) {
//                    MaintainBike maintainBike = maintainBikeRepository.findAllByMaintainIdAndBikeId(maintainId, item.getBikeId());
//                    if(maintainBike.getIsDeleted())
//                    maintainBike.setBikeId(item.getBikeId());
//                    maintain.setModifiedDate(new Date());
//                    maintain.setModifiedUser(username);
//                    saveList.add(maintainBike);
//                }
//                maintainBikeRepository.saveAll(saveList);
//
//                //History Update
//                HistoryObject historyMaintainObject = new HistoryObject();
//                historyMaintainObject.setUsername(username);
//                historyMaintainObject.setEntityId(maintainId);
//                historyMaintainObject.getComparingMap().put("maintain_cost", new ComparedObject(maintain.getCost(), maintainRequest.getCost()));
//                historyMaintainObject.getComparingMap().put("maintain_date", new ComparedObject(maintain.getDate(), maintainRequest.getDate()));
//                historyMaintainObject.getComparingMap().put("maintain_description", new ComparedObject(maintain.getDescription(), maintainRequest.getDescription()));
//                historyMaintainObject.getComparingMap().put("maintain_type", new ComparedObject(maintain.getType(), maintainRequest.getType()));
//                if(!Objects.equals(maintainRequest.getType(), "MAINTAIN_BIKE")){
//                    historyService.saveHistory(Constant.HISTORY_UPDATE, maintain, historyMaintainObject);
//                }
//                else{
//
//                    for(MaintainBike item:listMaintainBike) {
//                        for(BikeIDListRequest items:listBikeIdRequest){
//                            Long checkBikeIdEntity = item.getBikeId();
//                            String checkBikeManualIdEntity = item.getBikeManualId();
//
//                            Long checkBikeIdRequest = items.getBikeId();
//                            String checkBikeManualIdRequest = items.getBikeManualId();
//                            if (!bikeRepository.existsByIdAndBikeManualIdAndIsDeleted(checkBikeIdRequest, checkBikeManualIdRequest, false)) {
//                                return new Result(Constant.LOGIC_ERROR_CODE, "Bike Id or Bike Manual Id is not existed");
//                            }
//                            else {
//                                historyMaintainObject.getComparingMap().put("bike_manual_id", new ComparedObject(checkBikeManualIdEntity, checkBikeManualIdRequest));
//                                historyMaintainObject.getComparingMap().put("bike_id", new ComparedObject(checkBikeIdEntity, checkBikeIdRequest));
//                            }
//                        }
//                    }
//                    historyService.saveHistory(Constant.HISTORY_UPDATE, maintain, historyMaintainObject);
//                }
//
//            }
            return new Result(Constant.SUCCESS_CODE, "Update new maintain log successfully");
        }catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "Fail");
        }
    }
}
