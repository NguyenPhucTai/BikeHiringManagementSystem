package com.BikeHiringManagement.service;


import org.springframework.stereotype.Service;
import com.udojava.evalex.Expression;

import java.math.BigDecimal;
import java.math.MathContext;
import java.text.NumberFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

@Service
public class TestService {

    public void test() throws ParseException {
        calculateCost();
    }

    public void calculateCost() throws ParseException {
        NumberFormat numberFormater5F = NumberFormat.getInstance();
        numberFormater5F.setGroupingUsed(false);
        numberFormater5F.setMinimumFractionDigits(5);

        String startDateString = "12/31/2022 07:00:00";
        String endDateString = "01/01/2023 08:00:00";
        Double bikeCost = 100000.0;
        Double roundHiredDayDown = 3.0;
        Double coefficientDay = 0.0;
        String formula = "a * (b + c)";
        SimpleDateFormat format = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss");

        Date startDate = format.parse(startDateString);
        Date endDate = format.parse(endDateString);
//        long secs = (endDate.getTime() - startDate.getTime()) / 1000;
//        double diffHour = secs / 3600;



        bikeCost = 75.0;
        roundHiredDayDown = 24.0;

        String formula2 = "IF(a % b)";
        BigDecimal formulaBigDecimal2 = new Expression(formula2, MathContext.DECIMAL128)
                .with("a", numberFormater5F.format(bikeCost))
                .and("b", numberFormater5F.format(roundHiredDayDown))
                .eval();
        double finalCost2 = formulaBigDecimal2.doubleValue();
        System.out.println("Total cost: " + finalCost2);
        System.out.println("Test " + bikeCost % roundHiredDayDown);
    }
}
