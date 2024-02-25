var resetd = false;
var resetg = false;

var cntt = 0;


function getRealDate(dateval) {
    var dd = dateval.slice(0, 10);
    var orderdate = new Date(dd);
    return orderdate.toString('MMM dd yyyy');
}

function getRealDate2(dateval) {
    var dd = dateval.slice(0, 10);
    var orderdate = new Date(dd);
    return orderdate.toString('yyyy-MM-dd');
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


function getRId() {
    cntt++;
    var txt = "example" + cntt;
    return txt;
}

$(document).on("click", "#editRecord", function () {

    var zon = $(this);

    $("#ubdAjaxH #zFirstName").val(zon.attr('firstname'));
    $("#ubdAjaxH #zLastName").val(zon.attr('lastname'));
    $("#ubdAjaxH #zId").val(zon.attr('cid'));
    $("#ubdAjaxH #zEmail").val(zon.attr('email'));
    $("#ubdAjaxH #zPhone").val(zon.attr('phone'));
    $("#ubdAjaxH #zOccupation").val(zon.attr('occupation'));
    $("#ubdAjaxH #zDOB").val(getRealDate2(zon.attr('dob')));
    $("#ubdAjaxH #zPerm_Home_Address").val(zon.attr('permhomeaddress'));
    $("#ubdAjaxH #zNOK").val(zon.attr('nok'));
    $("#ubdAjaxH #zNOK_Phone").val(zon.attr('nokphone'));
    $("#ubdAjaxH #zState_Of_Origin").val(zon.attr('stateoforigin'));

});

function getData(aa, ab, ac, ad, ae, af, ag, ah, clearStatus, bStat) {
    var modal = $('<div>').dialog({ modal: true });
    modal.dialog('widget').hide();

    if (clearStatus == true) { $('.trendingItems').empty(); }

    $.ajax({
        type: "GET",
        url: "/api/Middle/GetDataItem_Clients",
        contentType: "application/json; charset=utf-8",
        data: { offset: aa, typ: ab, param: ac, param2: ad, dateFrom: ae, dateTo: af, dateSingle: ag, ZoneType: ah },
        dataType: "json",
        success: function (result) {
            modal.dialog('close');
            if (result.iClients.Length < 1) {
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
                $('#data-item-template').tmpl(result.iClients).appendTo('.trendingItems');
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

    $(document).on('change', '.pathExcel', function (e) {
        //show spinner, disable page
        var modal = $('<div>').dialog({ modal: true });
        modal.dialog('widget').hide();
        $('#ajax_loader').show();

        var formData = new FormData();
        var totalFiles = $(this)[0].files.length;
        for (var i = 0; i < totalFiles; i++) {
            var file = $(this)[0].files[i]; formData.append("FileUpload", file);
        }

        $.ajax({
            type: "POST",
            url: '/Manager/uploadExcel_Clients',
            data: formData,
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.EnableError) {
                    $("#insertErrorBEU").html(response.ErrorMsg);
                } else if (response.EnableSuccess) {
                    $("#uploadExcelModal").modal('hide');
                    getData(1, "active", 10, "", $("#dateFrom").val(), $("#dateTo").val(), $("#dateSingle").val(), "");
                }

                modal.dialog('close');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                modal.dialog('close');
                console.log(jqXHR.ErrorMsg + " " + textStatus + " " + errorThrown);
            }
        });

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

    $("#addClient").click(function (event) {
        event.preventDefault();
        var modal = $('<div>').dialog({ modal: true });
        modal.dialog('widget').hide();

        event.preventDefault();
        event.stopImmediatePropagation();

        var client = new Object();
        client.FirstName = $('#FirstName').val();
        client.LastName = $('#LastName').val();
        client.Email = $('#Email').val();
        client.Phone = $('#Phone').val();
        client.Occupation = $('#Occupation').val();
        client.DOB = $('#DOB').val();
        client.NOK = $('#NOK').val();
        client.NOK_Phone = $('#NOK_Phone').val();
        client.Perm_Home_Address = $('#Perm_Home_Address').val();
        client.State_Of_Origin = $('#State_Of_Origin').val();

        $.ajax({
            type: "POST",
            url: "/api/Middle/addClient",
            data: client,
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
                $('#ubdAjaxJ').get(0).reset();
                $("#exampleModalLong").modal('hide');
                getData(1, "active", 10, "", $("#dateFrom").val(), $("#dateTo").val(), $("#dateSingle").val(), "");
                mySnack();
            }
        }
    });

    $("#modifyClient").click(function (event) {
        event.preventDefault();
        var modal = $('<div>').dialog({ modal: true });
        modal.dialog('widget').hide();

        event.preventDefault();
        event.stopImmediatePropagation();
        var action = $("#ubdAjaxJ").attr("action");

        var client = new Object();
        client.FirstName = $('#zFirstName').val();
        client.LastName = $('#zLastName').val();
        client.Email = $('#zEmail').val();
        client.Id = $('#zId').val();
        client.Phone = $('#zPhone').val();
        client.Occupation = $('#zOccupation').val();
        client.DOB = $('#zDOB').val();
        client.Perm_Home_Address = $('#zPerm_Home_Address').val();
        client.NOK = $('#zNOK').val();
        client.NOK_Phone = $('#zNOK_Phone').val();
        client.State_Of_Origin = $('#zState_Of_Origin').val();


        $.ajax({
            type: "POST",
            url: "/api/ApiUtilities/modifyClient",
            data: client,
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
                $("#modifyClientModal").modal('hide');
                getData(1, "active", 10, "", $("#dateFrom").val(), $("#dateTo").val(), $("#dateSingle").val(), "");
            }
        }
    });
});