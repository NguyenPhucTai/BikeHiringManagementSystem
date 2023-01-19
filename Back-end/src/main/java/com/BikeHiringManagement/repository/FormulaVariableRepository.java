package com.BikeHiringManagement.repository;

import com.BikeHiringManagement.entity.FormulaVariable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface FormulaVariableRepository extends JpaRepository<FormulaVariable, Long>, JpaSpecificationExecutor<FormulaVariable> {

}
