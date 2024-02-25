var resetd = false;
var resetg = false;

var cntt = 0;


function getRealDate(dateval) {
    var dd = dateval.slice(0, 10);
    var orderdate = new Date(dd);
    return orderdate.toString('MMM dd yyyy');
}

function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}


function getRId() {
    cntt++;
    var txt = "example" + cntt;
    return txt;
}

function getData(aa, ab, ac, ad, ae, af, ag, ah, clearStatus, bStat) {
    var modal = $('<div>').dialog({ modal: true });
    modal.dialog('widget').hide();

    if (clearStatus == true) { $('.trendingItems').empty(); }

    $.ajax({
        type: "GET",
        url: "/api/ApiUtilities/GetDataItem_Allocations",
        contentType: "application/json; charset=utf-8",
        data: { offset: aa, typ: ab, param: ac, param2: ad, dateFrom: ae, dateTo: af, dateSingle: ag, ZoneType: ah },
        dataType: "json",
        success: function (result) {
            modal.dialog('close');
            $(".pagination").empty();
            $(".pagination").append("<li class='page-item'><a class='page-link' href='#' aria-label='Previous'><span aria-hidden='true'>&laquo;</span><span class='sr-only'>Previous</span></a></li>");
            if (result.tNum < 6) {
                for (var i = 1; i <= result.tNum; i++) {
                    if (i == result.demandNo) {
                        $(".pagination").append("<li class='page-item'><a ogNum='" + i + "' class='page-link pgLink pglActiv' href='#'>" + i + "</a></li>");
                    }
                    else {
                        $(".pagination").append("<li class='page-item'><a ogNum='" + i + "' class='page-link pgLink' href='#'>" + i + "</a></li>");
                    }
                }
            }

            else if (result.tNum >= 6) {

                $(".pagination").append("<li class='page-item'><a ogNum='1' id='dNorm' class='page-link pgLink' href='#'>1</a></li>");

                if (result.demandNo < 3 || (result.demandNo == 3 && resetd == true)) {
                    $(".pagination").append("<li class='page-item'><a ogNum='2' id='dNorm' class='page-link pgLink' href='#'>2</a></li>");
                    $(".pagination").append("<li class='page-item'><a ogNum='3' id='dNorm' class='page-link pgLink' href='#'>3</a></li>");
                    $(".pagination").append("<li class='page-item'><a class='page-link border-0'>..</a></li>");
                    resetd = false;
                }

                else if (result.demandNo > 2 && result.demandNo < (result.tNum - 2)) {
                    if (bStat == "dFirst" || bStat == "dSec" || bStat == "dThird") {
                        var r1 = result.demandNo - 1;
                        var r2 = result.demandNo + 1;
                        $(".pagination").append("<li class='page-item'><a class='page-link border-0'>..</a></li>");
                        $(".pagination").append("<li class='page-item'><a ogNum='" + r1 + "' id='dFirst' class='page-link pgLink' href='#'>" + r1 + "</a></li>");
                        $(".pagination").append("<li class='page-item'><a ogNum='" + result.demandNo + "' id='dSec' class='page-link pgLink' href='#'>" + result.demandNo + "</a></li>");
                        $(".pagination").append("<li class='page-item'><a ogNum='" + r2 + "' id='dThird' class='page-link pgLink' href='#'>" + r2 + "</a></li>");
                        $(".pagination").append("<li class='page-item'><a class='page-link border-0'>..</a></li>");
                    }

                    else {
                        var r1 = result.demandNo + 1;
                        var r2 = result.demandNo + 2;
                        $(".pagination").append("<li class='page-item'><a class='page-link border-0'>..</a></li>");
                        $(".pagination").append("<li class='page-item'><a ogNum='" + result.demandNo + "' id='dFirst' class='page-link pgLink' href='#'>" + result.demandNo + "</a></li>");
                        $(".pagination").append("<li class='page-item'><a ogNum='" + r1 + "' id='dSec' class='page-link pgLink' href='#'>" + r1 + "</a></li>");
                        $(".pagination").append("<li class='page-item'><a ogNum='" + r2 + "' id='dThird' class='page-link pgLink' href='#'>" + r2 + "</a></li>");
                        $(".pagination").append("<li class='page-item'><a class='page-link border-0'>..</a></li>");
                    }

                    resetd = true;
                }

                else if (result.demandNo > (result.tNum - 3)) {
                    var tt = result.tNum - 2;
                    var tta = result.tNum - 1;

                    if (((result.demandNo == result.tNum || result.demandNo == tt) && resetg == false) || result.demandNo == tta) {
                        resetg = true;
                        $(".pagination").append("<li class='page-item'><a class='page-link border-0'>..</a></li>");
                        $(".pagination").append("<li class='page-item'><a ogNum='" + (result.tNum - 2) + "' id='dNorm' class='page-link pgLink' href='#'>" + (result.tNum - 2) + "</a></li>");
                        $(".pagination").append("<li class='page-item'><a ogNum='" + (result.tNum - 1) + "' id='dNorm' class='page-link pgLink' href='#'>" + (result.tNum - 1) + "</a></li>");
                    }

                    else if (result.demandNo == tt && resetg == true) {
                        resetg = false;
                        var r1 = result.demandNo - 1;
                        var r2 = result.demandNo - 2;
                        $(".pagination").append("<li class='page-item'><a class='page-link border-0'>..</a></li>");
                        $(".pagination").append("<li class='page-item'><a ogNum='" + r2 + "' id='dFirst' class='page-link pgLink' href='#'>" + r2 + "</a></li>");
                        $(".pagination").append("<li class='page-item'><a ogNum='" + r1 + "' id='dSec' class='page-link pgLink' href='#'>" + r1 + "</a></li>");
                        $(".pagination").append("<li class='page-item'><a ogNum='" + result.demandNo + "' id='dThird' class='page-link pgLink' href='#'>" + result.demandNo + "</a></li>");
                        $(".pagination").append("<li class='page-item'><a class='page-link border-0'>..</a></li>");
                    }
                }



                $(".pagination").append("<li class='page-item'><a ogNum='" + result.tNum + "' class='page-link pgLink' href='#'>" + result.tNum + "</a></li>");
            }

            $(".pagination").append("<li class='page-item'><a class='page-link' href='#' id='pgLinkLast' aria-label='Next'><span aria-hidden='true'>&raquo;</span><span class='sr-only'>Next</span></a></li>");

            $('.trendingItems').empty();
            $('#data-item-template').tmpl(result.iZones).appendTo('.trendingItems');
            $('.page-link[ogNum="' + result.demandNo + '"]').addClass('pglActiv');

            console.log(result.iZones[0].Title);
        },
        complete: function () {
        },
        failure: function (response) {
            console.log(response.responseText);
        }
    });
}
