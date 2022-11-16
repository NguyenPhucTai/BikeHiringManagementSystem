package com.BikeHiringManagement.controller.Unauthenticate;


import com.BikeHiringManagement.constant.Constant;
import com.BikeHiringManagement.dto.PageDto;
import com.BikeHiringManagement.model.Result;
import com.BikeHiringManagement.model.request.BikeCreateRequest;
import com.BikeHiringManagement.model.request.PaginationBikeRequest;
import com.BikeHiringManagement.model.response.BikeResponse;
import com.BikeHiringManagement.service.ResponseUtils;
import com.BikeHiringManagement.service.entity.BikeService;
import com.BikeHiringManagement.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/public/bike")
public class CustomerBikeController {

    @Autowired
    BikeService bikeService;

    @Autowired
    ResponseUtils responseUtils;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/get")
    public ResponseEntity<?> getBikeWithSpec(@RequestBody PaginationBikeRequest reqBody){
        try{
            PageDto result = bikeService.getBikePagination(reqBody);
            if (result != null) {
                return responseUtils.getResponseEntity(result, 1, "Get Successfully", HttpStatus.OK);
            }
            return responseUtils.getResponseEntity(null, -1, "Failed", HttpStatus.OK);
        }
        catch(Exception e){
            return responseUtils.getResponseEntity(e, -1, "Login fail!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/get")
    public ResponseEntity<?> getBikeWithId(@RequestParam Long bikeId){
        try{
            Result result = bikeService.getBikeById(bikeId);
            if(result.getCode() == Constant.LOGIC_ERROR_CODE){
                return responseUtils.getResponseEntity(null, 1, result.getMessage(), HttpStatus.OK);
            }else if(result.getCode() == Constant.SYSTEM_ERROR_CODE){
                return  responseUtils.getResponseEntity(null, -1, result.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return  responseUtils.getResponseEntity((BikeResponse) result.getObject(), 1, "Get Successfully", HttpStatus.OK);
        }catch(Exception e){
            return responseUtils.getResponseEntity(e, -1, "Login fail!", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    /*
    @GetMapping("/get")
    public ResponseEntity<?> getBikeWithSpec(@RequestParam(value = "searchKey",required = false) String searchKey,
                                                     @RequestParam("page") Integer page,
                                                     @RequestParam("limit") Integer limit,
                                                     @RequestParam("sortBy") String sortBy,
                                                     @RequestParam("sortType") String sortType,
                                                     @RequestParam(value = "categoryId",required = false) Long categoryId) {
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

     */
}
