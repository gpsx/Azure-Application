/**
 * Theme: Ninja Admin Template
 * Author: NinjaTeam
 * Module/App: Chartist-Chart
 */

(function($) {
	"use strict";

	var ChartJs = {},
		randomScalingFactor = function() {
			return Math.round(Math.random() * 15) + 5;
		};

	$(document).ready(function(){
		ChartJs.line('line-chartjs-chart',false);
		ChartJs.line('area-chartjs-chart',true);
		return false;
	});

	ChartJs = {
		line: function(container,fill){
			var lineData = {
					labels: ["0", "1", "2", "3","4","5","6","7","8","9","10"],
					datasets: [{
						label: 'Series 1',
						fill: fill,
						borderColor: "rgba(245,112,122,1)",
						pointBackgroundColor: "rgb(245,112,122)",
						backgroundColor: "rgba(245,112,122,0.3)",
						data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(),randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
					}]
				};
			var ctx = document.getElementById(container).getContext("2d");
			new Chart(ctx, {
				type: 'line',
				data: lineData,
				options: {
					hover: {
						mode: 'label'
					},
					responsive: true,
					scales: {
						xAxes: [{
							ticks: {
								beginAtZero:true
							}
						}],
						yAxes: [{
							ticks: {
								beginAtZero:true
							}
						}]
					}
				}
			});
			return false;
		},
		pie : function(container,type){
			var ctx = document.getElementById(container).getContext("2d"),
				config = {
					type: type,
					data: {
						datasets: [{
							data: [
								randomScalingFactor(),
								randomScalingFactor(),
								randomScalingFactor(),
							],
							backgroundColor: [
								"#f9c851",
								"#3ac9d6",
								"#ebeff2",
							],
							hoverBackgroundColor: [
								"#f9c851",
								"#3ac9d6",
								"#ebeff2"
							],
							hoverBorderColor: "#fff"
						}],
						labels: [
							"Red",
							"Green",
							"Yellow",
						]
					},
					options: {
						responsive: true
					}
				};
			new Chart(ctx, config);
			return false;
		},
		polar: function(container){
			var ctx = document.getElementById(container).getContext("2d"),
				config = {
					data: {
						datasets: [{
							data: [
								randomScalingFactor(),
								randomScalingFactor(),
								randomScalingFactor(),
								randomScalingFactor(),
							],
							backgroundColor: [
								"#f5707a",
								"#188ae2",
								"#4bd396",
								"#8d6e63",
							],
							label: 'My dataset' // for legend
						}],
						labels: [
							"Red",
							"Blue",
							"Green",
							"Grey",
						]
					},
					options: {
						responsive: true,
						legend: {
							position: 'top',
						},
						scale: {
							ticks: {
								beginAtZero: true
							},
							reverse: false
						},
						animation: {
							animateRotate: false,
							animateScale: true
						}
					}
				};
			new Chart.PolarArea(ctx, config);
			return false;
		},
		radar: function(container){
			var ctx = document.getElementById(container).getContext("2d"),
				config = {
					type: 'radar',
					data: {
						labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
						datasets: [{
							label: "Peter",
							backgroundColor: "rgba(179,181,198,0.2)",
							borderColor: "rgba(179,181,198,1)",
							pointBackgroundColor: "rgba(179,181,198,1)",
							pointBorderColor: "#fff",
							pointHoverBackgroundColor: "#fff",
							pointHoverBorderColor: "rgba(179,181,198,1)",
							data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
						}, {
							label: "John",
							 backgroundColor: "rgba(255,99,132,0.2)",
							borderColor: "rgba(255,99,132,1)",
							pointBackgroundColor: "rgba(255,99,132,1)",
							pointBorderColor: "#fff",
							pointHoverBackgroundColor: "#fff",
							pointHoverBorderColor: "rgba(255,99,132,1)",
							data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
						},]
					},
					options: {
						legend: {
							position: 'top',
						},
						scale: {
							reverse: false,
							gridLines: {
								color: ['black', 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']
							},
							ticks: {
								beginAtZero: true
							}
						}
					}
				};
			new Chart(ctx, config);
			return false;
		}
	}
	
})(jQuery);