function getRealDate(dateval) {
    var dd = dateval.slice(0, 10);
    var orderdate = new Date(dd);
    return orderdate.toString('MMM dd, yyyy');
}

function getRealDate2(dateval) {
    var dd = dateval.slice(0, 10);
    var orderdate = new Date(dd);
    return orderdate.toString('yyyy-MM-dd');
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

$(function () {

    getRecords();

    var FeeId = 1;
    var ReminderId = 1;
    $("#AllocationId").val(getCookieValue("aid"));

    var options = {
        url: function (phrase) {
            return "/api/Middle/getClients";
        },

        getValue: function (element) {
            return element.FirstName + " " + element.LastName;
        },

        list: {

            onSelectItemEvent: function () {
                var value = $("#clientNameB").getSelectedItemData().Id;

                $("#data_holder").val(value).trigger("change");
            }
        }
    };

    $("#clientNameB").easyAutocomplete(options);

    $("input[name='clientNameB']").on("click", function () {
        $(this).select();
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
                    getRecords();
                }
            }
        }

    });

    $("#modifyFee").click(function () {
        event.preventDefault();
        var modal = $('<div>').dialog({ modal: true });
        modal.dialog('widget').hide();

        aRenewUpdate("Automatically", $('#AllocationId').val(), 0);
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
                getRecords();
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
                getRecords();
            }
        }


    });

    $("#addReminder").click(function () {

        event.preventDefault();
        
        if(!$("#reminder_title").val() || $("#reminder_fee").val() < 1 || !$("#reminder_fee").val() || !$("#reminder_next_due_date").val())
{
    alert("Check your input");
}

else
{
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
                getRecords();
            }
        }
}


    });

    $("#changeClient").click(function (event) {
        event.preventDefault();
        var modal = $('<div>').dialog({ modal: true });
        modal.dialog('widget').hide();

        event.preventDefault();
        event.stopImmediatePropagation();

        var NewChange = new Object();
        NewChange.ClientId = $('#data_holder').val();
        NewChange.UnitId = $('#UnitId').val();

        $.ajax({
            type: "POST",
            url: "/api/Middle/ChangeClient",
            data: NewChange,
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
                getRecords();
            }
        }
    });

    $("#DeAllocate").click(function () {

        event.preventDefault();
        event.stopImmediatePropagation();

        if (confirm("Do you want to deallocate this unit?")) {

            event.preventDefault();
            var modal = $('<div>').dialog({ modal: true });
            modal.dialog('widget').hide();

            var DeAllocate = new Object();
            DeAllocate.UnitId = $('#UnitId').val();
            DeAllocate.AllocationId = $('#AllocationId').val();

            $.ajax({
                type: "POST",
                url: "/api/Middle/DeAllocate",
                data: DeAllocate,
                dataType: "json",
                success: function (result) {
                    modal.dialog('close');
                    onAjaxRequestSuccess(result);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR.ErrorMsg + " " + textStatus + " " + errorThrown);
                }
            });
        }

        var onAjaxRequestSuccess = function (result) {
            if (result.EnableError) {
                alert(result.ErrorMsg);
            } else if (result.EnableSuccess) {
                window.location.replace("/Manager/Allocations/Create/" + $('#UnitId').val());
            }
        }


    });

    $("#renew_fee").change(function () {
        if ($(this).val() != "0") {
            $("#renewFeeId").val($(this).val());
            $("#FeeRenewName").show().html("Fee: " + this.options[this.selectedIndex].text);
            aRenewUpdate("Upon Invoice Payment", $('#AllocationId').val(), $(this).val());
        }
    });

    $("#allocationRenewMode").change(function () {
        if ($(this).val() == "Upon Invoice Payment") {
            $("#renew_fee").val("Select item...");
            $("#renewSelectFee").modal('show');
        }
        else {
            aRenewUpdate("Automatically", $('#AllocationId').val(), 0);
            $("#FeeRenewName").hide();
        }
    });
});

function aRenewUpdate(arMode, aId, rFId) {
    var modal = $('<div>').dialog({ modal: true });
    modal.dialog('widget').hide();

    event.preventDefault();
    event.stopImmediatePropagation();

    var ARModify = new Object();
    ARModify.arMode = arMode;
    ARModify.aId = aId;
    ARModify.rFId = rFId;


    $.ajax({
        type: "POST",
        url: "/api/Middle/ARModify",
        data: ARModify,
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
            getRecords();
        }
    }
}

function getRecords() {
    var modal = $('<div>').dialog({ modal: true });
    modal.dialog('widget').hide();

    var client = { UnitId: getCookieValue("cid") };

    $.ajax({
        type: "GET",
        url: "/api/Middle/GetDataItem_C_AllocationDetails",
        data: client,
        dataType: "json",
        success: function (result) {
            modal.dialog('close');
            $("#clientName").html(result.ut.FirstName + " " + result.ut.LastName);
            $("#clientNameB").val(result.ut.FirstName + " " + result.ut.LastName);
            $("#AlloTerm").html(getRealDate3(result.ut.EffectiveDate) + " | " + getRealDate3(result.ut.ExpiryDate));
            $("#AllocationId").val(result.ut.Allocation_Id);
            $("#data_holder").val(result.ut.Id);
            $("#perm_home_address").html(result.ut.Perm_Home_Address);
            $("#AlloType").html(result.ut.AllocationType);
            $("#dateAllocated").html(getRealDate(result.ut.DateAllocated));
            $("#dateAllocated").val(result.ut.AllocationsRenewMode);

            $("#allocationRenewMode").empty().append("<option value='Automatically'>Automatically</option><option value='Upon Invoice Payment'>Upon Invoice Payment</option>");
            $("#allocationRenewMode").val(result.ut.AllocationsRenewMode);

            $("#FeeList").html('');
            $("#ReminderList").html('');
            $("#reminder_fee").find('option').remove().end();
            $("#xreminder_fee").find('option').remove().end();

            if (result.ut.FeesSet == true) {
                $("#renew_fee").empty();
                $("#renew_fee").append("<option id='0' selected>Select item...</option>");
                result.fs.forEach(function (item) {
                    if (result.ut.RenewEvery > 0) {
                        $("#renew_fee").append("<option title='" + item.Id + "' value='" + item.Id + "'>" + item.Title + "</option>");
                        if (result.ut.AllocationsRenewMode == "Upon Invoice Payment" && result.ut.RenewFeeId == item.Id) {
                            $("#RenewFeeId").val(item.Id);
                            $("#FeeRenewName").show().html("Fee: " + item.Title);
                        }                        

                        $("#renew_fee").val(result.ut.RenewFeeId);
                    }                    
                    
                    $("#FeeList").append("<tr><td>" + truncateString(item.Title, 8) + "</td><td>" + truncateString(item.FeeType, 8) + "</td><td>" + addCommas(item.OriginalAmount) + "</td><td>" + item.Scope + "</td><td><a class='noColor editFee' href='#' data-toggle='modal' data-target='#newModifyFees' CollectedEvery='" + item.CollectedEvery + "' Description='" + item.Description + "' xId='" + item.Id + "' Scope='" + item.Scope + "' Title='" + item.Title + "' FeeAmount='" + item.OriginalAmount + "' FeeType='" + item.FeeType + "' Frequency='" + item.Frequency + "' NextDueDate='" + getRealDate2(item.NextDueDate) + "' PercentagePenalty='" + item.PercentagePenalty + "' PenaltyEvery='" + item.PenaltyEvery + "' OriginalAmount='" + item.OriginalAmount + "' PenalizeOriginal='" + item.PenalizeOriginal + "'><i class='fas fa-pencil-alt'></i></a></td></tr>");
                    $("#reminder_fee").append("<option value='" + item.Id + "'>" + item.Title + "</option>");
                    $("#xreminder_fee").append("<option value='" + item.Id + "'>" + item.Title + "</option>");
                });
            }


            if (result.ut.RemindersSet == true) {
                
                result.rm.forEach(function (itm) {
                        $("#ReminderList").append("<tr><td>" + itm.Title + "</td><td>" + getRealDate(itm.NextDueDate) + "</td><td><a class='noColor editReminder' href='#'data-toggle='modal' data-target='#newModifyReminder' xrId = '" + itm.Id + "' Autoremind='" + itm.Autoremind + "' EMAIL='" + itm.EMAIL + "' FeeId='" + itm.FeeId + "' ElementId='" + itm.Id + "' NextDueDate='" + getRealDate2(itm.NextDueDate) + "' SMS='" + itm.SMS + "' SendEvery='" + itm.SendEvery + "' Title='" + itm.Title + "'><i class='fas fa-pencil-alt'></i></a></td></tr>");
                });
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            modal.dialog('close');
            console.log(jqXHR.ErrorMsg + " " + textStatus + " " + errorThrown);
        }
    });

}

function getCookieValue(a) {
    var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
}