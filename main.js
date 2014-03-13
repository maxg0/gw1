
$(document).ready(function(){
	var raWorker;
	var gaWorker;
	var raProgress = 0;
	var gaProgress = 0;
	var population = [];
	$('.ra-start-button').click(function(){
		raWorker = new Worker("task.js");
		raWorker.onmessage = function(e){
			switch( e.data.type ){
				case 'update':
					//population.push(e.data);
					$(".ra-candidate").text(e.data.best.cost + " " + e.data.best.dna.production);
					$(".ra-bar").val(++raProgress);
				break;
				case 'done':
					population.push(e.data.best);
					raProgress = 0;
				break;
				case 'stopping':
					console.log(population);
				break;
				case 'debug':
					console.log(e.data.debug);
				break;
			};
		}
		var limit = $('.limit').val();
		maxPop = $('.pop').val();
		raProgress = 0;
		$(".ra-bar").val(0);
		raWorker.postMessage({
			'limit': limit,
			'pop': $('.pop').val(),
			'command' : 'start'
		});
	});
	$('.ra-stop-button').click(function(){
		raWorker.terminate();
		raWorker.postMessage({
			'limit': 0,
			'command' : 'stop'
		});
	});
	$('.ga-start-button').click(function(){
		gaWorker = new Worker("ga.js");
		$('.ga-bar').val(0);
		gaWorker.onmessage = function(e){
			switch( e.data.type ){
				case 'update':
					$('.ga-bar').val(100*(++gaProgress/generations));
				break;
				case 'debug':
					console.log(e.data.debug);
				break;
			}
		}
		var generations = $(".generations").val();
		var mutation = $(".mutation").val();
		gaWorker.postMessage({
			'command' : 'start',
			'population' : population,
			'generations':generations,
			'mutation' : mutation
		});
	})
	$('.ga-stop-button').click(function(){
		gaWorker.postMessage({
			'limit':0,
			'command' : 'stop'
		});
	});
});
