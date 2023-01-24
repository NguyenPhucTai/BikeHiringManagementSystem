export function GetFormattedDatetTime(stringDate) {
    var date = new Date(stringDate);
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;


    var seconds = date.getSeconds();

    var minutes = date.getMinutes();

    var hour = date.getHours();


    return date.toLocaleString("vi-VN");

    // return day + '/' + month + '/' + year + " " + hour + ":" + minutes + ":" + seconds;
}
