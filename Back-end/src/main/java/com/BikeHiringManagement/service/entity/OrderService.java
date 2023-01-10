package com.BikeHiringManagement.service.entity;

import com.BikeHiringManagement.constant.Constant;
import com.BikeHiringManagement.entity.*;
import com.BikeHiringManagement.model.request.ObjectNameRequest;
import com.BikeHiringManagement.model.response.AttachmentResponse;
import com.BikeHiringManagement.model.response.BikeResponse;
import com.BikeHiringManagement.model.response.CartResponse;
import com.BikeHiringManagement.model.temp.HistoryObject;
import com.BikeHiringManagement.model.temp.Result;
import com.BikeHiringManagement.repository.BikeRepository;
import com.BikeHiringManagement.repository.CustomerRepository;
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
    CustomerRepository customerRepository;

    @Autowired
    BikeRepository bikeRepository;

    @Autowired
    BikeSpecification bikeSpecification;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    CheckEntityExistService checkEntityExistService;

    @Autowired
    HistoryService historyService;


    public Result createCart(String username, Long bikeId){
        try{
            long orderId = -1;

            // Check IF Bike ID is existed
            if(!checkEntityExistService.isEntityExisted(Constant.BIKE, "id", bikeId)){
                return new Result(Constant.LOGIC_ERROR_CODE, "The Bike ID is not existed!!!");
            }
            // Check IF Bike Status is AVAILABLE
            if(!bikeRepository.existsByIdAndStatusAndIsDeleted(bikeId, "AVAILABLE", false)){
                return new Result(Constant.LOGIC_ERROR_CODE, "Bike status not available!!!");
            }

            // IF Cart exist -> Just Add Bike ID to Order Detail
            if(orderRepository.existsByCreatedUserAndStatusAndIsDeleted(username, "IN CART", false)){

                Order currentCart = orderRepository.findByCreatedUserAndStatusAndIsDeleted(username, "IN CART", false);
                orderId = currentCart.getId();

                // Check IF Bike has been included in order
                if (orderDetailRepository.existsByOrderIdAndBikeId(orderId, bikeId)){
                    OrderDetail existBikeInCart = orderDetailRepository.findOrderDetailByOrderIdAndBikeId(orderId, bikeId);

                    // IF exist -> throw alert
                    if(existBikeInCart.getIsDeleted() == false)
                    {
                        return new Result(Constant.LOGIC_ERROR_CODE, "The Bike Id: " + bikeId + " has been added to this cart!");
                    }

                    // IF exist + status is delete -> update is delete to FALSE
                    else
                    {
                        existBikeInCart.setIsDeleted(false);
                        orderDetailRepository.save(existBikeInCart);
                        return new Result(Constant.SUCCESS_CODE, "Add bike to cart successfully");
                    }
                }
            }

            // IF Cart is NOT exist -> Create new Cart
            else{
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
                long orderId = currentCart.getId();

                // GET List bike exist in Cart
                List<OrderDetail> listOrderDetail = orderDetailRepository.findAllOrderDetailByOrderIdAndIsDeleted(orderId, false);
                Map<String, Object> mapBike = bikeSpecification.getBikeListById(listOrderDetail);
                List<BikeResponse> listRes = (List<BikeResponse>) mapBike.get("data");

                // Clone current cart to cart response
                CartResponse cartResponse = modelMapper.map(currentCart, CartResponse.class);
                cartResponse.setListBike(listRes);
                cartResponse.setCustomerName(currentCart.getTempCustomerName());
                cartResponse.setPhoneNumber(currentCart.getTempCustomerPhone());

                // Set expected Start Date and End Date
                // Start Date = Today
                // End Date = Tomorrow
                if(currentCart.getExpectedStartDate() == null && currentCart.getExpectedEndDate() == null){
                    Date today = new Date();
                    Date tomorrow = new Date(today.getTime() + (1000 * 60 * 60 * 24));
                    cartResponse.setExpectedStartDate(today);
                    cartResponse.setExpectedEndDate(tomorrow);
                }

                // Calculate default cost (1 day hiring)
                if(currentCart.getCalculatedCost() == null){
                    double sum = 0;
                    for(BikeResponse item : listRes){
                        sum += item.getPrice();
                    }
                    cartResponse.setCalculatedCost(sum);
                }

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
            if(orderDetailRepository.existsByOrderIdAndBikeId(orderId, bikeId)) {

                // Check bike exist
                if(!checkEntityExistService.isEntityExisted(Constant.BIKE, "id", bikeId)){
                    return new Result(Constant.LOGIC_ERROR_CODE, "The Bike ID is not existed!!!");
                }

                // Check IF bike is not exist in cart
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
                return new Result(Constant.LOGIC_ERROR_CODE, "The Bike is not existed in Cart!!!");
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
