/* Activity Chart */

var chartactivity = document.getElementById('SimpleChart').getContext("2d");

var gradientStroke = chartactivity.createLinearGradient(200, 0, 100, 0);
gradientStroke.addColorStop(0, "rgba(191, 98, 249, 1)");
gradientStroke.addColorStop(1, "rgba(191, 98, 249, 1)");  

var gradientFill = chartactivity.createLinearGradient(0, 0, 0, 180);
gradientFill.addColorStop(0, "rgba(191, 98, 249, 0.5)");
gradientFill.addColorStop(1, "rgba(191, 98, 249, 0)");



/* Reports Chart */

var chartreports = document.getElementById('SimpleChart').getContext("2d");

var SimpleChart = new Chart(chartreports, {
    type: 'line',
    data: {
        labels: ["SU", "MO", "TU", "WE", "TH", "FR", "SA"],
        datasets: [{
            label: "Reports",
            borderColor: "#bf62f9",
            pointBorderColor: "#bf62f9",
            pointBackgroundColor: "rgba(255, 255, 255, 1)",
            pointHoverBackgroundColor: "rgba(128, 182, 244, 1)",
            pointHoverBorderColor: gradientStroke,
            pointBorderWidth: 2,
            pointHoverRadius: 3,
            pointHoverBorderWidth: 2,
            pointRadius: 2,
            fill: true,
			backgroundColor: gradientFill,
            borderWidth: 2,
            data: [1, 10, 2, 5, 1, 7, 0]
        }
		]
    },
    options: {          
        legend: {
            position: "top",
            labels: {
                boxWidth: 15,
				padding: 5
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    display: false
                },
                gridLines: {
                    drawTicks: false,
                    display: false,
					drawBorder: false
                }

            }],
            xAxes: [{
                gridLines: {
                    zeroLineColor: "transparent",
					display: false,
					drawBorder: false
                },
                ticks: {
                    padding: 0,
                    fontColor: "rgba(255,255,255,0.8)",
                    fontStyle: "bold"
                }
            }]
        }
    }
});

