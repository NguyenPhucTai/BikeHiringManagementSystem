package com.BikeHiringManagement.controller;


import com.BikeHiringManagement.model.Result;
import com.BikeHiringManagement.model.request.BikeRequest;
import com.BikeHiringManagement.service.entity.BikeService;
import com.BikeHiringManagement.service.ResponseUtils;
import com.BikeHiringManagement.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/bike")
public class BikeController {

    @Autowired
    BikeService bikeService;

    @Autowired
    ResponseUtils responseUtils;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/create")
    public ResponseEntity<?> createBike (@RequestBody BikeRequest bikeRequest,
                                            HttpServletRequest request) {

        try {
            String jwt = jwtUtils.getJwtFromRequest(request);
            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            Result result = bikeService.createBike(bikeRequest, username);
            return responseUtils.getResponseEntity(null, result.getCode(), result.getMessage(), HttpStatus.OK);
        }catch (Exception e) {
            e.printStackTrace();
            return responseUtils.getResponseEntity(e, -1, "Login fail!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
