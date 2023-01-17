package com.BikeHiringManagement.repository;

import com.BikeHiringManagement.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CustomerRepository extends JpaRepository<Customer, Long>, JpaSpecificationExecutor<Customer> {
    Customer findCustomerByIdAndIsDeleted(long customerId, boolean check);

    Customer findCustomerByPhoneNumberAndIsDeleted(String phoneNumber, boolean check);

    boolean existsByIdAndIsDeleted(long id, boolean check);

    boolean existsByPhoneNumberAndIsDeleted(String phoneNumber, boolean check);
}
