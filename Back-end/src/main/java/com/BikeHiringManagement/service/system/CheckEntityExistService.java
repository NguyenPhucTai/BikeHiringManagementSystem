package com.BikeHiringManagement.service.system;


import com.BikeHiringManagement.entity.OrderDetail;
import com.BikeHiringManagement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CheckEntityExistService {
    @Autowired
    BikeCategoryRepository bikeCategoryRepository;
    @Autowired
    BikeColorRepository bikeColorRepository;
    @Autowired
    BikeImageRepository bikeImageRepository;
    @Autowired
    BikeManufacturerRepository bikeManufacturerRepository;
    @Autowired
    BikeRepository bikeRepository;
    @Autowired
    OrderRepository orderRepository;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    UserRepository userRepository;

    private static final int BIKE_CATEGORY = 1;
    private static final int BIKE_COLOR = 2;
    private static final int BIKE_IMAGE = 3;
    private static final int BIKE_MANUFACTURER = 4;
    private static final int BIKE = 5;
    private static final int ORDER = 6;

    public Boolean isEntityExisted(Integer constantNumber, String type, Object value){
        boolean isExisted = false;
        Long id = null;
        String name = null;

        if (type == "id"){
            id = Long.parseLong(value.toString());
        }
        if (type == "name"){
            name = value.toString();
        }

        switch (constantNumber){
            case BIKE_CATEGORY:
                if (type == "id")
                    if(bikeCategoryRepository.existsByIdAndIsDeleted(id,false))
                        isExisted = true;
                if (type == "name")
                    if(bikeCategoryRepository.existsByNameAndIsDeleted(name, false))
                        isExisted = true;
                break;
            case BIKE_COLOR:
                if (type == "id")
                    if(bikeColorRepository.existsByIdAndIsDeleted(id, false))
                        isExisted = true;
                if (type == "name")
                    if(bikeColorRepository.existsByNameAndIsDeleted(name, false))
                        isExisted = true;
                break;
            case BIKE_IMAGE:
                if (type == "id")
                    if(bikeImageRepository.existsByIdAndIsDeleted(id, false))
                        isExisted = true;
                if (type == "name")
                    if(bikeImageRepository.existsByNameAndIsDeleted(name, false))
                        isExisted = true;
                break;
            case BIKE_MANUFACTURER:
                if (type == "id")
                    if(bikeManufacturerRepository.existsByIdAndIsDeleted(id, false))
                        isExisted = true;
                if (type == "name")
                    if(bikeManufacturerRepository.existsByNameAndIsDeleted(name, false))
                        isExisted = true;
                break;
            case BIKE:
                if (type == "id")
                    if(bikeRepository.existsByIdAndIsDeleted(id, false))
                        isExisted = true;
                if (type == "name")
                    if(bikeRepository.existsByNameAndIsDeleted(name, false))
                        isExisted = true;
                break;
            case ORDER:
                if (type == "id")
                    if(orderRepository.existsByIdAndIsDeleted(id, false))
                        isExisted = true;
                break;
        }
        return isExisted;
    }
}
