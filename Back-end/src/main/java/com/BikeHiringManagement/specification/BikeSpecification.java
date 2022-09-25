package com.BikeHiringManagement.specification;

import com.BikeHiringManagement.constant.Constant;
import com.BikeHiringManagement.entity.*;
import com.BikeHiringManagement.model.Result;
import com.BikeHiringManagement.model.response.BikeResponse;
import com.BikeHiringManagement.repository.BikeCategoryRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BikeSpecification {

    @PersistenceContext
    EntityManager entityManager;

    @Autowired
    BikeCategoryRepository bikeCategoryRepository;

    public Specification<Bike> filterBike(String searchKey){
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (!StringUtils.isEmpty(searchKey)) {
                try {
                    Double parseDouble = Double.parseDouble(searchKey);
                    predicates.add(cb.or(cb.like(root.get("createdUser"), "%" + searchKey + "%"),
                            cb.like(root.get("name"), "%" + searchKey + "%"),
                            cb.like(root.get("bike_no"), "%" + searchKey + "%")));
                } catch (Exception e) {
                    predicates.add(cb.or(cb.like(root.get("createdUser"), "%" + searchKey + "%"),
                            cb.like(root.get("name"), "%" + searchKey + "%")));
                }
            }
            return cb.and(predicates.stream().toArray(Predicate[]::new));
        };
    }


    public Map<String, Object> getListBike(String searchKey, Integer page, Integer limit, String sortBy, String sortType, Long categoryId){
        try{
            Map<String, Object> mapFinal = new HashMap<>();

            //----------------------CREATE QUERY -----------------------------//
            CriteriaBuilder cb = entityManager.getCriteriaBuilder();

            // ROOT
            CriteriaQuery<BikeResponse> query = cb.createQuery(BikeResponse.class);
            Root<Bike> root = query.from(Bike.class);
            Root<BikeCategory> rootCate = query.from(BikeCategory.class);
            Root<BikeColor> rootColor = query.from(BikeColor.class);
            Root<BikeManufacturer> rootManufacturer = query.from(BikeManufacturer.class);

            // ROOT COUNT
            CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
            Root<Bike> rootCount = countQuery.from(Bike.class);
            Root<BikeCategory> rootCateCount = countQuery.from(BikeCategory.class);
            Root<BikeColor> rootColorCount = countQuery.from(BikeColor.class);
            Root<BikeManufacturer> rootManufacturerCount = countQuery.from(BikeManufacturer.class);


            //---------------------- CONDITION -----------------------------//

            // CONDITION
            // EXIST BY CATEGORY
            Boolean isCategoryExist = false;
            if(categoryId != null && bikeCategoryRepository.existsById(categoryId)){
                isCategoryExist = true;
            }


            // CONDITION
            // ROOT
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("bikeCategory"), rootCate.get("id")));
            predicates.add(cb.equal(root.get("bikeColor"), rootColor.get("id")));
            predicates.add(cb.equal(root.get("bikeManufacturer"), rootManufacturer.get("id")));

            if(isCategoryExist){
                predicates.add(cb.equal(rootCate.get("id"), categoryId));
            }

            if (!StringUtils.isEmpty(searchKey)) {
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")) , "%" + searchKey.toLowerCase() + "%"),
                        cb.like(cb.lower(root.get("bikeNo")) , "%" + searchKey.toLowerCase() + "%"),
                        cb.like(cb.lower(rootCate.get("name")) , "%" + searchKey.toLowerCase() + "%"),
                        cb.like(cb.lower(rootColor.get("name")) , "%" + searchKey.toLowerCase() + "%"),
                        cb.like(cb.lower(rootManufacturer.get("name")) , "%" + searchKey.toLowerCase() + "%")
                ));
            }

            // CONDITION
            // ROOT COUNT
            List<Predicate> predicatesCount = new ArrayList<>();
            predicatesCount.add(cb.equal(rootCount.get("bikeCategory"), rootCateCount.get("id")));
            predicatesCount.add(cb.equal(rootCount.get("bikeColor"), rootColorCount.get("id")));
            predicatesCount.add(cb.equal(rootCount.get("bikeManufacturer"), rootManufacturerCount.get("id")));

            if(isCategoryExist){
                predicatesCount.add(cb.equal(rootCateCount.get("id"), categoryId));
            }

            if (!StringUtils.isEmpty(searchKey)) {
                predicatesCount.add(cb.or(
                        cb.like(cb.lower(rootCount.get("name")) , "%" + searchKey.toLowerCase() + "%"),
                        cb.like(cb.lower(rootCount.get("bikeNo")) , "%" + searchKey.toLowerCase() + "%"),
                        cb.like(cb.lower(rootCateCount.get("name")) , "%" + searchKey.toLowerCase() + "%"),
                        cb.like(cb.lower(rootColorCount.get("name")) , "%" + searchKey.toLowerCase() + "%"),
                        cb.like(cb.lower(rootManufacturerCount.get("name")) , "%" + searchKey.toLowerCase() + "%")
                ));
            }


            //------------------------CREATE SORT-----------------------------//
            // Sort theo Name - Cate Name - Hired Number - Price
            if (sortType.equalsIgnoreCase("asc")) {
                switch (sortBy) {
                    case "name":
                        query.orderBy(cb.asc(root.get("name")));
                        break;
                    case "hiredNumber":
                        query.orderBy(cb.asc(root.get("hiredNumber")));
                        break;
                    case "bikeColor":
                        query.orderBy(cb.asc(root.get("bikeColor")));
                        break;
                    case "bikeManufacturer":
                        query.orderBy(cb.asc(root.get("bikeManufacturer")));
                        break;
                }
            } else {
                switch (sortBy) {
                    case "id":
                        query.orderBy(cb.desc(root.get("id")));
                        break;
                    case "hiredNumber":
                        query.orderBy(cb.desc(root.get("hiredNumber")));
                        break;
                    case "bikeColor":
                        query.orderBy(cb.asc(root.get("bikeColor")));
                        break;
                    case "bikeManufacturer":
                        query.orderBy(cb.asc(root.get("bikeManufacturer")));
                        break;
                }
            }

            //----------------------END SORT-----------------------------//
            query.multiselect(
                    root.get("id"),
                    root.get("name"),
                    root.get("bikeManualId"),
                    root.get("bikeNo"),
                    root.get("hiredNumber"),
                    rootCate.get("id"),
                    rootCate.get("name"),
                    rootCate.get("price"),
                    rootColor.get("id"),
                    rootColor.get("name"),
                    rootManufacturer.get("id"),
                    rootManufacturer.get("name")
            ).where(cb.and(predicates.stream().toArray(Predicate[]::new)));
            List<BikeResponse> listResult = entityManager.createQuery(query) != null ? entityManager.createQuery(query).
                    setFirstResult((page - 1) * limit)
                    .setMaxResults(limit).getResultList() : new ArrayList<>();

            countQuery.select(cb.count(rootCount)).where(cb.and(predicatesCount.stream().toArray(Predicate[]::new)));
            Long count = entityManager.createQuery(countQuery).getSingleResult();
            mapFinal.put("data", listResult);
            mapFinal.put("count", count);
            return mapFinal;
        } catch (Exception e) {
            e.printStackTrace();
            return new HashMap<>();
        }
    }

}
