package com.BikeHiringManagement.controller.Authenticate;

import com.BikeHiringManagement.model.request.BikeCreateRequest;
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

    @PostMapping("/create")
    public ResponseEntity<?> createCart (@RequestBody BikeCreateRequest bikeRequest,
                                         HttpServletRequest request) {

        try {
            String jwt = jwtUtils.getJwtFromRequest(request);
            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            Result result = orderService.createCart(username, bikeRequest.getId());
            return responseUtils.getResponseEntity(null, result.getCode(), result.getMessage(), HttpStatus.OK);
        }catch (Exception e) {
            e.printStackTrace();
            return responseUtils.getResponseEntity(e, -1, "Login fail!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
