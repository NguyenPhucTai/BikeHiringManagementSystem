package com.BikeHiringManagement.service.entity;
import java.text.SimpleDateFormat;
import com.BikeHiringManagement.constant.Constant;
import com.BikeHiringManagement.entity.*;
import com.BikeHiringManagement.model.request.OrderRequest;
import com.BikeHiringManagement.model.response.BikeResponse;
import com.BikeHiringManagement.model.response.CartResponse;
import com.BikeHiringManagement.model.temp.Result;
import com.BikeHiringManagement.repository.BikeRepository;
import com.BikeHiringManagement.repository.CustomerRepository;
import com.BikeHiringManagement.repository.OrderDetailRepository;
import com.BikeHiringManagement.repository.OrderRepository;
import com.BikeHiringManagement.service.system.CheckEntityExistService;
import com.BikeHiringManagement.service.system.ResponseUtils;
import com.BikeHiringManagement.specification.BikeSpecification;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.lang.Math;

import java.util.*;
import java.util.function.DoublePredicate;

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


    public Result createCart(String username, Long bikeId) {
        try {
            long orderId = -1;

            if (bikeId != null) {
                // Check IF Bike ID is existed
                if (!checkEntityExistService.isEntityExisted(Constant.BIKE, "id", bikeId)) {
                    return new Result(Constant.LOGIC_ERROR_CODE, "The Bike ID is not existed!!!");
                }
            }

            // IF Cart exist -> Just Add Bike ID to Order Detail
            if (orderRepository.existsByCreatedUserAndStatusAndIsDeleted(username, "IN CART", false)) {

                Order currentCart = orderRepository.findByCreatedUserAndStatusAndIsDeleted(username, "IN CART", false);
                orderId = currentCart.getId();

                if (bikeId != null) {
                    // Check IF Bike has been included in order
                    if (orderDetailRepository.existsByOrderIdAndBikeId(orderId, bikeId)) {
                        OrderDetail existBikeInCart = orderDetailRepository.findOrderDetailByOrderIdAndBikeId(orderId, bikeId);

                        // IF exist -> throw alert
                        if (existBikeInCart.getIsDeleted() == false) {
                            return new Result(Constant.LOGIC_ERROR_CODE, "The Bike Id: " + bikeId + " has been added to this cart!");
                        }

                        // IF exist + status is delete -> update is delete to FALSE
                        else {
                            existBikeInCart.setModifiedUser(username);
                            existBikeInCart.setModifiedDate(new Date());
                            existBikeInCart.setIsDeleted(false);
                            orderDetailRepository.save(existBikeInCart);

                            int bikeNum = getNumberOfBikeInCart(orderId);
                            return new Result(Constant.SUCCESS_CODE, "Add bike to cart successfully", bikeNum);
                        }
                    }
                }
            }

            // IF Cart is NOT exist -> Create new Cart
            else {
                Order order = new Order();
                order.setCreatedUser(username);
                order.setCreatedDate(new Date());
                Order createdOrder = orderRepository.save(order);
                orderId = createdOrder.getId();
            }

            if (bikeId != null) {
                OrderDetail orderDetail = new OrderDetail();
                orderDetail.setCreatedDate(new Date());
                orderDetail.setCreatedUser(username);
                orderDetail.setOrderId(orderId);
                orderDetail.setBikeId(bikeId);
                orderDetailRepository.save(orderDetail);
            }

            int bikeNum = getNumberOfBikeInCart(orderId);

            if (bikeId == null) {
                return new Result(Constant.SUCCESS_CODE, "NEW ORDER", orderId);
            }
            return new Result(Constant.SUCCESS_CODE, "Create new cart successfully", bikeNum);
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "Fail");
        }
    }

    public Result getCartByUsername(String username) {
        try {
            Result result = new Result();
            Double calculatedCost = 0.0;
            Date today = new Date();
            Date tomorrow = new Date(today.getTime() + (1000 * 60 * 60 * 24));

            if (orderRepository.existsByCreatedUserAndStatusAndIsDeleted(username, "IN CART", false)) {
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
                if (currentCart.getExpectedStartDate() == null && currentCart.getExpectedEndDate() == null) {
                    cartResponse.setExpectedStartDate(today);
                    cartResponse.setExpectedEndDate(tomorrow);
                }

                // Calculate default cost (1 day hiring)
                if (currentCart.getCalculatedCost() == null) {
                    for (BikeResponse item : listRes) {
                        calculatedCost += item.getPrice();
                    }
                    cartResponse.setCalculatedCost(calculatedCost);
                }

                result.setMessage("Get successful");
                result.setCode(Constant.SUCCESS_CODE);
                result.setObject(cartResponse);
                return result;
            } else {
                Result resultCreate = createCart(username, null);
                Long orderId = (Long) resultCreate.getObject();

                CartResponse cartResponse = new CartResponse();
                cartResponse.setId(orderId);
                cartResponse.setExpectedStartDate(today);
                cartResponse.setExpectedEndDate(tomorrow);
                cartResponse.setCalculatedCost(calculatedCost);

                result.setMessage("Create new cart successfully");
                result.setCode(resultCreate.getCode());
                result.setObject(cartResponse);
                return result;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "System error", null);
        }
    }

    public Result getBikeNumberInCart(String username) {
        try {
            int bikeNum = 0;
            if (orderRepository.existsByCreatedUserAndStatusAndIsDeleted(username, "IN CART", false)) {
                Order order = orderRepository.findByCreatedUserAndStatusAndIsDeleted(username, "IN CART", false);
                bikeNum = orderDetailRepository.countAllByOrderIdAndIsDeleted(order.getId(), false);
            }
            return new Result(Constant.SUCCESS_CODE, "Get successfully", bikeNum);
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "System error", null);
        }
    }

    public Result saveOrder(OrderRequest orderRequest, String username) {
        try {
            if (!orderRepository.existsByCreatedUserAndStatusAndIsDeleted(username, "IN CART", false)) {
                return new Result(Constant.LOGIC_ERROR_CODE, "The Order ID is not existed!!!");
            }
            Order order = orderRepository.findByCreatedUserAndStatusAndIsDeleted(username, "IN CART", false);

            order.setTempCustomerName(orderRequest.getTempCustomerName());
            order.setTempCustomerPhone(orderRequest.getTempCustomerPhone());
            order.setExpectedStartDate(orderRequest.getExpectedStartDate());
            order.setExpectedEndDate(orderRequest.getExpectedEndDate());
            order.setModifiedDate(new Date());
            order.setModifiedUser(username);
            //order.setActualStartDate(orderRequest.getActualStartDate());
            //order.setActualEndDate(orderRequest.getActualEndDate());
            order.setIsUsedService(orderRequest.getIsUsedService());
            order.setServiceCost(orderRequest.getServiceCost());
            order.setServiceDescription(orderRequest.getServiceDescription());
            order.setDepositType(orderRequest.getDepositType());
            order.setDepositAmount(orderRequest.getDepositAmount());
            order.setDepositIdentifyCard(orderRequest.getDepositIdentifyCard());
            order.setDepositHotel(orderRequest.getDepositHotel());
            order.setNote(order.getNote());

            orderRepository.save(order);

            return new Result(Constant.SUCCESS_CODE, "Save order successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "Fail");
        }
    }

    public Result deleteBikeInCart(Long orderId, Long bikeId, String username) {
        try {
            if (orderDetailRepository.existsByOrderIdAndBikeId(orderId, bikeId)) {

                // Check bike exist
                if (!checkEntityExistService.isEntityExisted(Constant.BIKE, "id", bikeId)) {
                    return new Result(Constant.LOGIC_ERROR_CODE, "The Bike ID is not existed!!!");
                }

                // Check IF bike is not exist in cart
                OrderDetail currentCartDetail = orderDetailRepository.findOrderDetailByOrderIdAndBikeId(orderId, bikeId);
                if (currentCartDetail.getIsDeleted() == true) {
                    return new Result(Constant.LOGIC_ERROR_CODE, "The Bike Id: " + bikeId + " has not been existed in this cart!");
                }

                // REMOVE BIKE IN ORDER DETAIL
                currentCartDetail.setIsDeleted(true);
                currentCartDetail.setModifiedDate(new Date());
                currentCartDetail.setModifiedUser(username);
                orderDetailRepository.save(currentCartDetail);
                return new Result(Constant.SUCCESS_CODE, "Delete bike in cart successfully");
            } else {
                return new Result(Constant.LOGIC_ERROR_CODE, "The Bike is not existed in Cart!!!");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "Fail");
        }
    }

    public Result createOrder(OrderRequest orderRequest, Long orderId, String username) {
        try {
            if (!orderRepository.existsByIdAndStatus(orderId, "IN CART")) {
                return new Result(Constant.LOGIC_ERROR_CODE, "The Order ID is not existed!!!");
            }
            Order order = orderRepository.findByCreatedUserAndStatusAndIsDeleted(username,"IN CART", false);
            //created date, username logic
            order.setCreatedDate(new Date());
            order.setCreatedUser(username);
            order.setModifiedUser(null);
            order.setModifiedDate(null);

            //customer logic
            String phoneCustomer = orderRequest.getPhoneNumber();
            //if phone num is not existed in dtb
            if (!customerRepository.existsByPhoneNumberAndIsDeleted(phoneCustomer, false)){
                    Customer customer = new Customer();
                    customer.setCreatedDate(new Date());
                    customer.setCreatedUser(username);
                    customer.setPhoneNumber(phoneCustomer);
                    customer.setName(orderRequest.getTempCustomerName());
                    Customer saveCustomer = customerRepository.save(customer);
                    //add customer id
                    order.setCustomerId(saveCustomer.getId());
            }
            //if phone num existed
            else {
                Customer customer = customerRepository.findCustomerByPhoneNumberAndIsDeleted(phoneCustomer, false);
                order.setCustomerId(customer.getId());
            }
            //date logic
            order.setExpectedStartDate(orderRequest.getExpectedStartDate());
            order.setExpectedEndDate(orderRequest.getExpectedEndDate());
            Double dayHiring = calculateDaysHiring(orderRequest.getExpectedStartDate(), orderRequest.getExpectedEndDate());

            //cost logic
            List<OrderDetail> listOrderDetail = orderDetailRepository.findAllOrderDetailByOrderIdAndIsDeleted(orderId, false);
            Map<String, Object> mapBike = bikeSpecification.getBikePriceListById(listOrderDetail);
            List<Double> listRes = (List<Double>) mapBike.get("data");
            Double costHiring = calculateCostHiring(dayHiring, listRes);
            order.setCalculatedCost(costHiring);

            //service logic
            order.setIsUsedService(orderRequest.getIsUsedService());
            if(order.getIsUsedService()){
                order.setServiceDescription(orderRequest.getServiceDescription());
                Double serviceCost = orderRequest.getServiceCost();
                order.setServiceCost(serviceCost);
                //total amount
                Double totalAmount = costHiring + serviceCost;
                order.setTotalAmount(totalAmount);
            }
            else{
                //total amount
                order.setTotalAmount(costHiring);
            }

            //deposit logic
            String depositType = orderRequest.getDepositType();
            order.setDepositType(depositType);
            switch (depositType) {
                case "DEPOSITWITHMONEY":
                    order.setDepositAmount(order.getDepositAmount());
                    break;
                case "DEPOSITWITHHOTEL":
                    order.setDepositHotel(order.getDepositHotel());
                    break;
                case "DEPOSITWITHIDCARD":
                    order.setDepositIdentifyCard(order.getDepositIdentifyCard());
                    break;
            }

            //update status
            order.setStatus("PENDING");
            //return null for 2 field temp
            order.setTempCustomerPhone(null);
            order.setTempCustomerName(null);
            //note
            order.setNote(orderRequest.getNote());


            orderRepository.save(order);
            return new Result(Constant.SUCCESS_CODE, "Save order successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "Fail");
        }
    }

    public Integer getNumberOfBikeInCart(Long orderId) {
        try {
            if (orderRepository.existsByIdAndStatus(orderId, "IN CART")) {
                int bikeNum = orderDetailRepository.countAllByOrderIdAndIsDeleted(orderId, false);
                return bikeNum;
            }
            return -1;
        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
    }

    public double calculateDaysHiring(Date startDate, Date endDate) {
        try {
            //String dateStart = "01/14/2012 07:29:58";
            //String dateStop = "01/16/2012 19:31:48";
            //SimpleDateFormat format = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss");

            Date d1 = null;
            Date d2 = null;

            //d1 = format.parse(dateStart);
            //d2 = format.parse(dateStop);

            SimpleDateFormat format = new SimpleDateFormat("E MMM dd hh:mm:ss Z yyyy");
            d1 = format.parse(String.valueOf(startDate));
            d2 = format.parse(String.valueOf(endDate));

            double diff = d2.getTime() - d1.getTime();
            //long diffSeconds = diff / 1000 % 60;
            //long diffMinutes = diff / (60 * 1000) % 60;
            double diffHours = diff / (60 * 60 * 1000) % 24;
            double diffDays = diff / (24 * 60 * 60 * 1000);
            double result = 0;

            if(diffDays < 1 )
                result = 1;
            else if (diffDays >= 1 && diffHours < 1)
                result = (long) (diffDays);
            else if (diffDays >= 1 && diffHours >= 1 && diffHours < 6)
                result = (long) (diffDays) + 0.5;
            else if (diffDays >= 1 && diffHours >= 6)
                result = (long) (diffDays) + 1;
            else
                result = -1;
            return result;

        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
    }

    public Double calculateCostHiring(Double dayHiring, List<Double> listBikePrice){
        try {
            double amount = 0.0;
            if(!listBikePrice.isEmpty()){
                for(Double i : listBikePrice){
                    amount += i;
                }
                return amount * dayHiring;
            }
            return -1.0;
        } catch (Exception e) {
            e.printStackTrace();
            return -1.0;
        }
    }
}




