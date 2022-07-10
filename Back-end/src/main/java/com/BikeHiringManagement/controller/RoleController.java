package com.BikeHiringManagement.controller;


import com.BikeHiringManagement.model.request.LoginRequest;
import com.BikeHiringManagement.repository.RoleRepository;
import com.BikeHiringManagement.service.ResponseUtils;
import com.BikeHiringManagement.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.BikeHiringManagement.constant.constant.SYSTEM_ERROR;
import static com.BikeHiringManagement.constant.constant.SYSTEM_ERROR_CODE;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/role")
public class RoleController {

    @Autowired
    ResponseUtils responseUtils;

    @Autowired
    RoleService roleService;

    @PostMapping("/create")
    public ResponseEntity<?> createRole(@RequestParam String name) {
        try{
            Integer result = roleService.createRole(name);
            if(result == 1){
                return responseUtils.getResponseEntity(null, 1, "Create role successfully", HttpStatus.OK);
            }else if (result == -2){
                return responseUtils.getResponseEntity(null, -2, "Role has been already existed", HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return responseUtils.getResponseEntity(null, -1, "System Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }catch(Exception e){
            e.printStackTrace();
            return responseUtils.getResponseEntity(null, -1, "System Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
