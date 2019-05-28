/**
 * Theme: Ninja Admin Template
 * Author: NinjaTeam
 * Module/App: Morris-Chart
 */

(function($) {
	"use strict";

	var Chart = {};

	$(document).ready(function(){
		Chart.traffic();
		Chart.bar();
		Chart.pie();
		return false;
	});

	$(window).on("resize",function(){
		return false;
	});

	Chart = {
		traffic: function(){
			$("#traffic-sparkline-chart-1").sparkline([0, 5, 3, 7, 5, 10, 3, 6, 5, 10, 30], {
				width: "120",
				height: "35",
				lineColor: "#4d8cf4",
				fillColor: !1,
				spotColor: !1,
				minSpotColor: !1,
				maxSpotColor: !1,
				lineWidth: 1.15
			});
			$('#traffic-sparkline-chart-2').sparkline([1, 2, 3, 4, 5, 6, 7, 8, 10 , 12, 14], {
				type: 'bar',
				height: '35',
				barWidth: '5',
				resize: true,
				barSpacing: '5',
				barColor: '#00bf4f'
			});
			$('#traffic-sparkline-chart-3').sparkline([5,5, 6,6, 7,7,6,6, 7,7, 8,8,7,7, 8,8, 9,9,8,8, 9,9, 10,10,], {
				type: 'discrete',
				width: '120',
				height: '65',
				resize: true,
				lineColor:'#ff1744'
			});
		}
	}
})(jQuery);