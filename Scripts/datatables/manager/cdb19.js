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

$(document).ready(function () {
      
    var metric_dateFrom = "";
    var metric_dateTo = "";

    function getCookieValue(a) {
        var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
        return b ? b.pop() : '';
    }

    if (getCookieValue("metric_dateFrom") != null && getCookieValue("metric_dateTo") != null) {
        metric_dateFrom = getCookieValue("metric_dateFrom");
        metric_dateTo = getCookieValue("metric_dateTo");

        $("#dateFrom").val(metric_dateFrom);
        $("#dateTo").val(metric_dateTo);
    }
    
    var _debits = 0, _debts = 0, _expenses = 0, _pending = 0, _received = 0;
    var sevenm = 3, sixm = 4, fivem = 2, fourm = 7, threem = 6, twom = 9, onem = 4;
    var actionUrli = '/api/ApiResources/getFinancials?dateFrom=' + metric_dateFrom + '&dateTo=' + metric_dateTo;
    var DAYS = ["Debits", "Debts", "Expenses", "Pending", "Received"];

    $.getJSON(actionUrli, function (response) {
        if (response != null) {
            _debits = response.SuccessMsg.Debits;
            _debts = response.SuccessMsg.Debts;
            _expenses = response.SuccessMsg.Expenses;
            _pending = response.SuccessMsg.Pending;
            _received = response.SuccessMsg.Received;

            $("#sDebtSum").html("₦ " + addCommas(_debts));
            $("#sPendingSum").html("₦ " + addCommas(_pending));
            $("#sDebitSum").html("₦ " + addCommas(_debits));
            $("#sReceivedSum").html("₦ " + addCommas(_received));
            $("#sExpensesSum").html("₦ " + addCommas(_expenses));

            var config1 = {
                type: 'bar',
                data: {
                    labels: DAYS,
                    datasets: [{
                        label: "",
                        backgroundColor: '#54789e',
                        borderColor: '#54789e',
                        borderDash: [5, 5],
                        data: [
                            _debits,
                            _debts,
                            _expenses,
                            _pending,
                            _received
                        ],
                        fill: false,
                    }]
                },
                options: {
                    responsive: true,
                    title: {
                        display: false,
                        text: 'Weekly Payment Trend'
                    },
                    legend: {
                        display: false
                    },
                    tooltips: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return tooltipItem.yLabel;
                            }
                        }
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            gridLines: {
                                display: false
                            },
                            scaleLabel: {
                                display: false,
                                labelString: ''
                            }
                        }],
                        yAxes: [{
                            display: true,
                            gridLines: {
                                display: false
                            },
                            scaleLabel: {
                                display: false,
                                labelString: ''
                            }
                        }]
                    }
                }

            };

            var ctx3 = document.getElementById("canvas2").getContext("2d");
            window.myLine = new Chart(ctx3, config1);
        }
    });    
});