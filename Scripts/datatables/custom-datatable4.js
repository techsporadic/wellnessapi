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


$(document).ready(function ()
{
    var reVal;
    var rows_selected = [];

    var table = $('#TableId').DataTable(
    {
        dom: "B<'pull-right pfix'f><'pull-left pfix'l>rtip",
        buttons: [
            'copy', 'csv', 'excel', {
                extend: 'pdfHtml5',
                orientation: 'landscape',
                pageSize: 'A4'
            }, 'print'
        ],
        scrollY:        "450px",
        scrollX:        "1100px",
        scrollCollapse: true,
        paging: true,
        searching: true,
        fixedColumns:   {
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
        'columnDefs': [{
            'targets': 10,
            'searchable': true
        }],
        'columnDefs': [{
            'targets': 11,
            'searchable': true,
            'visible': false
        }],

        "columnDefs": [
            { "width": "4%", "targets": [0] },
            { "className": "text-center custom-middle-align", "targets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
        ],
        "language":
            {
                "processing": "<div class='overlay custom-loader-background'><i class='fa fa-cog fa-spin custom-loader-color'></i></div>"
            },
        "processing": true,
        "serverSide": true,
        "ajax":
            {
                "url": "/Utilities/GetData",
                "type": "POST",
                "dataType": "JSON",
                "data": function (d) {
                    d.myKey1 = $(".gname").attr("id");
                }
            },
        "columns": [
                    {
                        "data": "Sel All",
                        "render": function (data, type, row, meta) {
                            data = '<input type="checkbox">';

                            return data;
                        }
                    },
                    { "data": "firstName" },
                    { "data": "middlename" },
                    { "data": "lastName" },
                    { "data": "gender" },
                    { "data": "stateOfOrigin" },
                    { "data": "stateOfResidence" },
                    { "data": "age" },
                    { "data": "application_type" },
                    { "data": "h_level_edu" },
                    {
                        "data": "interest",
                        'searchable': true
                    },
                     { "data": "appID" },
                    {
                        "data": "view",
                        "render": function (data, type, row, meta) {
                            //if (type === 'display') {
                            data = '<button class="btn btn-info btn-sm" id="' + row.Id + '">View</button>';
                            //}

                            return data;
                        }
                    },
                    {
                        "data": "sortit",
                        "render": function (data, type, row, meta) {
                            //if (type === 'display') {
                            data = '<button class="btn btn-warning btn-sm" id="' + row.Id + '">Sort</button>';
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
        },
        initComplete: function () {
            this.api().columns(10).every(function () {
                var column = this;
                var select = $('<select><option value=""></option></select>')
                    .appendTo($(column.footer()).empty())
                    .on('change', function () {
                        reVal = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );

                        column
                            .search(reVal ? '^' + reVal + '$' : '', true, false)
                            .draw();
                    });

                column.data().unique().sort().each(function (d, j) {
                    select.append('<option value="' + d + '">' + d + '</option>')
                });
            });
        }
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

    $("#display-option").change(function () {
        var progId;
         $.ajax({
            type: 'GET',
            url: '/Programs/getPrograms',
            datatype: JSON,
            data: {
                'categoryId': $("#display-option").val()
            },
            success: function (data) {
                $('.appendPrograms').empty();
                $.each(data, function (i, item) {
                    var datee = new Date(Date.parse(item.program_date_start));
                    var datee2 = new Date(Date.parse(item.program_date_stop));
                    var rows = "<div class='form-check'><label class='form-check-label'><input class='form-check-input' id='prog" + item.Id + "' name='radProgram' type='radio' value='" + item.Id + "'> <span style='color: #b26543;'><b>" + item.program + "</b></span> from <span style='color: #316377;'><b>" + datee.toString('ddd, MMMM dS, yyyy') + "</b></span> to <span style='color: #647a32;'><b>" + datee2.toString('ddd, MMMM dS, yyyy') + "<b></span></label></div>";
                    $('.appendPrograms').append(rows);
                });
            },
            error: function (data) { }
        });
    });

    $('.appendPrograms').on('click', 'input[type="radio"]', function (e) {
        progId = $(this).val();
    });

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
            complete: function(data)
            {
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

$(document).ready(function(){
    $("#TableId tfoot th").each(function (i) {

        if ($(this).text() !== '') {
            var isStatusColumn = (($(this).text() == 'Status') ? true : false);
            var select = $('<select><option value=""></option></select>')
	            .appendTo($(this).empty())
	            .on('change', function () {
	                var val = $(this).val();

	                table.column(i)
	                    .search(val ? '^' + $(this).val() + '$' : val, true, false)
	                    .draw();
	            });

            // Get the Status values a specific way since the status is a anchor/image
            if (isStatusColumn) {
                var statusItems = [];

                /* ### IS THERE A BETTER/SIMPLER WAY TO GET A UNIQUE ARRAY OF <TD> data-filter ATTRIBUTES? ### */
                table.column(i).nodes().to$().each(function (d, j) {
                    var thisStatus = $(j).attr("data-filter");
                    if ($.inArray(thisStatus, statusItems) === -1) statusItems.push(thisStatus);
                });

                statusItems.sort();

                $.each(statusItems, function (i, item) {
                    select.append('<option value="' + item + '">' + item + '</option>');
                });

            }
                // All other non-Status columns (like the example)
            else {
                table.column(i).data().unique().sort().each(function (d, j) {
                    select.append('<option value="' + d + '">' + d + '</option>');
                });
            }

        }
    });
});
