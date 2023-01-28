package com.BikeHiringManagement.controller.Authenticate;
import com.BikeHiringManagement.constant.Constant;
import com.BikeHiringManagement.dto.PageDto;
import com.BikeHiringManagement.model.request.*;
import com.BikeHiringManagement.model.temp.Result;
import com.BikeHiringManagement.service.entity.MaintainService;
import com.BikeHiringManagement.service.system.ResponseUtils;
import com.BikeHiringManagement.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/admin/maintain")
public class MaintainController {
    @Autowired
    ResponseUtils responseUtils;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    MaintainService maintainService;

    @PostMapping("/create")
    public ResponseEntity<?> createMaintain(@RequestBody MaintainRequest maintainRequest,
                                             HttpServletRequest request) {
        try{
            String jwt = jwtUtils.getJwtFromRequest(request);
            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            Result result = maintainService.createMaintain(maintainRequest, username);
            if(result.getCode() == Constant.LOGIC_ERROR_CODE){
                return responseUtils.getResponseEntity(null, 0, result.getMessage(), HttpStatus.OK);
            }else if(result.getCode() == Constant.SYSTEM_ERROR_CODE){
                return  responseUtils.getResponseEntity(null, -1, result.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return responseUtils.getResponseEntity(null, result.getCode(), result.getMessage(), HttpStatus.OK);
        }catch(Exception e){
            e.printStackTrace();
            return responseUtils.getResponseEntity(null, Constant.SYSTEM_ERROR_CODE, Constant.SYSTEM_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get/maintainId={maintainId}")
    public ResponseEntity<?> getMaintainLogById(@PathVariable Long maintainId) {
        try {
            Result result = maintainService.getMaintainLogById(maintainId);
            if(result.getCode() == Constant.LOGIC_ERROR_CODE){
                return responseUtils.getResponseEntity(null, 0, result.getMessage(), HttpStatus.OK);
            }else if(result.getCode() == Constant.SYSTEM_ERROR_CODE){
                return  responseUtils.getResponseEntity(null, -1, result.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return  responseUtils.getResponseEntity(result.getObject(), 1, "Get Successfully", HttpStatus.OK);
        }catch(Exception e){
            e.printStackTrace();
            return responseUtils.getResponseEntity(null, Constant.SYSTEM_ERROR_CODE, Constant.SYSTEM_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/update/maintainId={maintainId}")
    public ResponseEntity<?> updateMaintain(@RequestBody MaintainRequest reqBody,
                                        @PathVariable Long maintainId,
                                        HttpServletRequest request){
        try{
            String jwt = jwtUtils.getJwtFromRequest(request);
            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            Result result = maintainService.updateMaintain(reqBody,maintainId, username);
            return responseUtils.getResponseEntity(null, result.getCode(), result.getMessage(), HttpStatus.OK);
        }
        catch(Exception e){
            e.printStackTrace();
            return responseUtils.getResponseEntity(null, Constant.SYSTEM_ERROR_CODE, Constant.SYSTEM_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
