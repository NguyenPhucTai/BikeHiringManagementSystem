package com.BikeHiringManagement.controller.Authenticate;

import com.BikeHiringManagement.constant.Constant;
import com.BikeHiringManagement.model.request.BikeRequest;
import com.BikeHiringManagement.model.request.OrderRequest;
import com.BikeHiringManagement.model.response.BikeResponse;
import com.BikeHiringManagement.model.temp.Result;
import com.BikeHiringManagement.service.entity.OrderService;
import com.BikeHiringManagement.service.system.ResponseUtils;
import com.BikeHiringManagement.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/admin/order")
public class OrderController {

    @Autowired
    ResponseUtils responseUtils;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    OrderService orderService;

    @PostMapping("/add-bike")
    public ResponseEntity<?> addBikeToCart (@RequestBody OrderRequest orderRequest,
                                         HttpServletRequest request) {

        try {
            String jwt = jwtUtils.getJwtFromRequest(request);
            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            Result result = orderService.createCart(username, orderRequest.getBikeId());
            if((Integer) result.getObject() == -1){
                return  responseUtils.getResponseEntity(null, -1, result.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return responseUtils.getResponseEntity(result.getObject(), result.getCode(), result.getMessage(), HttpStatus.OK);
        }catch (Exception e) {
            e.printStackTrace();
            return responseUtils.getResponseEntity(e, -1, "Login fail!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/get")
    public ResponseEntity<?> getCartByUsername(HttpServletRequest request){
        try{
            String jwt = jwtUtils.getJwtFromRequest(request);
            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            Result result = orderService.getCartByUsername(username);
            if(result.getCode() == Constant.LOGIC_ERROR_CODE){
                return responseUtils.getResponseEntity(null, 1, result.getMessage(), HttpStatus.OK);
            }else if(result.getCode() == Constant.SYSTEM_ERROR_CODE){
                return  responseUtils.getResponseEntity(null, -1, result.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return  responseUtils.getResponseEntity( result.getObject(), 1, "Get Successfully", HttpStatus.OK);
        }catch(Exception e){
            return responseUtils.getResponseEntity(e, -1, "Login fail!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/cart/bike-number")
    public ResponseEntity<?> getBikeNumberInCart(HttpServletRequest request){
        try{
            String jwt = jwtUtils.getJwtFromRequest(request);
            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            Result result = orderService.getBikeNumberInCart(username);
            if(result.getCode() == Constant.LOGIC_ERROR_CODE){
                return responseUtils.getResponseEntity(null, 1, result.getMessage(), HttpStatus.OK);
            }else if(result.getCode() == Constant.SYSTEM_ERROR_CODE){
                return  responseUtils.getResponseEntity(null, -1, result.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return  responseUtils.getResponseEntity(result.getObject(), 1, "Get Successfully", HttpStatus.OK);
        }catch(Exception e){
            return responseUtils.getResponseEntity(e, -1, "Login fail!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveOrder (@RequestBody OrderRequest orderRequest,
                                         HttpServletRequest request) {

        try {
            String jwt = jwtUtils.getJwtFromRequest(request);
            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            Result result = orderService.saveOrder(orderRequest, username);
            return responseUtils.getResponseEntity(null, result.getCode(), result.getMessage(), HttpStatus.OK);
        }catch (Exception e) {
            e.printStackTrace();
            return responseUtils.getResponseEntity(e, -1, "Login fail!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/delete-bike/orderId={orderId}&bikeId={bikeId}")
    public ResponseEntity<?> deleteBikeInCart(@PathVariable Long orderId,@PathVariable Long bikeId, HttpServletRequest request){
        try{
            String jwt = jwtUtils.getJwtFromRequest(request);
            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            Result result = orderService.deleteBikeInCart(orderId, bikeId, username);
            return responseUtils.getResponseEntity(null, result.getCode(), result.getMessage(), HttpStatus.OK);
        }
        catch(Exception e){
            e.printStackTrace();
            return responseUtils.getResponseEntity(null, -1, "System Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("/create-order/orderId={orderId}")
    public ResponseEntity<?> createOrder (@RequestBody OrderRequest orderRequest,
                                          HttpServletRequest request,
                                          @PathVariable Long orderId) {

        try {
            String jwt = jwtUtils.getJwtFromRequest(request);
            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            Result result = orderService.createOrder(orderRequest, orderId, username);
            if(result.getCode() == Constant.LOGIC_ERROR_CODE){
                return responseUtils.getResponseEntity(null, 1, result.getMessage(), HttpStatus.OK);
            }else if(result.getCode() == Constant.SYSTEM_ERROR_CODE){
                return  responseUtils.getResponseEntity(null, -1, result.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return  responseUtils.getResponseEntity(result.getObject(), 1, "Get Successfully", HttpStatus.OK);
        }catch (Exception e) {
            e.printStackTrace();
            return responseUtils.getResponseEntity(e, -1, "Login fail!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
