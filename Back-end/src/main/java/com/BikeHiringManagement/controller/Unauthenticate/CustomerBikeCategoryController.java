package com.BikeHiringManagement.controller.Unauthenticate;

import com.BikeHiringManagement.dto.PageDto;
import com.BikeHiringManagement.model.Result;
import com.BikeHiringManagement.model.request.BikeCategoryCreateRequest;
import com.BikeHiringManagement.model.request.PaginationRequest;
import com.BikeHiringManagement.service.ResponseUtils;
import com.BikeHiringManagement.service.entity.BikeCategoryService;
import com.BikeHiringManagement.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

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
    public ResponseEntity<?> getBikeCategoryWithSpec(@RequestBody PaginationRequest reqBody){
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


    /*
    @GetMapping("/get")
    public ResponseEntity<?> getBikeCategoryWithSpec(@RequestParam(value = "searchKey",required = false) String searchKey,
                                                     @RequestParam("page") Integer page,
                                                     @RequestParam("limit") Integer limit,
                                                     @RequestParam("sortBy") String sortBy,
                                                     @RequestParam("sortType") String sortType) {
        try {
            PageDto result = bikeCategoryService.getBikeCategory(searchKey, page, limit, sortBy, sortType);
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
