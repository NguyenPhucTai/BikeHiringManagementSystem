package com.BikeHiringManagement.controller;

import com.BikeHiringManagement.model.request.BikeCategoryRequest;
import com.BikeHiringManagement.service.BikeCategoryService;
import com.BikeHiringManagement.service.ResponseUtils;
import com.BikeHiringManagement.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/bike-category")
public class BikeCategoryController {
    @Autowired
    ResponseUtils responseUtils;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    BikeCategoryService bikeCategoryService;

    @PostMapping("/create")
    public ResponseEntity<?> createBikeCategory(@RequestBody BikeCategoryRequest bikeCategoryRequest,
                                                HttpServletRequest request) {
        try{
            String jwt = jwtUtils.getJwtFromRequest(request);
            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            bikeCategoryRequest.setCreatedUser(username);
            Integer result = bikeCategoryService.createBikeCategory(bikeCategoryRequest);
            if(result == 1){
                return responseUtils.getResponseEntity(null, 1, "Create bike category successfully", HttpStatus.OK);
            }else if (result == -2){
                return responseUtils.getResponseEntity(null, -2, "Bike category has been already existed", HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return responseUtils.getResponseEntity(null, -1, "System Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }catch(Exception e){
            e.printStackTrace();
            return responseUtils.getResponseEntity(null, -1, "System Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
