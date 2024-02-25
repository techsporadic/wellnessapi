function getRecords() {
    var modal = $('<div>').dialog({ modal: true });
    modal.dialog('widget').hide();

    $.ajax({
        type: "GET",
        url: "/api/ApiUtilities/GetFilingTypes",
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