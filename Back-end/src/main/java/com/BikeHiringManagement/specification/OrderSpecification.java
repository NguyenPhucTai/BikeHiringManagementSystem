package com.BikeHiringManagement.specification;


import com.BikeHiringManagement.entity.Order;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderSpecification {

    @PersistenceContext
    EntityManager entityManager;

    public Specification<Order> filterOrder(String searchKey){
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (!StringUtils.isEmpty(searchKey)) {
                try {
                    Long parseLong = Long.parseLong(searchKey);
                    predicates.add(cb.or(
                            cb.equal(root.get("id"), parseLong),
                            cb.like(root.get("status"), "%" + searchKey + "%")
                    ));
                } catch (Exception e) {
                    predicates.add(cb.or(
                            cb.like(root.get("status"), "%" + searchKey + "%")
                    ));
                }
            }
            predicates.add(cb.notLike(root.get("status"), "IN CART"));
            predicates.add(cb.isFalse(root.get("isDeleted")));
            return cb.and(predicates.stream().toArray(Predicate[]::new));
        };
    }
}
