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
    public ResponseEntity<?> createBikeCategory(@RequestBody BikeCategoryRequest reqBody,
                                                HttpServletRequest request) {
        try{
            String jwt = jwtUtils.getJwtFromRequest(request);
            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            reqBody.setUsername(username);
            Integer result = bikeCategoryService.createBikeCategory(reqBody);
            if(result == 1){
                return responseUtils.getResponseEntity(null, 1, "Create bike category successfully", HttpStatus.OK);
            }else if (result == -2){
                return responseUtils.getResponseEntity(null, -2, "Bike category has been already existed", HttpStatus.OK);
            }
            return responseUtils.getResponseEntity(null, -1, "Failed", HttpStatus.OK);
        }catch(Exception e){
            e.printStackTrace();
            return responseUtils.getResponseEntity(null, -1, "System Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<?> updateBikeCategory(@RequestBody BikeCategoryRequest reqBody,
                                                @PathVariable Long id,
                                                HttpServletRequest request){
        try{
            reqBody.setId(id);
            String jwt = jwtUtils.getJwtFromRequest(request);
            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            reqBody.setUsername(username);
            Integer result = bikeCategoryService.updateBikeCategory(reqBody);
            if(result == 1){
                return responseUtils.getResponseEntity(null, 1, "Edit successfully", HttpStatus.OK);
            }else if (result == -2){
                return responseUtils.getResponseEntity(null, -2, "Can not find bike category id: " +id, HttpStatus.OK);
            }
            return responseUtils.getResponseEntity(null, -1, "Failed", HttpStatus.OK);
        }
        catch(Exception e){
            e.printStackTrace();
            return responseUtils.getResponseEntity(null, -1, "System Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
