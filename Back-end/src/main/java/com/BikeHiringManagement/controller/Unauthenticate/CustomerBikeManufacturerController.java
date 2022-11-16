package com.BikeHiringManagement.controller.Unauthenticate;

import com.BikeHiringManagement.dto.PageDto;
import com.BikeHiringManagement.model.Result;
import com.BikeHiringManagement.model.request.ObjectNameRequest;
import com.BikeHiringManagement.model.request.PaginationRequest;
import com.BikeHiringManagement.service.ResponseUtils;
import com.BikeHiringManagement.service.entity.BikeManufacturerService;
import com.BikeHiringManagement.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/public/bike-manufacturer")
public class CustomerBikeManufacturerController {
    @Autowired
    ResponseUtils responseUtils;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    BikeManufacturerService bikeManufacturerService;

    @PostMapping("/get")
    public ResponseEntity<?> getBikeManufacturerWithSpec(@RequestBody PaginationRequest reqBody){
        try{
            PageDto result = bikeManufacturerService.getBikeManufacturer(reqBody);
            if (result != null) {
                return responseUtils.getResponseEntity(result, 1, "Get Successfully", HttpStatus.OK);
            }
            return responseUtils.getResponseEntity(null, -1, "Failed", HttpStatus.OK);
        }
        catch(Exception e){
            return responseUtils.getResponseEntity(e, -1, "Login fail!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /*
    @GetMapping("/get")
    public ResponseEntity<?> getBikeManufacturerWithSpec(@RequestParam(value = "searchKey",required = false) String searchKey,
                                                     @RequestParam("page") Integer page,
                                                     @RequestParam("limit") Integer limit,
                                                     @RequestParam("sortBy") String sortBy,
                                                     @RequestParam("sortType") String sortType) {
        try {
            PageDto result = bikeManufacturerService.getBikeManufacturer(searchKey, page, limit, sortBy, sortType);
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

