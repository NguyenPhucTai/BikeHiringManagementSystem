package com.BikeHiringManagement.service.entity;

import com.BikeHiringManagement.constant.Constant;
import com.BikeHiringManagement.entity.Bike;
import com.BikeHiringManagement.entity.Order;
import com.BikeHiringManagement.entity.OrderDetail;
import com.BikeHiringManagement.model.request.ObjectNameRequest;
import com.BikeHiringManagement.model.temp.HistoryObject;
import com.BikeHiringManagement.model.temp.Result;
import com.BikeHiringManagement.repository.BikeRepository;
import com.BikeHiringManagement.repository.OrderDetailRepository;
import com.BikeHiringManagement.repository.OrderRepository;
import com.BikeHiringManagement.service.system.CheckEntityExistService;
import com.BikeHiringManagement.service.system.ResponseUtils;
import org.aspectj.weaver.ast.Or;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
@Service
public class OrderService {

    @Autowired
    ResponseUtils responseUtils;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    OrderDetailRepository orderDetailRepository;

    @Autowired
    BikeRepository bikeRepository;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    CheckEntityExistService checkEntityExistService;

    @Autowired
    HistoryService historyService;


    public Result createCart(String username, Long bikeId){
        try{
            long orderId = -1;
            // IF Cart exist -> Just Add Bike ID to Order Detail
            if(orderRepository.existsByCreatedUserAndStatusAndIsDeleted(username, "IN CART", false)){

                // Check if Bike ID is existed
                if(!checkEntityExistService.isEntityExisted(Constant.BIKE, "id", bikeId)){
                    return new Result(Constant.LOGIC_ERROR_CODE, "The Bike ID is not existed!!!");
                }
                Order currentCart = orderRepository.findByCreatedUserAndStatusAndIsDeleted(username, "IN CART", false);
                orderId = currentCart.getId();

                // Check if Bike has been included in order
                if (orderDetailRepository.existsByOrderIdAndBikeIdAndIsDeleted(orderId, bikeId, false)){
                    return new Result(Constant.LOGIC_ERROR_CODE, "The Bike Id: " + bikeId + " has been added to this cart!");
                }
            }else{
                Order order = new Order();
                order.setCreatedUser(username);
                Order createdOrder = orderRepository.save(order);
                orderId = createdOrder.getId();
            }
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrderId(orderId);
            orderDetail.setBikeId(bikeId);
            orderDetailRepository.save(orderDetail);
            return new Result(Constant.SUCCESS_CODE, "Create new cart successfully");
        }catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "Fail");
        }
    }

//    public Result createOrder(ObjectNameRequest orderCreateRequest){
//        try{
//            if(checkEntityExistService.isEntityExisted(Constant.BIKE_COLOR, "name", orderCreateRequest.getName())){
//                return new Result(Constant.LOGIC_ERROR_CODE, "The bike color has been existed!!!");
//            }else{
//                BikeColor newBikeColor = modelMapper.map(orderCreateRequest, BikeColor.class);
//                newBikeColor.setCreatedDate(new Date());
//                newBikeColor.setCreatedUser(orderCreateRequest.getUsername());
//                BikeColor savedBikeColor =  bikeColorRepository.save(newBikeColor);
//
//                HistoryObject historyObject = new HistoryObject();
//                historyObject.setUsername(orderCreateRequest.getUsername());
//                historyObject.setEntityId(savedBikeColor.getId());
//                historyService.saveHistory(Constant.HISTORY_CREATE, savedBikeColor, historyObject);
//
//                return new Result(Constant.SUCCESS_CODE, "Create new bike color successfully");
//            }
//
//        }catch (Exception e) {
//            e.printStackTrace();
//            return new Result(Constant.SYSTEM_ERROR_CODE, "Fail");
//        }
//    }
}
