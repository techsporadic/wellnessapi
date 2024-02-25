function updateDataTableSelectAllCtrl(table) {
    var $table = table.table().node();
    var $chkbox_all = $('tbody input[type="checkbox"]', $table);
    var $chkbox_checked = $('tbody input[type="checkbox"]:checked', $table);
    var chkbox_select_all = $('thead input[name="select_all"]', $table).get(0);

    // If none of the checkboxes are checked
    if ($chkbox_checked.length === 0) {
        chkbox_select_all.checked = false;
        if ('indeterminate' in chkbox_select_all) {
            chkbox_select_all.indeterminate = false;
        }

        // If all of the checkboxes are checked
    } else if ($chkbox_checked.length === $chkbox_all.length) {
        chkbox_select_all.checked = true;
        if ('indeterminate' in chkbox_select_all) {
            chkbox_select_all.indeterminate = false;
        }

        // If some of the checkboxes are checked
    } else {
        chkbox_select_all.checked = true;
        if ('indeterminate' in chkbox_select_all) {
            chkbox_select_all.indeterminate = true;
        }
    }
}


$(document).ready(function () {
    var reVal;
    var rows_selected = [];

    var table = $('#TableId').DataTable(
    {
        dom: "<'pull-right pfix'f><'pull-left pfix'l>rtip",
        buttons: [
            'copy', 'csv', 'excel', {
                extend: 'pdfHtml5',
                orientation: 'landscape',
                pageSize: 'A4'
            }, 'print'
        ],
        scrollY: "400px",
        scrollX: "1100px",
        scrollCollapse: true,
        paging: true,
        searching: true,
        fixedColumns: {
            heightMatch: 'none'
        },
        'oTableTools': {
            'sSwfPath': 'media/swf/copy_csv_xls_pdf.swf'
        },
        'columnDefs': [{
            'targets': 0,
            'searchable': true,
            'width': '1%',
            'className': 'dt-body-center',
            'render': function (data, type, full, meta) {
                return '<input type="checkbox">';
            }
        }],
        "columnDefs": [
            { "className": "text-center custom-middle-align", "targets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
        ],
        "language":
            {
                "processing": "<div class='overlay custom-loader-background'><i class='fa fa-circle-o-notch fa-spin custom-loader-color'></i></div>"
            },
        "processing": true,
        "serverSide": true,
        "ajax":
            {
                "url": "/Utilities/GetTicketData/Open",
                "type": "POST",
                "dataType": "JSON"
            },
        "columns": [
                    {
                        "data": "Sel All",
                        "render": function (data, type, row, meta) {
                            data = '<input type="checkbox">';

                            return data;
                        }
                    },
                    { "data": "Title" },
                    { "data": "ticketRef" },
                    { "data": "caseRef" },
                    { "data": "suitNo" },
                    { "data": "ReceivedBy" },
                    { "data": "DepartmentQueried" },
                    {
                        "data": "TimeReceived",
                        "render": function (data, type, row, meta) {
                            if (data !== null) {
                                var javascriptDate = new Date(data);
                                javascriptDate = javascriptDate.getDate() + "/" + javascriptDate.getMonth() + 1 + "/" + javascriptDate.getFullYear();
                                return javascriptDate;
                            } else {
                                return "";
                            }
                        }
                    },
                    { "data": "Priority" },
                    {
                        "data": "view",
                        "render": function (data, type, row, meta) {
                            //if (type === 'display') {
                            data = '<a class="btn btn-default btn-sm" id="getViewPdf" title="' + row.pdf + '"><i class="fa fa-file-pdf-o"></i></a>';
                            //}

                            return data;
                        }
                    },
                    {
                        "data": "Ref",
                        "render": function (data, type, row, meta) {
                            //if (type === 'display') {
                            data = '<a class="btn btn-default btn-sm" style="text-decoration:none;" target="_blank" href="/Utilities/Chat/' + row.ticketRef + '" id="openChat" title="' + row.ticketRef + '"><i class="fa fa-comments-o"></i></a>';
                            //}

                            return data;
                        }
                    }

        ],
        'order': [[1, 'asc']],
        'rowCallback': function (row, data, dataIndex) {
            // Get row ID
            var rowId = data[0];

            // If row ID is in the list of selected row IDs
            if ($.inArray(rowId, rows_selected) !== -1) {
                $(row).find('input[type="checkbox"]').prop('checked', true);
                $(row).addClass('selected');
            }
        }
    });

    $('.row').on('click', '#dStates', function (e) {
        window.open('/Applicants/StateRanking', '_blank', "toolbar=no,scrollbars=yes,resizable=yes,top=70,left=200,width=930,height=550");
        return false;
    });

    $('#TableId tbody').on('click', '#getViewPdf', function (e) {
        var appID2 = $(this).attr('title');

        window.open('/CaseManager/viewPop?type=fPdf&id=' + appID2, '_blank', "toolbar=no,scrollbars=yes,resizable=yes,top=100,left=60,width=1200,height=390");

    });

    $('#TableId tbody').on('click', '#getViewWord', function (e) {
        var appID2 = $(this).attr('title');

        window.open('/CaseManager/viewPop?type=fWord&id=' + appID2, '_blank', "toolbar=no,scrollbars=yes,resizable=yes,top=70,left=200,width=930,height=550");

    });

    $('#TableId tbody').on('click', '#getViewg, #getViewg i', function (e) {
        e.preventDefault();

        var modal = $('<div>').dialog({ modal: true });
        modal.dialog('widget').hide();
        $('#ajax_loader').show();

        $.ajax({
            url: "/Utilities/servePartials",
            data: { id: "~/Views/Shared/UserPartials/_UserPartial4.cshtml", ck: $(this).attr('title') },
            cache: false,
            type: "POST",
            dataType: "html",
            success: function (data, textStatus, XMLHttpRequest) {
                $("#uFtData").hide();

                $("#appendContent").empty().hide();
                $("#appendContent").fadeIn(500).html(data);

                $('#ajax_loader').hide();
                modal.dialog('close');
            },
            complete: function () {
                //back to normal!


            }
        });
        var appID2 = $(this).attr('title');

    });


    // Handle click on checkbox
    $('#TableId tbody').on('click', 'input[type="checkbox"]', function (e) {
        var $row = $(this).closest('tr');
        // Get row data
        var data = table.row($row).data();
        // Get row ID
        var rowId = data["appID"];
        // Determine whether row ID is in the list of selected row IDs
        var index = $.inArray(rowId, rows_selected);
        // If checkbox is checked and row ID is not in list of selected row IDs
        if (this.checked && index === -1) {
            rows_selected.push(rowId);

            // Otherwise, if checkbox is not checked and row ID is in list of selected row IDs
        } else if (!this.checked && index !== -1) {
            rows_selected.splice(index, 1);
        }

        if (this.checked) {
            $row.addClass('selected');
        } else {
            $row.removeClass('selected');
        }

        // Update state of "Select all" control
        updateDataTableSelectAllCtrl(table);

        // Prevent click event from propagating to parent
        e.stopPropagation();
    });

    // Handle click on table cells with checkboxes
    //$('#TableId').on('click', 'tbody td, thead th:first-child', function (e) {
    //    $(this).parent().find('input[type="checkbox"]').trigger('click');
    //});

    $("#sortUsers").click(function () {
        $.each(rows_selected, function (index, rowId) {
            // Create a hidden element
        });

        var postData = { progId: progId, rows_selected: rows_selected };

        $.ajax({
            type: 'POST',
            url: '/Programs/sortUsers',
            dataType: 'json',
            data: postData,
            traditional: true,
            success: function (data) {
                // Create a hidden element
                table.draw();
            },
            error: function (data) { },
            complete: function (data) {
                table.draw();
            }
        });
    });

    // Handle click on "Select all" control
    $('thead input[name="select_all"]', table.table().container()).on('click', function (e) {
        if (this.checked) {
            $('#TableId tbody input[type="checkbox"]:not(:checked)').trigger('click');
        } else {
            $('#TableId tbody input[type="checkbox"]:checked').trigger('click');
        }

        // Prevent click event from propagating to parent
        e.stopPropagation();
    });

    // Handle table draw event
    table.on('draw', function () {
        // Update state of "Select all" control
        updateDataTableSelectAllCtrl(table);
    });

    // Handle form submission event
    $('#frm-TableId').on('submit', function (e) {
        var form = this;

        // Iterate over all selected checkboxes
        $.each(rows_selected, function (index, rowId) {
            // Create a hidden element
            $(form).append(
                $('<input>')
                   .attr('type', 'hidden')
                   .attr('name', 'id[]')
                   .val(rowId)
            );
        });
    });
});

$(document).ready(function () {
    jQuery('#hideshow').on('click', function (event) {
        jQuery('#cchart').toggle('show');
    });
});