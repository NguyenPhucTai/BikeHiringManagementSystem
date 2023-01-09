package com.BikeHiringManagement.service.entity;

import com.BikeHiringManagement.constant.Constant;
import com.BikeHiringManagement.entity.Bike;
import com.BikeHiringManagement.entity.BikeImage;
import com.BikeHiringManagement.entity.Order;
import com.BikeHiringManagement.entity.OrderDetail;
import com.BikeHiringManagement.model.request.ObjectNameRequest;
import com.BikeHiringManagement.model.response.AttachmentResponse;
import com.BikeHiringManagement.model.response.BikeResponse;
import com.BikeHiringManagement.model.response.CartResponse;
import com.BikeHiringManagement.model.temp.HistoryObject;
import com.BikeHiringManagement.model.temp.Result;
import com.BikeHiringManagement.repository.BikeRepository;
import com.BikeHiringManagement.repository.OrderDetailRepository;
import com.BikeHiringManagement.repository.OrderRepository;
import com.BikeHiringManagement.service.system.CheckEntityExistService;
import com.BikeHiringManagement.service.system.ResponseUtils;
import com.BikeHiringManagement.specification.BikeSpecification;
import org.aspectj.weaver.ast.Or;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    @Autowired
    ResponseUtils responseUtils;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    OrderDetailRepository orderDetailRepository;
    @Autowired
    BikeSpecification bikeSpecification;

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
            // Check if Bike ID is existed
            if(!checkEntityExistService.isEntityExisted(Constant.BIKE, "id", bikeId)){
                return new Result(Constant.LOGIC_ERROR_CODE, "The Bike ID is not existed!!!");
            }
            // Check if Bike Status is available
            if(!bikeRepository.existsByIdAndStatusAndIsDeleted(bikeId, "AVAILABLE", false)){
                return new Result(Constant.LOGIC_ERROR_CODE, "Bike status not available!!!");
            }
            // IF Cart exist -> Just Add Bike ID to Order Detail
            if(orderRepository.existsByCreatedUserAndStatusAndIsDeleted(username, "IN CART", false)){
                Order currentCart = orderRepository.findByCreatedUserAndStatusAndIsDeleted(username, "IN CART", false);
                orderId = currentCart.getId();

                // Check if Bike has been included in order
                if (orderDetailRepository.existsByOrderIdAndBikeIdAndIsDeleted(orderId, bikeId, false)){
                    return new Result(Constant.LOGIC_ERROR_CODE, "The Bike Id: " + bikeId + " has been added to this cart!");
                }
            }else{
                Order order = new Order();
                order.setCreatedUser(username);
                order.setCreatedDate(new Date());
                Order createdOrder = orderRepository.save(order);
                orderId = createdOrder.getId();
            }
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setCreatedDate(new Date());
            orderDetail.setCreatedUser(username);
            orderDetail.setOrderId(orderId);
            orderDetail.setBikeId(bikeId);
            orderDetailRepository.save(orderDetail);
            return new Result(Constant.SUCCESS_CODE, "Create new cart successfully");
        }catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "Fail");
        }
    }

    public Result getCartByUsername(String username){
        try{
            Result result = new Result();
            if(orderRepository.existsByCreatedUserAndStatusAndIsDeleted(username, "IN CART", false)){
                Order currentCart = orderRepository.findByCreatedUserAndStatusAndIsDeleted(username, "IN CART", false);
                Long orderId = currentCart.getId();
                List<OrderDetail> listOrderDetail = orderDetailRepository.findAllOrderDetailByOrderIdAndIsDeleted(orderId, false);
                Map<String, Object> mapBike = bikeSpecification.getBikeListById(listOrderDetail);
                List<BikeResponse> listRes = (List<BikeResponse>) mapBike.get("data");
                CartResponse cartResponse = new CartResponse();
                //map current cart to cart response
                //get customer name from customer id in current cart
                cartResponse.setOrderId(orderId);
                cartResponse.setCustomerName("Customer Name in here");
                cartResponse.setPhoneNumber("Customer Phone in here");
                //list Bike
                cartResponse.setListBike(listRes);
                //calculate Date
                Date today = new Date();
                Date tomorrow =  new Date();
                tomorrow.setDate(today.getDate() + 1);
                cartResponse.setExpectedStartDate(today);
                cartResponse.setExpectedEndDate(tomorrow);
                //calculate Cost
                double sum = 0;
                for(BikeResponse item : listRes){
                    sum += item.getPrice();
                }
                cartResponse.setCalculatedCost(sum);

                result.setMessage("Get successful");
                result.setCode(Constant.SUCCESS_CODE);
                result.setObject(cartResponse);
                return  result;
            }
            else{
                return new Result(Constant.LOGIC_ERROR_CODE, "The Order ID is not existed!!!");
            }
        }catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "System error", null);
        }
    }

    public Result deleteBikeInCart(Long orderId, Long bikeId){
        try{
            if(orderDetailRepository.existsByOrderIdAndIsDeleted(orderId, false)) {
                // Check bike exist
                if(!checkEntityExistService.isEntityExisted(Constant.BIKE, "id", bikeId)){
                    return new Result(Constant.LOGIC_ERROR_CODE, "The Bike ID is not existed!!!");
                }
                OrderDetail currentCartDetail = orderDetailRepository.findOrderDetailByOrderIdAndBikeId(orderId,bikeId);
                if(currentCartDetail.getIsDeleted() == true) {
                    return new Result(Constant.LOGIC_ERROR_CODE, "The Bike Id: " + bikeId + " has not been existed in this cart!");
                }
                // REMOVE BIKE IN ORDER DETAIL
                currentCartDetail.setIsDeleted(true);
                orderDetailRepository.save(currentCartDetail);
                return new Result(Constant.SUCCESS_CODE, "Delete bike in cart successfully");
            }
            else{
                return new Result(Constant.LOGIC_ERROR_CODE, "The Order ID is not existed!!!");
            }
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
