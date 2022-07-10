package com.BikeHiringManagement.service;

import com.BikeHiringManagement.entity.Role;
import com.BikeHiringManagement.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Date;

import static com.BikeHiringManagement.constant.constant.SYSTEM_ERROR;
import static com.BikeHiringManagement.constant.constant.SYSTEM_ERROR_CODE;

@Service
public class RoleService {

    @Autowired
    RoleRepository roleRepository;

    public Integer createRole(String name){
        try{
            if(roleRepository.existsByName(name)){
                return -2;
            }else{
                Role newRole = new Role();
                newRole.setName(name);
                newRole.setCreatedUser("Tai Phuc");
                newRole.setCreatedDate(new Date());
                roleRepository.save(newRole);
                return 1;
            }
        }catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
    }
}
