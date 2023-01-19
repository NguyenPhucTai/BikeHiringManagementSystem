package com.BikeHiringManagement.constant;

public class Constant {
    public static final String SYSTEM_ERROR = "SYSTEM ERROR!!!";

    //Error code
    public static final Integer SYSTEM_ERROR_CODE = -1;
    public static final Integer SUCCESS_CODE = 1;
    public static final Integer LOGIC_ERROR_CODE = 0;


    // Permission flag for every page
    public static final String USER_PAGE = "";
    public static final String CLIENT_CONTEXTPATH = "http://localhost:3000";

    // Repository name
    public static final Integer BIKE_CATEGORY = 1;
    public static final Integer BIKE_COLOR = 2;
    public static final Integer BIKE_IMAGE = 3;
    public static final Integer BIKE_MANUFACTURER = 4;
    public static final Integer BIKE = 5;
    public static final Integer ORDER = 6;
    public static final Integer MAINTAIN = 7;

    // History log
    // Action name
    public static final String HISTORY_LOGIN = "LOGIN";
    public static final String HISTORY_CREATE = "CREATE";
    public static final String HISTORY_UPDATE = "UPDATE";
    public static final String HISTORY_DELETE = "DELETE";

    // Formula
    public static final Long FORMULA_BIKE_HIRING_CALCULATION = (long) 1;

    // TIME
    public static final double MILLI_TO_HOUR = 1000 * 60 * 60;

}