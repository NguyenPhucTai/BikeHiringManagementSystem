package com.BikeHiringManagement.repository;

import com.BikeHiringManagement.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface RoleRepository extends JpaRepository<Role, Long>, JpaSpecificationExecutor<Role> {
    Role findByName(String role);
    Role findRoleById(Long id);
    Boolean existsByName(String role);
    List<Role> getRoleByNameIn(List<String> names);
    void deleteByNameIn(List<String> names);

}
