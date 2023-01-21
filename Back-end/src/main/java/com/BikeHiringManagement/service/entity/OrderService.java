package com.BikeHiringManagement.service.entity;

import java.math.BigDecimal;
import java.math.MathContext;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;

import com.BikeHiringManagement.constant.Constant;
import com.BikeHiringManagement.entity.*;
import com.BikeHiringManagement.model.request.OrderRequest;
import com.BikeHiringManagement.model.response.BikeResponse;
import com.BikeHiringManagement.model.response.CartResponse;
import com.BikeHiringManagement.model.temp.Result;
import com.BikeHiringManagement.repository.*;
import com.BikeHiringManagement.service.system.CheckEntityExistService;
import com.BikeHiringManagement.service.system.ResponseUtils;
import com.BikeHiringManagement.specification.BikeSpecification;
import com.udojava.evalex.Expression;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.Math;

import java.util.*;
import java.util.function.DoublePredicate;
import java.util.stream.Collectors;

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
    FormulaRepository formulaRepository;

    @Autowired
    FormulaVariableRepository formulaVariableRepository;

    @Autowired
    FormulaCoefficientRepository formulaCoefficientRepository;

    @Autowired
    BikeSpecification bikeSpecification;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    CheckEntityExistService checkEntityExistService;

    @Autowired
    HistoryService historyService;

    /*--------------------------- RETURN FUNCTION ------------------------*/
    public Result cartAddBike(String username, Long bikeId) {
        try {
            long orderId = -1;

            // Check IF Bike ID is existed
            if (bikeId != null) {
                if (!checkEntityExistService.isEntityExisted(Constant.BIKE, "id", bikeId)) {
                    return new Result(Constant.LOGIC_ERROR_CODE, "The Bike ID is not existed!!!");
                }
            }

            /*--------------------------- ORDER LOGIC ------------------------*/
            // IF Cart exist -> Just Add Bike ID to Order Detail
            if (orderRepository.existsByCreatedUserAndStatusAndIsDeleted(username, "IN CART", Boolean.FALSE)) {

                Order currentCart = orderRepository.findByCreatedUserAndStatusAndIsDeleted(username, "IN CART", Boolean.FALSE);
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

                            int bikeNum = getNumberOfBikeInCartById(orderId);
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


            /*--------------------------- ORDER DETAIL LOGIC ------------------------*/
            if (bikeId != null) {
                OrderDetail orderDetail = new OrderDetail();
                orderDetail.setCreatedDate(new Date());
                orderDetail.setCreatedUser(username);
                orderDetail.setOrderId(orderId);
                orderDetail.setBikeId(bikeId);
                orderDetailRepository.save(orderDetail);
            }

            /*--------------------------- RETURN ORDER ID ------------------------*/
            if (bikeId == null) {
                return new Result(Constant.SUCCESS_CODE, "NEW ORDER", orderId);
            }

            /*--------------------------- RETURN BIKE NUMBER ------------------------*/
            int bikeNum = getNumberOfBikeInCartById(orderId);
            return new Result(Constant.SUCCESS_CODE, "Create new cart successfully", bikeNum);
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "Fail");
        }
    }

    public Result cartGetByUsername(String username) {
        try {
            Result result = new Result();
            Double calculatedCost = 0.0;
            Date today = new Date();
            Date tomorrow = new Date(today.getTime() + (1000 * 60 * 60 * 24));
            Long orderId = null;
            CartResponse cartResponse = new CartResponse();

            /*--------------------------- CART EXISTS ------------------------*/
            // RETURN ALL INFO OF CART
            if (orderRepository.existsByCreatedUserAndStatusAndIsDeleted(username, "IN CART", Boolean.FALSE)) {
                // GET CURRENT CART
                Order currentCart = orderRepository.findByCreatedUserAndStatusAndIsDeleted(username, "IN CART", Boolean.FALSE);
                orderId = currentCart.getId();

                // CREATE CART TO RESPONSE
                cartResponse = modelMapper.map(currentCart, CartResponse.class);
                cartResponse.setCustomerName(currentCart.getTempCustomerName());
                cartResponse.setPhoneNumber(currentCart.getTempCustomerPhone());

                /*--------------------------- BIKE LOGIC ------------------------*/
                // GET BIKE LIST IN CART
                List<OrderDetail> listOrderDetail = orderDetailRepository.findAllOrderDetailByOrderIdAndIsDeleted(orderId, Boolean.FALSE);
                List<Long> listBikeID = listOrderDetail.stream().map(x -> x.getBikeId()).collect(Collectors.toList());
                Map<String, Object> mapBike = bikeSpecification.getBikeListById(listBikeID);
                List<BikeResponse> listRes = (List<BikeResponse>) mapBike.get("data");
                cartResponse.setListBike(listRes);

                /*--------------------------- CUSTOMER LOGIC ------------------------*/
                if (currentCart.getTempCustomerPhone() != null) {
                    cartResponse.setCustomerName(currentCart.getTempCustomerName());
                    cartResponse.setPhoneNumber(currentCart.getTempCustomerPhone());
                }

                /*--------------------------- DATE LOGIC ------------------------*/
                // Set expected Start Date and End Date
                // Start Date = Today
                // End Date = Tomorrow
                if (currentCart.getExpectedStartDate() == null && currentCart.getExpectedEndDate() == null) {
                    cartResponse.setExpectedStartDate(today);
                    cartResponse.setExpectedEndDate(tomorrow);
                }

                /*--------------------------- COST LOGIC ------------------------*/
                // Calculate default cost (1 day hiring)
                calculatedCost = currentCart.getCalculatedCost();
                if ((calculatedCost == null || calculatedCost == 0.0) && listRes.size() > 0) {
                    calculatedCost = listRes.stream().filter(x -> x.getPrice() != null).mapToDouble(BikeResponse::getPrice).sum();
                }
                cartResponse.setCalculatedCost(calculatedCost);

                // Calculate Total Amount
                Double sumAmount  = 0.0;
                if (currentCart.getIsUsedService() != null && currentCart.getIsUsedService() == Boolean.TRUE && currentCart.getServiceCost() != null && currentCart.getServiceCost() > 0.0) {
                    sumAmount = calculatedCost + currentCart.getServiceCost();
                }else{
                    sumAmount = calculatedCost;
                }
                cartResponse.setTotalAmount(sumAmount);
                result.setMessage("Get successful");
                result.setCode(Constant.SUCCESS_CODE);
            }

            /*--------------------------- CART NOT EXIST ------------------------*/
            else {
                // CREATE NEW CART
                Result resultCreate = cartAddBike(username, null);
                orderId = (Long) resultCreate.getObject();

                cartResponse.setId(orderId);
                cartResponse.setExpectedStartDate(today);
                cartResponse.setExpectedEndDate(tomorrow);
                cartResponse.setCalculatedCost(calculatedCost);

                result.setMessage("Create new cart successfully");
                result.setCode(resultCreate.getCode());
                result.setObject(cartResponse);
                return result;
            }

            result.setObject(cartResponse);
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "System error", null);
        }
    }

    public Result cartGetBikeNumber(String username) {
        try {
            int bikeNum = 0;
            if (!orderRepository.existsByCreatedUserAndStatusAndIsDeleted(username, "IN CART", Boolean.FALSE)) {
                return new Result(Constant.LOGIC_ERROR_CODE, "User is not having cart!");
            }
            Order order = orderRepository.findByCreatedUserAndStatusAndIsDeleted(username, "IN CART", Boolean.FALSE);
            bikeNum = orderDetailRepository.countAllByOrderIdAndIsDeleted(order.getId(), false);
            return new Result(Constant.SUCCESS_CODE, "Get successfully", bikeNum);
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "System error", null);
        }
    }

    public Result cartDeleteBike(Long orderId, Long bikeId, String username) {
        try {
            // CHECK IF BIKE ID EXIST IN CART
            if (orderDetailRepository.existsByOrderIdAndBikeId(orderId, bikeId)) {

                // CHECK IF BIKE EXIST
                if (!checkEntityExistService.isEntityExisted(Constant.BIKE, "id", bikeId)) {
                    return new Result(Constant.LOGIC_ERROR_CODE, "The Bike ID is not existed!!!");
                }

                OrderDetail currentCartDetail = orderDetailRepository.findOrderDetailByOrderIdAndBikeId(orderId, bikeId);

                // CHECK IF BIKE IS NOT EXIST IN CART
                if (currentCartDetail.getIsDeleted() == true) {
                    return new Result(Constant.LOGIC_ERROR_CODE, "The Bike ID: " + bikeId + " is not existed in cart!");
                }

                // REMOVE BIKE IN ORDER DETAIL
                currentCartDetail.setIsDeleted(true);
                currentCartDetail.setModifiedDate(new Date());
                currentCartDetail.setModifiedUser(username);
                orderDetailRepository.save(currentCartDetail);

                return new Result(Constant.SUCCESS_CODE, "Delete bike in cart successfully");
            } else {
                return new Result(Constant.LOGIC_ERROR_CODE, "The Bike ID: " + bikeId + " is not existed in cart!");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "Fail");
        }
    }

    public Result cartCalculateHiringCost(OrderRequest orderRequest) {
        try {
            Long orderId = orderRequest.getId();
            Double bikeCost = 0.0;

            // CHECK IF ORDER IS EXISTED
            if (!checkEntityExistService.isEntityExisted(Constant.ORDER, "id", orderId)) {
                return new Result(Constant.LOGIC_ERROR_CODE, "The order id " + orderId + " has not been existed!!!");
            }

            // GET LIST BIKE IN ORDER
            List<OrderDetail> listOrderDetail = orderDetailRepository.findAllOrderDetailByOrderIdAndIsDeleted(orderId, Boolean.FALSE);
            if (listOrderDetail.size() > 0) {
                Map<String, Object> mapBike = bikeSpecification.getBikePriceListById(listOrderDetail);
                List<Double> listBikePrice = (List<Double>) mapBike.get("data");
                bikeCost = listBikePrice.stream().mapToDouble(f -> f.doubleValue()).sum();
            }

            // CALCULATE COST
            Double calculatedCost = calculateCostByFormula(Constant.FORMULA_BIKE_HIRING_CALCULATION, orderRequest.getExpectedStartDate(), orderRequest.getExpectedEndDate(), bikeCost);
            if (calculatedCost < 0.0) {
                return new Result(Constant.LOGIC_ERROR_CODE, "Error when calculating cost. Please contact IT!!!");
            }

            return new Result(Constant.SUCCESS_CODE, "Calculate successfully!", calculatedCost);
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "Fail");
        }
    }

    public Result cartSave(OrderRequest orderRequest, String username) {
        try {
            if (!orderRepository.existsByCreatedUserAndStatusAndIsDeleted(username, "IN CART", false)) {
                return new Result(Constant.LOGIC_ERROR_CODE, "The Order ID is not existed!!!");
            }
            Order order = orderRepository.findByCreatedUserAndStatusAndIsDeleted(username, "IN CART", false);
            String message = "Save order successfully";
            /*--------------------------- CUSTOMER LOGIC ------------------------*/
            String tempCustomerName = orderRequest.getTempCustomerName();
            String tempCustomerPhone = orderRequest.getTempCustomerPhone();
            Long customerId = null;

            // CREATE ORDER CASE
            if (orderRequest.getIsCreateOrder() == Boolean.TRUE) {
                // IF Customer EXIST By Phone
                if (customerRepository.existsByPhoneNumberAndIsDeleted(tempCustomerPhone, Boolean.FALSE)) {
                    Customer customer = customerRepository.findCustomerByPhoneNumberAndIsDeleted(tempCustomerPhone, Boolean.FALSE);
                    customerId = customer.getId();
                }
                // IF Customer NOT EXIST By Phone
                else {
                    Customer customer = new Customer();
                    customer.setCreatedDate(new Date());
                    customer.setCreatedUser(username);
                    customer.setPhoneNumber(tempCustomerPhone);
                    customer.setName(tempCustomerName);
                    Customer saveCustomer = customerRepository.save(customer);
                    customerId = saveCustomer.getId();
                }
                tempCustomerName = null;
                tempCustomerPhone = null;
            }

            order.setCustomerId(customerId);
            order.setTempCustomerName(tempCustomerName);
            order.setTempCustomerPhone(tempCustomerPhone);


            /*--------------------------- CALCULATE COST ------------------------*/
            order.setExpectedStartDate(orderRequest.getExpectedStartDate());
            order.setExpectedEndDate(orderRequest.getExpectedEndDate());
            order.setCalculatedCost(orderRequest.getCalculatedCost());


            /*--------------------------- SERVICE COST LOGIC ------------------------*/
            String serviceDescription = null;
            Double serviceCost = null;
            if (order.getIsUsedService() != null && order.getIsUsedService() == true) {
                serviceDescription = orderRequest.getServiceDescription();
                serviceCost = orderRequest.getServiceCost();
            }
            order.setIsUsedService(orderRequest.getIsUsedService());
            order.setServiceDescription(serviceDescription);
            order.setServiceCost(serviceCost);

            /*--------------------------- DEPOSIT COST LOGIC ------------------------*/
            Double depositAmount = null;
            String depositIdentifyCard = null;
            String depositHotel = null;
            String depositType = orderRequest.getDepositType();

            switch (depositType.toUpperCase()) {
                case "MONEY":
                    depositAmount = orderRequest.getDepositAmount();
                    break;
                case "HOTEL":
                    depositHotel = orderRequest.getDepositHotel();
                    break;
                case "IDENTIFYCARD":
                    depositIdentifyCard = orderRequest.getDepositIdentifyCard();
                    break;
            }
            order.setDepositType(depositType);
            order.setDepositAmount(depositAmount);
            order.setDepositHotel(depositHotel);
            order.setDepositIdentifyCard(depositIdentifyCard);


            /*--------------------------- UPDATE OTHER FIELD ------------------------*/
            order.setNote(orderRequest.getNote());
            if (orderRequest.getIsCreateOrder() == Boolean.TRUE) {
                order.setStatus("PENDING");
                order.setTotalAmount(orderRequest.getTotalAmount());
                message = "Create order successfully";
            }

            orderRepository.save(order);
            return new Result(Constant.SUCCESS_CODE, message);
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "Fail");
        }
    }


    /*--------------------------- NONE RETURN FUNCTION ------------------------*/
    public Integer getNumberOfBikeInCartById(Long orderId) {
        try {
            if (orderRepository.existsByIdAndStatus(orderId, "IN CART")) {
                int bikeNum = orderDetailRepository.countAllByOrderIdAndIsDeleted(orderId, Boolean.FALSE);
                return bikeNum;
            }
            return -1;
        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
    }

    public Double calculateCostByFormula(Long formulaId, Date startDate, Date endDate, double bikeCost) {
        try {
            NumberFormat numberFormater5F = NumberFormat.getInstance();
            numberFormater5F.setGroupingUsed(false);
            numberFormater5F.setMinimumFractionDigits(5);
            double finalCost = 0.0;

            String formula = null;
            double totalHour = 0.0;
            double diffHour = 0.0;
            double coefficient = 0.0;

            // GET FORMULA
            if (!formulaRepository.existsByIdAndIsDeleted(Constant.FORMULA_BIKE_HIRING_CALCULATION, Boolean.FALSE)) {
                return -1.0;
            }
            Formula formulaObject = formulaRepository.findFormulaByIdAndIsDeleted(Constant.FORMULA_BIKE_HIRING_CALCULATION, Boolean.FALSE);
            formula = formulaObject.getFormula();

            // CALCULATE TOTAL HOUR
            totalHour = (endDate.getTime() - startDate.getTime()) / Constant.MILLI_TO_HOUR;

            // HIRING DAYS > 1 DAY
            if (totalHour > 24) {
                diffHour = totalHour % 24.0;

                // GET FORMULA COEFFICIENT
                if (!formulaCoefficientRepository.existsByFormulaIdAndUpperLimitGreaterThanAndLowerLimitLessThanEqualAndIsDeleted(formulaId, diffHour, diffHour, Boolean.FALSE)) {
                    return -1.0;
                }
                FormulaCoefficient formulaCoefficient = formulaCoefficientRepository.findFormulaCoefficientByFormulaIdAndUpperLimitGreaterThanAndLowerLimitLessThanEqualAndIsDeleted(formulaId, diffHour, diffHour, Boolean.FALSE);
                coefficient = formulaCoefficient.getCoefficient();

                // APPLY FORMULA
                BigDecimal bigDecimalResult = new Expression(formula, MathContext.DECIMAL128)
                        .with("A", numberFormater5F.format(bikeCost))
                        .and("B", numberFormater5F.format(totalHour))
                        .and("C", numberFormater5F.format(coefficient))
                        .eval();
                finalCost = bigDecimalResult.doubleValue();
            }

            // HIRING DAYS <= 1 DAY
            else {
                finalCost = bikeCost;
            }

            return finalCost;
        } catch (Exception e) {
            e.printStackTrace();
            return -1.0;
        }
    }

}




