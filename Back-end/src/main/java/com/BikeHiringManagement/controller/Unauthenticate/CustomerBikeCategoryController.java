package com.BikeHiringManagement.controller.Unauthenticate;

import com.BikeHiringManagement.dto.PageDto;
import com.BikeHiringManagement.model.request.PaginationRequest;
import com.BikeHiringManagement.service.system.ResponseUtils;
import com.BikeHiringManagement.service.entity.BikeCategoryService;
import com.BikeHiringManagement.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/public/bike-category")
public class CustomerBikeCategoryController {
    @Autowired
    ResponseUtils responseUtils;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    BikeCategoryService bikeCategoryService;

    @PostMapping("/get")
    public ResponseEntity<?> getBikeCategoryPagination(@RequestBody PaginationRequest reqBody){
        try{
            PageDto result = bikeCategoryService.getBikeCategory(reqBody);
            if (result != null) {
                return responseUtils.getResponseEntity(result, 1, "Get Successfully", HttpStatus.OK);
            }
            return responseUtils.getResponseEntity(null, -1, "Failed", HttpStatus.OK);
        }
        catch(Exception e){
            return responseUtils.getResponseEntity(e, -1, "Login fail!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
