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


function getCookieValue(a) {
    var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
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

function evaluateFreqDay(daysCount) {
    var toffset = "";
    var tcount = 0;
    var tnum = daysCount % 365;
    tcount = daysCount / 365;
    toffset = "year";

    if (tnum > 0) {
        tnum = daysCount % 28;
        tcount = daysCount / 28;
        toffset = "month";

        if (tnum > 0) {
            tnum = daysCount % 7;
            tcount = daysCount / 7;
            toffset = "week";

            if (tnum > 0) {
                tnum = daysCount;
                tcount = daysCount;
                toffset = "day";
            }
        }

    }

    return toffset;

}

function evaluateFreqCount(daysCount) {
    var toffset = "";
    var tcount = 0;
    var tnum = daysCount % 365;
    tcount = daysCount / 365;
    toffset = "year";

    if (tnum > 0) {
        tnum = daysCount % 28;
        tcount = daysCount / 28;
        toffset = "month";

        if (tnum > 0) {
            tnum = daysCount % 7;
            tcount = daysCount / 7;
            toffset = "week";

            if (tnum > 0) {
                tnum = daysCount;
                tcount = daysCount;
                toffset = "day";
            }
        }

    }

    return tcount;

}

function getRealDate3(dateval) {
    if (dateval != null) {
        var dd = dateval.slice(0, 10);
        var orderdate = new Date(dd);
        return orderdate.toString('MMM dd, yy');
    }

    else {
        return "Not Available";
    }
}

function getRecords(zidd) {
    var modal = $('<div>').dialog({ modal: true });
    modal.dialog('widget').hide();

    var cdata = { eid: zidd, scope: "Zone" };

    $.ajax({
        type: "GET",
        url: "/api/Middle/getParentScopeData",
        data: cdata,
        dataType: "json",
        success: function (result) {

            $("#FeeList").html('');
            $("#ReminderList").html('');
            $("#reminder_fee").find('option').remove().end();
            $("#xreminder_fee").find('option').remove().end();                
            
            if (result.iFees.length > 0) {
                $("#reminder_fee").empty();
                $("#xreminder_fee").empty();
                    //$("#renew_fee").append("<option id='0' selected>Select item...</option>");
                    result.iFees.forEach(function (item) {
                        //if (result.ut.RenewEvery > 0) {
                        //$("#renew_fee").append("<option title='" + item.Id + "' value='" + item.Id + "'>" + item.Title + "</option>");
                        //$("#renew_fee").val(result.ut.RenewFeeId);
                        //}
                        $("#FeeList").append("<tr><td>" + truncateString(item.Title, 12) + "</td><td>" + item.FeeType + "</td><td>" + item.Frequency + "</td><td>" + humanise(item.CollectedEvery) + "</td><td>" + addCommas(item.OriginalAmount) + "</td><td>" + item.Scope + "</td><td>" + getRealDate(item.NextDueDate) + "</td><td><a class='noColor editFee' href='#' data-toggle='modal' data-target='#newModifyFees' CollectedEvery='" + item.CollectedEvery + "' Description='" + item.Description + "' xId='" + item.Id + "' ElementId='" + item.ElementId + "' Scope='" + item.Scope + "' Title='" + item.Title + "' FeeAmount='" + item.FeeAmount + "' FeeType='" + item.FeeType + "' Frequency='" + item.Frequency + "' NextDueDate='" + getRealDate2(item.NextDueDate) + "' PercentagePenalty='" + item.PercentagePenalty + "' PenaltyEvery='" + item.PenaltyEvery + "' OriginalAmount='" + item.OriginalAmount + "' PenalizeOriginal='" + item.PenalizeOriginal + "'><i class='fas fa-pencil-alt'></i></a></td></tr>");
                        $("#reminder_fee").append("<option value='" + item.Id + "'>" + item.Title + "</option>");
                        $("#xreminder_fee").append("<option value='" + item.Id + "'>" + item.Title + "</option>");
                    });
                }


            if (result.iReminders.length > 0) {
                result.iReminders.forEach(function (itm) {
                    $("#ReminderList").append("<tr><td>" + itm.Title + "</td><td>" + itm.SMS + "</td><td>" + itm.EMAIL + "</td><td>" + humanise(itm.SendEvery) + "</td><td>" + getRealDate(itm.NextDueDate) + "</td><td><a class='noColor editReminder' href='#'data-toggle='modal' data-target='#newModifyReminder' xrId = '" + itm.Id + "' Autoremind='" + itm.Autoremind + "' EMAIL='" + itm.EMAIL + "' FeeId='" + itm.FeeId + "' ElementId='" + itm.Id + "' NextDueDate='" + getRealDate2(itm.NextDueDate) + "' SMS='" + itm.SMS + "' SendEvery='" + itm.SendEvery + "' Title='" + itm.Title + "'><i class='fas fa-pencil-alt'></i></a></td></tr>");
                });
            }
            modal.dialog('close');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            modal.dialog('close');
            console.log(jqXHR.ErrorMsg + " " + textStatus + " " + errorThrown);
        }
    });

}

function getData(zn, aa, ab, ac, ad, ae, af, ag, ah, clearStatus, bStat) {
    var modal = $('<div>').dialog({ modal: true });
    modal.dialog('widget').hide();

    if (clearStatus == true) { $('.trendingItems').empty(); }

    $.ajax({
        type: "GET",
        url: "/api/Middle/GetDataItem_Blocks",
        contentType: "application/json; charset=utf-8",
        data: { zoneid: zn, offset: aa, typ: ab, param: ac, param2: ad, dateFrom: ae, dateTo: af, dateSingle: ag, ZoneType: ah },
        dataType: "json",
        success: function (result) {
            modal.dialog('close');

            if (result.iBlocks.Length < 1) {
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
                $('#data-item-template').tmpl(result.iBlocks).appendTo('.trendingItems');
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

    var issueTreatedSet = false;
    var vr = "";
    var dCount = 1;
    var dataString;

    var joinQ = ""; var rVali = "active", rValii = 10, rValiii = "";

    var zid = getCookieValue("zone_id");

    getData(zid, dCount, rVali, rValii, rValiii, $("#dateFrom").val(), $("#dateTo").val(), $("#dateSingle").val(), "");
    getRecords(zid);

    var availableTags = [];
    var val2 = "";

    $("#ubdAjaxH").submit(function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();

        rVali = "FormData";

        dCount = 1;

        getData(zid, dCount, rVali, rValii, rValiii, $("#dateFrom").val(), $("#dateTo").val(), $("#dateSingle").val(), "");

    });

    $(document).on("click", ".refreshLnk", function (e) {
        e.preventDefault();
        getData(dCount, rVali, rValii, rValiii, $("#dateFrom").val(), $("#dateTo").val(), $("#dateSingle").val(), "");
    });

    $(document).on("click", "li .pgLink", function (e) {
        e.preventDefault();
        dCount = $(this).html();

        getData(zid, dCount, rVali, rValii, rValiii, $("#dateFrom").val(), $("#dateTo").val(), $("#dateSingle").val(), "", $(this).attr("id"));

    });

    $("#changePageNum").change(function (e) {
        rValii = $(this).val();

        dCount = 1;

        getData(zid, dCount, rVali, rValii, rValiii, $("#dateFrom").val(), $("#dateTo").val(), $("#dateSingle").val(), "");
    });

    $("#sAny").keyup(function (e) {
        if (e.which == 13) {
            rVali = "keyword";
            rValiii = $(this).val();

            dCount = 1;

            getData(zid, dCount, rVali, rValii, rValiii, $("#dateFrom").val(), $("#dateTo").val(), $("#dateSingle").val(), "");
        }
    });

    $(document).on("click", ".reportIssue", function () {

        var zon = $(this);

        $("#ubdAjaxK #LIScopeTitle").val(zon.attr('blocktitle'));
        $("#ubdAjaxK #LIScopeId").val(zon.attr('id'));

    });

    $('input[name="IssueTreated"]').click(function (e) {
        if (this.checked) {

            issueTreatedSet = true;

        } else {
            issueTreatedSet = false;
        }

    });

    $("#addFee").click(function () {

        event.preventDefault();
        if (!$("#FeeTitle").val() || $("#FeeAmount").val() < 1 || !$("#EffectiveDate").val()) {
            alert("Check your input");
        }

        else {
            var modal = $('<div>').dialog({ modal: true });
            modal.dialog('widget').hide();

            event.preventDefault();
            event.stopImmediatePropagation();

            var NewFee = new Object();
            NewFee.Title = $("#FeeTitle").val();
            NewFee.Description = $("#FeeDescription").val();
            NewFee.Scope = $("#FeeScope").val();
            NewFee.Frequency = $("#FeeFrequency").val();
            NewFee.FeeType = $("#FeeType").val();
            NewFee.CycleLease = $('input:radio[name=cycle_lease]:checked').val();
            NewFee.CycleLeaseNumber = $('#fee_cycle_set_num').val();
            NewFee.EffectiveDate = $('#EffectiveDate').val();
            NewFee.NextDueDate = $('#NextDueDate').val();
            NewFee.FeeAmount = $('#FeeAmount').val();
            NewFee.ElementId = $('#ElementId').val();
            NewFee.PercentagePenalty = $('#PercentagePenalty').val();
            NewFee.PenalizeOriginal = $('#PenalizeOriginal').val();
            NewFee.PenaltyEvery = $('#PenaltyEvery').val();
            NewFee.AllocationId = $('#AllocationId').val();

            $.ajax({
                type: "POST",
                url: "/api/Middle/addFee",
                data: NewFee,
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
                    $("#newSetFees").modal('hide');
                    getRecords(zid);
                }
            }
        }
    });

    $("#modifyFee").click(function () {
        event.preventDefault();
        var modal = $('<div>').dialog({ modal: true });
        modal.dialog('widget').hide();

        //aRenewUpdate("Automatically", $('#AllocationId').val(), 0);
        $("#FeeRenewName").hide();
        event.preventDefault();
        event.stopImmediatePropagation();

        var ModifyFee = new Object();
        ModifyFee.Id = $("#xId").val();
        ModifyFee.Title = $("#xFeeTitle").val();
        ModifyFee.Description = $("#xFeeDescription").val();
        ModifyFee.Scope = $("#xFeeScope").val();
        ModifyFee.Frequency = $("#xFeeFrequency").val();
        ModifyFee.FeeType = $("#xFeeType").val();
        ModifyFee.CycleLease = $('input:radio[name=xcycle_lease]:checked').val();
        ModifyFee.CycleLeaseNumber = $('#xfee_cycle_set_num').val();
        ModifyFee.NextDueDate = $('#xNextDueDate').val();
        ModifyFee.OriginalAmount = $('#xFeeAmount').val();
        ModifyFee.PercentagePenalty = $('#xPercentagePenalty').val();
        ModifyFee.PenalizeOriginal = $('#xPenalizeOriginal').val();
        ModifyFee.PenaltyEvery = $('#xPenaltyEvery').val();

        $.ajax({
            type: "POST",
            url: "/api/Middle/modifyFee",
            data: ModifyFee,
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
                $('#ubdAjaxK').get(0).reset();
                $("#newModifyFees").modal('hide');
                getRecords(zid);
            }
        }
    });

    $("#modifyReminder").click(function () {

        event.preventDefault();
        var modal = $('<div>').dialog({ modal: true });
        modal.dialog('widget').hide();

        event.preventDefault();
        event.stopImmediatePropagation();

        var ModifyReminder = new Object();
        ModifyReminder.Id = $("#xrId").val();
        ModifyReminder.FeeId = $("#xreminder_fee").val();
        ModifyReminder.Title = $("#xreminder_title").val();

        var smsCheck = false;
        var emailCheck = false;
        var arCheck = false;

        if ($('#xsms_reminder_set').prop("checked") == true) {
            smsCheck = true;
        }

        if ($('#xemail_reminder_set').prop("checked") == true) {
            emailCheck = true;
        }

        if ($('#xan_reminder_set').prop("checked") == true) {
            arCheck = true;
        }

        ModifyReminder.SMS = smsCheck;
        ModifyReminder.EMAIL = emailCheck;
        ModifyReminder.Autoremind = arCheck;

        ModifyReminder.CycleReminder = $('input:radio[name=xcycle_reminder]:checked').val();
        ModifyReminder.CycleReminderNumber = $('#xreminder_cycle_set_num').val();
        ModifyReminder.NextDueDate = $('#xreminder_next_due_date').val();


        $.ajax({
            type: "POST",
            url: "/api/Middle/modifyReminder",
            data: ModifyReminder,
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
                $('#ubdAjaxI').get(0).reset();
                $("#newModifyReminder").modal('hide');
                getRecords(zid);
            }
        }


    });

    $("#addReminder").click(function () {
        event.preventDefault();
        if (!$("#reminder_title").val() || $("#reminder_fee").val() < 1 || !$("#reminder_fee").val() || !$("#reminder_next_due_date").val()) {
            alert("Check your input");
        }

        else {
            var modal = $('<div>').dialog({ modal: true });
            modal.dialog('widget').hide();

            event.preventDefault();
            event.stopImmediatePropagation();

            var bTestSms = "false";
            var bTestEmail = "false";
            var bTestAuto = "false";

            if ($("#sms_reminder_set").is(':checked')) { bTestSms = "true"; }
            else { bTestSms = "false"; }

            if ($("#email_reminder_set").is(':checked')) { bTestEmail = "true"; }
            else { bTestEmail = "false"; }

            if ($("#an_reminder_set").is(':checked')) { bTestAuto = "true"; }
            else { bTestAuto = "false"; }

            var NewReminder = new Object();
            NewReminder.FeeId = $("#reminder_fee").val();
            NewReminder.Title = $("#reminder_title").val();
            NewReminder.SMS = bTestSms;
            NewReminder.EMAIL = bTestEmail;
            NewReminder.Autoremind = bTestAuto;
            NewReminder.CycleReminder = $('input:radio[name=cycle_reminder]:checked').val();
            NewReminder.CycleReminderNumber = $("#reminder_cycle_set_num").val();
            NewReminder.NextDueDate = $("#reminder_next_due_date").val();

            $.ajax({
                type: "POST",
                url: "/api/Middle/addReminder",
                data: NewReminder,
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
                    $("#newSetReminder").modal('hide');
                    getRecords(zid);
                }
            }
        }
    });

    $("table").on("click", "td .editFee", function (event) {

        var thes = $(this);

        $("#xFeeTitle").val(thes.attr('title'));
        $("#xFeeDescription").val(thes.attr('description'));

        var ttn = evaluateFreqDay(thes.attr('collectedevery'));

        $('input:radio[name="xcycle_lease"][value="' + ttn + '"]').prop("checked", true);
        $("#xfee_cycle_set_num").val(evaluateFreqCount(thes.attr('collectedevery')));
        $("#xFeeScope").val(thes.attr('scope'));
        $("#xId").val(thes.attr('xid'));
        $("#xElementId").val(thes.attr('elementid'));
        $("#xFeeFrequency").val(thes.attr('frequency'));
        $("#xPercentagePenalty").val(thes.attr('PercentagePenalty'));
        $("#xPenalizeOriginal").val(thes.attr('PenalizeOriginal'));
        $("#xPenaltyEvery").val(thes.attr('PenaltyEvery'));
        $("#xFeeType").val(thes.attr('feetype'));
        $("#xFeeAmount").val(thes.attr('feeamount'));
        $("#xNextDueDate").val(thes.attr('nextduedate'));
        $("#xFeeScope").val(thes.attr('scope'));

    });

    $("table").on("click", "td .editReminder", function (event) {

        var thes = $(this);

        $("#xreminder_fee").val(thes.attr('feeid'));
        $("#xrId").val(thes.attr('xrId'));
        $("#xreminder_title").val(thes.attr('title'));

        var smsCheck = thes.attr('SMS').toString();
        var emailCheck = thes.attr('EMAIL').toString();
        var arCheck = thes.attr('Autoremind').toString();



        if (smsCheck == "true") {
            $('input[name="xsms_reminder_set"]').prop("checked", true);
        }

        else {
            $('input[name="xsms_reminder_set"]').prop("checked", false);
        }

        if (emailCheck == "true") {
            $('input[name="xemail_reminder_set"]').prop("checked", true);
        }

        else {
            $('input[name="xemail_reminder_set"]').prop("checked", false);
        }

        if (arCheck == "true") {
            $('input[name="xan_reminder_set"]').prop("checked", true);
        }

        else {
            $('input[name="xan_reminder_set"]').prop("checked", false);
        }

        $("#xreminder_next_due_date").val(thes.attr('nextduedate'));

        var ttn = evaluateFreqDay(thes.attr('sendevery'));

        $('input:radio[name="xcycle_reminder"][value="' + ttn + '"]').prop("checked", true);
        $("#xreminder_cycle_set_num").val(evaluateFreqCount(thes.attr('sendevery')));

    });

    $("#addManyBlockBtn").click(function (event) {
        event.preventDefault();

        event.stopImmediatePropagation();
        var modal;

        modal = $('<div>').dialog({ modal: true });
        modal.dialog('widget').hide();

        var numBlocks = $('#numValue').val();

        $.ajax({
            type: "GET",
            url: "/api/ApiResources/createBlocks?num=" + numBlocks + "&zid=" + zid,
            data: {},
            dataType: "json",
            success: function (result) {
                modal.dialog('close');
                onAjaxRequestSuccess(result);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                modal.dialog('close');
                console.log(jqXHR.ErrorMsg + " " + textStatus + " " + errorThrown);
            }
        });

        var onAjaxRequestSuccess = function (result) {
            if (result.EnableError) {
                $("#errorInfoCreateBlock").html(result.ErrorMsg);
            } else if (result.EnableSuccess) {
                $("#addManyBlockModal").modal('hide');
                getData(zid, 1, "active", 10, "", $("#dateFrom").val(), $("#dateTo").val(), $("#dateSingle").val(), "");
            }
        }
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
                formData.append('zid', zid);
            }

            $.ajax({
                type: "POST",
                url: '/Manager/uploadExcel_Blocks',
                data: formData,
                dataType: 'json',
                contentType: false,
                processData: false,
                success: function (response) {
                    if (response.EnableError) {
                        $("#insertErrorBEU").html(response.ErrorMsg);
                    } else if (response.EnableSuccess) {
                        $("#uploadExcelModal").modal('hide');
                        getData(zid, 1, "active", 10, "", $("#dateFrom").val(), $("#dateTo").val(), $("#dateSingle").val(), "");
                    }

                    modal.dialog('close');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    modal.dialog('close');
                    console.log(jqXHR.ErrorMsg + " " + textStatus + " " + errorThrown);
                }
            });

        });

    $("#logIssue").click(function (event) {
        event.preventDefault();

        event.stopImmediatePropagation();
        var action = $("#ubdAjaxK").attr("action");

        var modal;

        if ($('#IssueTitle').val() != "") {
            modal = $('<div>').dialog({ modal: true });
            modal.dialog('widget').hide();

            var issue = new Object();
            issue.Title = $('#IssueTitle').val();
            issue.FeeAttached = $('#FeeAttached').val();
            issue.Description = $('#IssueDescription').val();
            issue.Scope = $('#IssueScope').val();
            issue.PercentageResolution = $('#PercentageResolution').val();
            issue.ScopeId = $('#LIScopeId').val();
            issue.ScopeTitle = $('#LIScopeTitle').val();
            issue.Treated = issueTreatedSet;

            $.ajax({
                type: "POST",
                url: "/api/ApiResources/logIssue",
                data: issue,
                dataType: "json",
                success: function (result) {
                    modal.dialog('close');
                    onAjaxRequestSuccess(result);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    modal.dialog('close');
                    console.log(jqXHR.ErrorMsg + " " + textStatus + " " + errorThrown);
                }
            });

            var onAjaxRequestSuccess = function (result) {
                if (result.EnableError) {
                    $("#insertErrorLI").html(result.ErrorMsg);
                } else if (result.EnableSuccess) {
                    $("#reportIssueModal").modal('hide');
                }
            }
        }

        else {
            $("#insertErrorLI").html("Title cannot be empty !");
        }
    });


    $("#addBlock").click(function (event) {
        event.preventDefault();
        var modal = $('<div>').dialog({ modal: true });
        modal.dialog('widget').hide();

        event.preventDefault();
        event.stopImmediatePropagation();

        var block = new Object();
        block.Title = $('#Title').val();
        block.Address = $('#Address').val();
        block.ZoneId = $('#ZoneId').val();

        $.ajax({
            type: "POST",
            url: "/api/Middle/addBlock",
            data: block,
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
                getData(zid, 1, "active", 10, "", $("#dateFrom").val(), $("#dateTo").val(), $("#dateSingle").val(), "");
            }
        }
    });

    $('#submitDemoRequest').click( function(e) {
        e.preventDefault();
        $.ajax({
            url: '/Home/demoRequest',
            type: 'post',
            dataType: 'json',
            data: $('#demoRequest').serialize(),
            success: function(data) {
                       // ... do something with the data...
                     }
        });
    });

    $("#modifyBlock").click(function (event) {
        event.preventDefault();
        var modal = $('<div>').dialog({ modal: true });
        modal.dialog('widget').hide();

        event.preventDefault();
        event.stopImmediatePropagation();

        var block = new Object();
        block.Title = $('#bTitle').val();
        block.Address = $('#bAddress').val();
        block.ZoneId = $('#ZoneId').val();
        block.Id = $('#bId').val();

        $.ajax({
            type: "POST",
            url: "/api/ApiUtilities/modifyBlock",
            data: block,
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
                $("#modifyBlockModal").modal('hide');
                vr = "";
                dCount = 1;
                dataString;

                joinQ = ""; rVali = "active", rValii = 10, rValiii = "";

                getData(zid, dCount, rVali, rValii, rValiii, $("#dateFrom").val(), $("#dateTo").val(), $("#dateSingle").val(), "");
            }
        }
    });
});
