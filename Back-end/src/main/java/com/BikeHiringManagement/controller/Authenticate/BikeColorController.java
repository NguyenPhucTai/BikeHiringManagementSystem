package com.BikeHiringManagement.controller.Authenticate;
import com.BikeHiringManagement.constant.Constant;
import com.BikeHiringManagement.dto.PageDto;
import com.BikeHiringManagement.entity.BikeColor;
import com.BikeHiringManagement.model.Result;
import com.BikeHiringManagement.model.request.BikeColorRequest;
import com.BikeHiringManagement.model.request.BikeManafacturerRequest;
import com.BikeHiringManagement.model.request.PaginationRequest;
import com.BikeHiringManagement.model.request.ObjectNameRequest;
import com.BikeHiringManagement.service.ResponseUtils;
import com.BikeHiringManagement.service.entity.BikeColorService;
import com.BikeHiringManagement.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/admin/bike-color")
public class BikeColorController {
    @Autowired
    ResponseUtils responseUtils;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    BikeColorService bikeColorService;

    @PostMapping("/create")
    public ResponseEntity<?> createBikeColor(@RequestBody ObjectNameRequest reqBody,
                                             HttpServletRequest request) {
        try{
            String jwt = jwtUtils.getJwtFromRequest(request);
            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            reqBody.setUsername(username);
            Result result = bikeColorService.createBikeColor(reqBody);
            return responseUtils.getResponseEntity(null, result.getCode(), result.getMessage(), HttpStatus.OK);
        }catch(Exception e){
            e.printStackTrace();
            return responseUtils.getResponseEntity(null, -1, "System Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/get")
    public ResponseEntity<?> getBikeColorWithSpec(@RequestBody PaginationRequest reqBody){
        try{
            PageDto result = bikeColorService.getBikeColor(reqBody);
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
    public ResponseEntity<?> getBikeColorWithId(@RequestParam Long bikeColorId) {
        try {
            Result result = bikeColorService.getBikeColorById(bikeColorId);
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

    @PostMapping("/update/{id}")
    public ResponseEntity<?> updateBikeColorCategory(@RequestBody BikeColorRequest reqBody,
                                                     @PathVariable Long id,
                                                     HttpServletRequest request){
        try{
            reqBody.setId(id);
            String jwt = jwtUtils.getJwtFromRequest(request);
            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            reqBody.setUsername(username);
            Result result = bikeColorService.updateBikeColor(reqBody);
            return responseUtils.getResponseEntity(null, result.getCode(), result.getMessage(), HttpStatus.OK);
        }
        catch(Exception e){
            e.printStackTrace();
            return responseUtils.getResponseEntity(null, -1, "System Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<?> deleteBikeColor(@PathVariable Long id, HttpServletRequest request){
        try{
            String jwt = jwtUtils.getJwtFromRequest(request);
            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            Result result = bikeColorService.deleteBikeColor(id, username);
            return responseUtils.getResponseEntity(null, result.getCode(), result.getMessage(), HttpStatus.OK);
        }
        catch(Exception e){
            e.printStackTrace();
            return responseUtils.getResponseEntity(null, -1, "System Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    /*
    @GetMapping("/get")
    public ResponseEntity<?> getBikeColorWithSpec(@RequestParam(value = "searchKey",required = false) String searchKey,
                                                     @RequestParam("page") Integer page,
                                                     @RequestParam("limit") Integer limit,
                                                     @RequestParam("sortBy") String sortBy,
                                                     @RequestParam("sortType") String sortType) {
        try {
            PageDto result = bikeColorService.getBikeColor(searchKey, page, limit, sortBy, sortType);
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
