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
import java.util.Date;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/order")
public class OrderController {
   //@PostMapping("/create")
    //public ResponseEntity<?> createOrder(@RequestBody ){
    //}
}
