﻿var resetd = false;
var resetg = false;

var cntt = 0;

var _pstatus = "";
var _amount = 0;
var _balance = 0;
var _feeid = 0;
var _payref = "";


function getRealDate(dateval) {
    var dd = dateval.slice(0, 10);
    var orderdate = new Date(dd);
    return orderdate.toString('dd MMM yy');
}

function getBgCol(Paid, Amount, Balance) {
    var ddval = "";

    if (Paid == true) {
        ddval = "paidinvoice";
    }

    else {
        if (Balance < Amount) {
            ddval = "partpay";
        }

        else {
            ddval = "unpaid";
        }

    }
    return ddval;
}

function truncateString(ostr, numm) {

    var num = numm;
    var str = "";
    str = ostr;

    if (num < str.length) {
        str = str.slice(0, num);
        return str + "...";
    }
    else {
        return str;
    }

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

function humanise(getTimeThresh) {
    // The string we're working with to create the representation
    var str = '';
    // Map lengths of `diff` to different time periods
    var values = [[' year', 365], [' month', 30], [' week', 7], [' day', 1]];

    // Iterate over the values...
    for (var i = 0; i < values.length; i++) {
        var amount = Math.floor(getTimeThresh / values[i][1]);

        // ... and find the largest time value that fits into the diff
        if (amount >= 1) {
            // If we match, add to the string ('s' is for pluralization)
            str += amount + values[i][0] + (amount > 1 ? 's' : '') + ' ';

            // and subtract from the diff
            getTimeThresh -= amount * values[i][1];
        }
    }

    return str;
}


function getRId() {
    cntt++;
    var txt = "example" + cntt;
    return txt;
}


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getData(aa, ab, ac, ad, ae, af, ag, ah, clearStatus, bStat) {
    var modal = $('<div>').dialog({ modal: true });
    modal.dialog('widget').hide();

    if (clearStatus == true) { $('.trendingItems').empty(); }

    $.ajax({
        type: "GET",
        url: "/api/BackEnd/GetDataItem_Invoices",
        contentType: "application/json; charset=utf-8",
        data: { offset: aa, typ: ab, param: ac, param2: ad, dateFrom: ae, dateTo: af, dateSingle: ag, InvoiceType: ah },
        dataType: "json",
        success: function (result) {
            modal.dialog('close');

            if (result.iInvoices.Length < 1) {
                $(".mainDataBody").hide();
                $(".auxDataBody").show();
            }

            else {
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
                $('#data-item-template').tmpl(result.iInvoices).appendTo('.trendingItems');

                //$('#subTotalAmount').html(addCommas(result.subTotalAmount));
                //$('#subTotalBalance').html(addCommas(result.subTotalBalance));
                $('#subTotalAmount').html(addCommas("0"));
                $('#subTotalBalance').html(addCommas("0"));
                $('#sumTotalAmount').html(addCommas(result.sumTotalAmount));
                $('#sumTotalBalance').html(addCommas(result.sumTotalBalance));

                $('.page-link[ogNum="' + result.demandNo + '"]').addClass('pglActiv');

                $(".mainDataBody").show();
                $(".auxDataBody").hide();
            }            
        },
        complete: function () {
        },
        error: function (jqXHR, textStatus, errorThrown) {
            modal.dialog('close');
            $(".mainDataBody").hide();
            $(".auxDataBody").show();
        }
    });
}

$(function () {

    var vr = "";
    var dCount = 1;
    var dataString;

    var joinQ = ""; var rVali = "active", rValii = 10, rValiii = "";

    getData(dCount, rVali, rValii, rValiii, $("#dateFrom").val(), $("#dateTo").val(), $("#dateSingle").val(), "");

    var availableTags = [];
    var val2 = "";

    $(document).on("click", "td .makeFeePayment", function (e) {
        _pstatus = $(this).attr('pstatus');
        _amount = $(this).attr('amount');
        _balance = $(this).attr('balance');
        _feeid = $(this).attr('feeid');
        _payref = $(this).attr('payref');

        $("#remBalance").html("<b>₦" + numberWithCommas(_balance) + "</b>");
        $("#feeValue").val(_balance);

        if (_balance > 0)
            {
            $("#payBtn").removeAttr("disabled");
            }

            else
            {
                $("#payBtn").attr("disabled", "disabled");
                $("#feeValue").attr("disabled", "disabled");
            }
    });

    $("#ubdAjaxH").submit(function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();

        rVali = "FormData";

        dCount = 1;

        getData(dCount, rVali, rValii, rValiii, $("#dateFrom").val(), $("#dateTo").val(), $("#dateSingle").val(), "");

    });

    $(document).on("click", ".refreshLnk", function (e) {
        e.preventDefault();
        getData(dCount, rVali, rValii, rValiii, $("#dateFrom").val(), $("#dateTo").val(), $("#dateSingle").val(), "");
    });

    $(document).on("click", "li .pgLink", function (e) {
        e.preventDefault();
        dCount = $(this).html();

        getData(dCount, rVali, rValii, rValiii, $("#dateFrom").val(), $("#dateTo").val(), $("#dateSingle").val(), "", $(this).attr("id"));

    });

    $("#changePageNum").change(function (e) {
        rValii = $(this).val();

        dCount = 1;

        getData(dCount, rVali, rValii, rValiii, $("#dateFrom").val(), $("#dateTo").val(), $("#dateSingle").val(), "");
    });

    $("#sAny").keyup(function (e) {
        if (e.which == 13) {
            rVali = "keyword";
            rValiii = $(this).val();

            dCount = 1;

            getData(dCount, rVali, rValii, rValiii, $("#dateFrom").val(), $("#dateTo").val(), $("#dateSingle").val(), "");
        }
    });

    $("#payBtn").click(function (event) {
        event.preventDefault();
        var modal = $('<div>').dialog({ modal: true });
        modal.dialog('widget').hide();

        event.preventDefault();
        event.stopImmediatePropagation();

        var AddPayment = new Object();
        AddPayment.Amount = $("#feeValue").val();
        AddPayment.PaymentReference = _payref;
        AddPayment.FeeId = _feeid;

        $.ajax({
            type: "POST",
            url: "/api/SpecialOps/addPayment",
            data: AddPayment,
            dataType: "json",
            success: function (result) {
                modal.dialog('close');
                onAjaxRequestSuccess(result);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.ErrorMsg + " " + textStatus + " " + errorThrown);
            }
        });

        var onAjaxRequestSuccess = function (result) {
            if (result.EnableError) {
                alert(result.ErrorMsg);
            } else if (result.EnableSuccess) {
                $("#payFee").modal('hide');
                getData(1, "active", 10, "", $("#dateFrom").val(), $("#dateTo").val(), $("#dateSingle").val(), "");
            }
        }
    });
});