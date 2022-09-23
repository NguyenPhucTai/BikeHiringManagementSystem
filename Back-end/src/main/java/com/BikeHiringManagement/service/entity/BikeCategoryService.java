package com.BikeHiringManagement.service.entity;

import com.BikeHiringManagement.constant.Constant;
import com.BikeHiringManagement.dto.PageDto;
import com.BikeHiringManagement.entity.BikeCategory;
import com.BikeHiringManagement.model.Result;
import com.BikeHiringManagement.model.request.BikeCategoryCreateRequest;
import com.BikeHiringManagement.model.request.PaginationRequest;
import com.BikeHiringManagement.repository.BikeCategoryRepository;
import com.BikeHiringManagement.service.ResponseUtils;
import com.BikeHiringManagement.specification.BikeCategorySpecification;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class BikeCategoryService {

    @Autowired
    BikeCategoryRepository bikeCategoryRepository;

    @Autowired
    BikeCategorySpecification bikeCategorySpecification;

    @Autowired
    ResponseUtils responseUtils;

    @Autowired
    ModelMapper modelMapper;


    public Result createBikeCategory(BikeCategoryCreateRequest bikeCategoryRequest){
        try{
            if(bikeCategoryRepository.existsByName(bikeCategoryRequest.getName())){
                return new Result(Constant.LOGIC_ERROR_CODE, "The bike category has been existed!!!");
            }else{
                BikeCategory newBikeCategory = modelMapper.map(bikeCategoryRequest, BikeCategory.class);
                newBikeCategory.setCreatedDate(new Date());
                newBikeCategory.setCreatedUser(bikeCategoryRequest.getUsername());
                bikeCategoryRepository.save(newBikeCategory);
                return new Result(Constant.SUCCESS_CODE, "Create new bike category successfully");
            }

        }catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "Fail");
        }
    }

    public Result updateBikeCategory(BikeCategoryCreateRequest bikeCategoryRequest){
        try{

            if(!bikeCategoryRepository.existsById(bikeCategoryRequest.getId())){
                return new Result(Constant.LOGIC_ERROR_CODE, "The bike category has not been existed!!!");
            }
            else{
                BikeCategory bikeCategory = bikeCategoryRepository.findBikeCategoriesById(bikeCategoryRequest.getId());
                bikeCategory.setModifiedDate(new Date());
                bikeCategory.setModifiedUser(bikeCategoryRequest.getUsername());
                bikeCategory.setPrice(bikeCategoryRequest.getPrice());
                bikeCategoryRepository.save(bikeCategory);
                return new Result(Constant.SUCCESS_CODE, "Update new bike category successfully");
            }

        }catch (Exception e) {
            e.printStackTrace();
            return new Result(Constant.SYSTEM_ERROR_CODE, "Fail");
        }
    }

    public PageDto getBikeCategory(PaginationRequest filterObjectRequest) {
        try {
            Sort sort = responseUtils.getSort(filterObjectRequest.getSortBy(), filterObjectRequest.getSortType());
            Integer pageNum = filterObjectRequest.getPage() - 1;
            Page<BikeCategory> pageResult = bikeCategoryRepository.findAll(bikeCategorySpecification.filterBikeCategory(filterObjectRequest.getSearchKey()), PageRequest.of(pageNum, filterObjectRequest.getLimit(), sort));
            return PageDto.builder()
                    .content(pageResult.getContent())
                    .numberOfElements(pageResult.getNumberOfElements())
                    .page(filterObjectRequest.getPage())
                    .size(pageResult.getSize())
                    .totalPages(pageResult.getTotalPages())
                    .totalElements(pageResult.getTotalElements())
                    .build();
        } catch (Exception e) {
            return null;
        }
    }

    /*
    public PageDto getBikeCategory(String searchKey, Integer page, Integer limit, String sortBy, String sortType) {
        try {
            Sort sort = responseUtils.getSort(sortBy, sortType);
            Integer pageNum = page - 1;
            Page<BikeCategory> pageResult = bikeCategoryRepository.findAll(bikeCategorySpecification.filterBikeCategory(searchKey), PageRequest.of(pageNum, limit, sort));
            return PageDto.builder()
                    .content(pageResult.getContent())
                    .numberOfElements(pageResult.getNumberOfElements())
                    .page(page)
                    .size(pageResult.getSize())
                    .totalPages(pageResult.getTotalPages())
                    .totalElements(pageResult.getTotalElements())
                    .build();
        } catch (Exception e) {
            return null;
        }
    }
     */
}
