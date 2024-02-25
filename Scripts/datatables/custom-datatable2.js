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
    var table = $('#userProgramsTable').DataTable(
    {
        dom: "B<'pull-right pfix'f><'pull-left pfix'l>rtip",
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ],
        scrollY: "200px",
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
            { "width": "4%", "targets": [0] },
            { "className": "text-center custom-middle-align", "targets": [1, 2, 3, 4, 5] },
        ],
        "language":
            {
                "processing": "<div class='overlay custom-loader-background'><i class='fa fa-cog fa-spin custom-loader-color'></i></div>"
            },
        "processing": true,
        "serverSide": true,
        "ajax":
            {
                "url": "/Programs/GetData",
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
                    {
                        "data": "program",
                        "render": function (data, type, row, meta) {
                            //if (type === 'display') {
                            data = '<a target="_blank" href="/Programs/ListItem/?id=' + encodeURIComponent(row.Id) + '&gname=' + encodeURIComponent(data) + '">' + data + '</a>';
                            //}

                            return data;
                        }
                    },
                    { "data": "category" },
                    { "data": "program_date_start" },
                    { "data": "program_date_stop" },
                    {
                        "data": "view",
                        "render": function (data, type, row, meta) {
                            //if (type === 'display') {
                            data = '<button class="btn btn-info btn-sm" id="' + row.Id + '">View</button>';
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

    // Handle click on checkbox
    $('#userProgramsTable tbody').on('click', 'input[type="checkbox"]', function (e) {
        var $row = $(this).closest('tr');

        // Get row data
        var data = table.row($row).data();

        // Get row ID
        var rowId = data[0];

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
    $('#userProgramsTable').on('click', 'tbody td, thead th:first-child', function (e) {
        $(this).parent().find('input[type="checkbox"]').trigger('click');
    });

    // Handle click on "Select all" control
    $('thead input[name="select_all"]', table.table().container()).on('click', function (e) {
        if (this.checked) {
            $('#userProgramsTable tbody input[type="checkbox"]:not(:checked)').trigger('click');
        } else {
            $('#userProgramsTable tbody input[type="checkbox"]:checked').trigger('click');
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
    $('#frm-userProgramsTable').on('submit', function (e) {
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
    $("#userProgramsTable tfoot th").each(function (i) {

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