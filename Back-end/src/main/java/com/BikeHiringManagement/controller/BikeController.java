package com.BikeHiringManagement.controller;


import com.BikeHiringManagement.dto.PageDto;
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

    @GetMapping("/get")
    public ResponseEntity<?> getBikeWithSpec(@RequestParam(value = "searchKey",required = false) String searchKey,
                                                     @RequestParam("page") Integer page,
                                                     @RequestParam("limit") Integer limit,
                                                     @RequestParam("sortBy") String sortBy,
                                                     @RequestParam("sortType") String sortType,
                                                     @RequestParam("categoryId") Long categoryId) {
        try {
            PageDto result = bikeService.getBike(searchKey, page, limit, sortBy, sortType, categoryId);
            if (result != null) {
                return responseUtils.getResponseEntity(result, 1, "Get Successfully", HttpStatus.OK);
            }
            return responseUtils.getResponseEntity(null, -1, "Failed", HttpStatus.OK);
        } catch (Exception e) {
            return responseUtils.getResponseEntity(e, -1, "Login fail!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
