$(document).ready(function () {
    var barChartData, barChartData1, MONTHS, color;
    var alabell = [], acount = [], alabell1 = [], acount1 = [];
    var Abia = 0, Adamawa = 0, Akwa_Ibom = 0, Anambra = 0, Bauchi = 0, Bayelsa = 0, Benue = 0, Borno = 0, Cross_River = 0, Delta = 0, Ebonyi = 0, Edo = 0, Ekiti = 0, Enugu = 0, Gombe = 0, Imo = 0, Jigawa = 0, Kaduna = 0, Kano = 0, Katsina = 0, Kebbi = 0, Kogi = 0, Kwara = 0, Lagos = 0, Nasarawa = 0, Niger = 0, Ogun = 0, Ondo = 0, Osun = 0, Oyo = 0, Plateau = 0, Rivers = 0, Sokoto = 0, Taraba = 0, Yobe = 0, Zamfara = 0, FCT = 0;
    var actionUrli = '/Utilities/getStateBarChartData?id=new';
    $.getJSON(actionUrli, function (response) {
        if (response != null) {
            //Abia = response[0].Abia;
            //Adamawa = response[0].Adamawa;
            //Akwa_Ibom = response[0].Akwa_Ibom;
            //Anambra = response[0].Anambra;
            //Bauchi = response[0].Bauchi;
            //Bayelsa = response[0].Bayelsa;
            //Benue = response[0].Benue;
            //Borno = response[0].Borno;
            //Cross_RIver = response[0].Cross_RIver;
            //Delta = response[0].Delta;
            //Edo = response[0].Edo;
            //Ebonyi = response[0].Ebonyi;
            //Ekiti = response[0].Ekiti;
            //Enugu = response[0].Enugu;
            //Gombe = response[0].Gombe;
            //Imo = response[0].Imo;
            //Jigawa = response[0].Jigawa;
            //Kaduna = response[0].Kaduna;
            //Kano = response[0].Kano;
            //Katsina = response[0].Katsina;
            //Kebbi = response[0].Kebbi;
            //Kogi = response[0].Kogi;
            //Kwara = response[0].Kwara;
            //Lagos = response[0].Lagos;
            //Nasarawa = response[0].Nasarawa;
            //Niger = response[0].Niger;
            //Ogun = response[0].Ogun;
            //Ondo = response[0].Ondo;
            //Osun = response[0].Osun;
            //Oyo = response[0].Oyo;
            //Plateau = response[0].Plateau;
            //Rivers = response[0].Rivers;
            //Sokoto = response[0].Sokoto;
            //Taraba = response[0].Taraba;
            //Yobe = response[0].Yobe;
            //Zamfara = response[0].Zamfara;
            //FCT = response[0].FCT;

            $.each(response[0].soo, function (k, v) {
                console.log(v.count + " " + v.state);
                if(v.count != 0)
                {
                    alabell.push(v.state);
                    acount.push(v.count);
                }
            });

            $.each(response[0].sor, function (k, v) {
                console.log(v.count + " " + v.state);
                if (v.count != 0) {
                    alabell1.push(v.state);
                    acount1.push(v.count);
                }
            });


        }
   
    MONTHS = ["Abia", "Adamawa", "Akwa_Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross_River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT"];
    color = Chart.helpers.color;
    barChartData = {
        labels: alabell,
        datasets: [{
            label: 'State Of Origin',
            backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
            borderColor: window.chartColors.red,
            borderWidth: 1,
            data: acount
        }]

    };

    barChartData1 = {
        labels: alabell1,
        datasets: [{
            label: 'State Of Residence',
            backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
            borderColor: window.chartColors.blue,
            borderWidth: 1,
            data: acount1
        }]

    };

    var ctx = document.getElementById("canvas").getContext("2d");
    var ctx1 = document.getElementById("canvas1").getContext("2d");
        window.myBar = new Chart(ctx, {
            type: 'bar',
            data: barChartData,
            options: {
                responsive: true,
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: ''
                },
                scales: {
                    xAxes: [{
                       ticks: {
                           autoSkip: false,
                           beginAtZero: true
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });

        window.myBar = new Chart(ctx1, {
            type: 'bar',
            data: barChartData1,
            options: {
                responsive: true,
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: ''
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            autoSkip: false,
                            beginAtZero: true
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });


        var colorNames = Object.keys(window.chartColors);
    });
});