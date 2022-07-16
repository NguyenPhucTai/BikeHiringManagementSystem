package com.BikeHiringManagement.specification;

import com.BikeHiringManagement.entity.Bike;
import com.BikeHiringManagement.entity.BikeCategory;
import com.BikeHiringManagement.entity.BikeImage;
import com.BikeHiringManagement.model.response.BikeResponse;
import org.apache.commons.lang3.StringUtils;
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


    public Map<String, Object> getListBike(String searchKey, Integer page, Integer limit, String sortBy, String sortType){
        try{
            Map<String, Object> mapFinal = new HashMap<>();
            CriteriaBuilder cb = entityManager.getCriteriaBuilder();
            CriteriaQuery<BikeResponse> query = cb.createQuery(BikeResponse.class);
            Root<Bike> root = query.from(Bike.class);
            Root<BikeCategory> rootCate = query.from(BikeCategory.class);
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("bikeCategory"), rootCate.get("id")));
            if (!StringUtils.isEmpty(searchKey)) {
                predicates.add(cb.or(
                    cb.like(cb.lower(root.get("name")) , "%" + searchKey.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("bikeNo")) , "%" + searchKey.toLowerCase() + "%"),
                    cb.like(cb.lower(rootCate.get("name")) , "%" + searchKey.toLowerCase() + "%")
                ));
            }

            //----------------------SUBQUERY COUNT-----------------------------//
            CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
            Root<Bike> rootCount = countQuery.from(Bike.class);

            Root<BikeCategory> rootCateCount = countQuery.from(BikeCategory.class);
            List<Predicate> predicatesCount = new ArrayList<>();
            predicatesCount.add(cb.equal(rootCount.get("bikeCategory"), rootCateCount.get("id")));

            if (!StringUtils.isEmpty(searchKey)) {
                predicatesCount.add(cb.or(
                        cb.like(cb.lower(rootCount.get("name")) , "%" + searchKey.toLowerCase() + "%"),
                        cb.like(cb.lower(rootCount.get("bikeNo")) , "%" + searchKey.toLowerCase() + "%"),
                        cb.like(cb.lower(rootCateCount.get("name")) , "%" + searchKey.toLowerCase() + "%")
                ));
            }

            //------------------------CREATE SORT-----------------------------//
            if (sortType.equalsIgnoreCase("asc")) {
                switch (sortBy) {
                    case "id":
                        query.orderBy(cb.asc(root.get("id")));
                        break;
                    case "name":
                        query.orderBy(cb.asc(root.get("name")));
                        break;
                    case "bikeNo":
                        query.orderBy(cb.asc(root.get("bikeNo")));
                        break;
                    case "bikeCategory":
                        query.orderBy(cb.asc(root.get("bikeCategory")));
                        break;
                }
            } else {
                switch (sortBy) {
                    case "id":
                        query.orderBy(cb.desc(root.get("id")));
                        break;
                    case "name":
                        query.orderBy(cb.desc(root.get("name")));
                        break;
                    case "bikeNo":
                        query.orderBy(cb.desc(root.get("bikeNo")));
                        break;
                    case "bikeCategory":
                        query.orderBy(cb.desc(root.get("bikeCategory")));
                        break;
                }
            }

            //----------------------END SORT-----------------------------//
            query.multiselect(
                    root.get("id"),
                    root.get("name"),
                    root.get("bikeNo"),
                    root.get("hiredNumber"),
                    rootCate.get("id"),
                    rootCate.get("name"),
                    rootCate.get("price")
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
