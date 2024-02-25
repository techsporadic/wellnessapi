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

    function getCookieValue(a) {
        var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
        return b ? b.pop() : '';
    }

    var totalDay = 0, totalWeek = 0, totalMonth = 0, totalDebts = 0;

    if (getCookieValue("sidSearch") != null) {
        $(".sSelext").val(getCookieValue("sidSearch"));
    }

    $(".sSelext").change(function () {
        var sid = $(this).val();
        window.location.replace("/Coordinator/Dashboard/" + sid);
    });

    var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
    var today = new Date();
    var d;
    var day;
    var mnth1 = new Array();
    var actionUrl = '/api/ApiResources/GetDashMetricsData';
    var sevenm = 3, sixm = 4, fivem = 2, fourm = 7, threem = 6, twom = 9, onem = 4;
    var _direct = 320, _other = 50;

    $.getJSON(actionUrl, function (response) {
        if (response != null) {
            totalDay = response.ddmt.todaySum;
            totalWeek = response.ddmt.weekSum;
            totalMonth = response.ddmt.monthSum;
            debtsOwed = response.ddmt.debtsOwed;

            $("#totalDay").html(addCommas(totalDay));
            $("#totalWeek").html(addCommas(totalWeek));
            $("#totalMonth").html(addCommas(totalMonth));
            $("#totalDebts").html(addCommas(debtsOwed));

            sevenm = response.wtlcd.sevenm;
            sixm = response.wtlcd.sixm;
            fivem = response.wtlcd.fivem;
            fourm = response.wtlcd.fourm;
            threem = response.wtlcd.threem;
            twom = response.wtlcd.twom;
            onem = response.wtlcd.onem;

            _direct = response.mtd.DirectTran;
            _other = response.mtd.OtherTran;

            
            for (var i = 6; i > -1; i--) {
                var d = new Date();
                d.setDate(d.getDate() - i);
                var x = d.getDay();

                day = DAYS[x];
                mnth1.push(day);
            }

            var config1 = {
                type: 'line',
                data: {
                    labels: mnth1,
                    datasets: [{
                        label: "",
                        backgroundColor: '#54789e',
                        borderColor: '#54789e',
                        borderDash: [5, 5],
                        data: [
                            sevenm,
                            sixm,
                            fivem,
                            fourm,
                            threem,
                            twom,
                            onem
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

            var config = {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: [
                            _direct,
                            _other,
                        ],
                        backgroundColor: [
                            '#2f5072',
                            '#54789e'
                        ],
                        label: 'Dataset 1'
                    }],
                    labels: [
                        "Direct",
                        "Others"
                    ]
                },
                options: {
                    responsive: true,
                    legend: {
                        position: 'bottom'
                    }
                }
            };
            var ctx2 = document.getElementById("chart-area2").getContext("2d");
            window.myPie = new Chart(ctx2, config);
        }        
    });
});