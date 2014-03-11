
function createChild(father, mother){
	var child = {
		production: [],
		producing: []
	};
	for( var g = 0; g < father.production.length; g++){
		child.production.push(father.production[g]);
		child.production.push(mother.production[g]);
	}
	
	return child;
}

$(document).ready(function(){
	var worker = new Worker("task.js");
	var progress = 0;
	worker.onmessage = function(e){
		$(".candidate").text(e.data.cost + " " + e.data.dna.production);
		$(".progress-bar").val(++progress);
	}


	
	$('.start-button').click(function(){
		var limit = $('.limit').val();
		progress = 0;
		console.log(limit);
		$(".progress-bar").val(0);
		worker.postMessage(limit);
	});
});
