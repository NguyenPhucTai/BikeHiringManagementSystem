package com.BikeHiringManagement.service.entity;

import com.BikeHiringManagement.constant.Constant;
import com.BikeHiringManagement.dto.PageDto;
import com.BikeHiringManagement.entity.BikeCategory;
import com.BikeHiringManagement.entity.Maintain;
import com.BikeHiringManagement.entity.Order;
import com.BikeHiringManagement.model.request.BikeCategoryCreateRequest;
import com.BikeHiringManagement.model.request.DashboardRequest;
import com.BikeHiringManagement.model.request.PaginationRequest;
import com.BikeHiringManagement.model.response.DashboardResponse;
import com.BikeHiringManagement.model.temp.ComparedObject;
import com.BikeHiringManagement.model.temp.HistoryObject;
import com.BikeHiringManagement.model.temp.Result;
import com.BikeHiringManagement.repository.BikeCategoryRepository;
import com.BikeHiringManagement.repository.BikeRepository;
import com.BikeHiringManagement.repository.MaintainRepository;
import com.BikeHiringManagement.repository.OrderRepository;
import com.BikeHiringManagement.service.system.CheckEntityExistService;
import com.BikeHiringManagement.service.system.ResponseUtils;
import com.BikeHiringManagement.specification.BikeCategorySpecification;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    BikeRepository bikeRepository;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    MaintainRepository maintainRepository;

    @Autowired
    ResponseUtils responseUtils;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    CheckEntityExistService checkEntityExistService;

    public Result getDataByDate(DashboardRequest dashboardRequest){
        try {
            Date dateFrom = dashboardRequest.getDateFrom();
            Date dateTo = dashboardRequest.getDateTo();
            DashboardResponse result = new DashboardResponse();

            Double revenue = 0.0;
            Double expense = 0.0;
            Double income = 0.0;

            /* ---------------------- BIKE INFO ---------------------------*/
            Integer totalAutoBike = bikeRepository.countBikesByBikeCategoryIdAndIsDeleted(Constant.BIKE_AUTO, Boolean.FALSE);
            Integer totalManualBike = bikeRepository.countBikesByBikeCategoryIdAndIsDeleted(Constant.BIKE_MANUAL, Boolean.FALSE);
            Integer totalBike = bikeRepository.countBikesByIsDeleted(Boolean.FALSE);

            /* ---------------------- ORDER INFO ---------------------------*/
            List<Order> orderList = orderRepository.findAllByActualStartDateAfterAndActualEndDateBeforeAndIsDeleted(dateFrom, dateTo, Boolean.FALSE);
            long countTotalOrder = orderList.stream().filter(order -> !order.getStatus().equalsIgnoreCase(Constant.STATUS_ORDER_IN_CART)).count();
            long countCloseOrder = orderList.stream().filter(order -> order.getStatus().equalsIgnoreCase(Constant.STATUS_ORDER_CLOSED)).count();
            long countCancelOrder = orderList.stream().filter(order -> order.getStatus().equalsIgnoreCase(Constant.STATUS_ORDER_CANCEL)).count();
            long countPendingOrder = countTotalOrder - countCancelOrder - countCloseOrder;

            List<Order> closeOrderList = orderList.stream().filter(order -> order.getStatus().equalsIgnoreCase(Constant.STATUS_ORDER_CLOSED)).collect(Collectors.toList());
            revenue = closeOrderList.stream().mapToDouble(order -> order.getTotalAmount().doubleValue()).sum();

            /* ---------------------- MAINTAIN INFO ---------------------------*/
            List<Maintain> maintainsList = maintainRepository.findAllByIsDeleted(Boolean.FALSE);
            expense = maintainsList.stream().mapToDouble(maintain -> maintain.getCost().doubleValue()).sum();
            income = revenue - expense;



            /* ---------------------- RETURN DASH BOARD ---------------------------*/
            result.setTotalBike(totalBike);
            result.setTotalAutoBike(totalAutoBike);
            result.setTotalManualBike(totalManualBike);

            result.setTotalOrder((int) countTotalOrder);
            result.setTotalOrderClose((int) countCloseOrder);
            result.setTotalOrderCancel((int) countCancelOrder);
            result.setTotalOrderPending((int) countPendingOrder);

            result.setRevenue(revenue);
            result.setExpense(expense);
            result.setIncome(income);

            return new Result(Constant.SUCCESS_CODE, "Get dashboard successfully!", result);
        }catch (Exception e){
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "Fail");
        }
    }

}
