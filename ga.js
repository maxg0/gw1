
function createChild(father, mother){
	var child = {
		production: [],
		producing: []
	};
	var numbers = productionPool.slice(0);

	for(var i = 0; i < father.production.length; i++){
		for( var n = 1; n < 9; n++){
			if(n == father.production[i]){
				if(numbers[n-1] > 0){
					numbers[n-1]--;
					child.production.push(father.production[i]);
				}
			}
			if(n == mother.production[i]){
				if(numbers[n-1] > 0){
					numbers[n-1]--;
					child.production.push(mother.production[father.production.length-1-i]);
				}
			}
		}
	}

	for(var i = 0; i < father.producing.length; i++){
		child.producing[i] = father.producing[i];
	}

	// Mutation

	var a = random(0,31);
	var b = random(0,31);
	var tmp = child.production[a];
	child.production[a] = child.production[b];
	child.production[b] = tmp;
	return child;
}
function dbg(obj){
	self.postMessage({
		'type' : 'debug',
		'debug' : obj
	});
}

function selection(population, generations){
	var child;
	for(var g = 0; g < generations; g++){
		for(var m = 0; m < population.length; m++){
			for(var f = 0; f < population.length; f++){
				
				child = checkCost(createChild(population[f].dna, population[m].dna));
				if(population[f].cost > child.cost){
					dbg(population[f].cost + " fmt "+ child.cost);
					population.push(child);
				}
				if(population[m].cost > child.cost){
					dbg(population[m].cost + " mmt "+ child.cost);
					population.push(child);
				}
			}
		}
		self.postMessage({
			'type' : 'update'
			
		});
	}
	return population;
}

self.addEventListener('message', function(e){
	self.importScripts('cost.js');
	self.importScripts('task.js');
	switch( e.data.command ) {
		case 'start':
			//dbg(e.data.population[0].dna);
			//dbg(e.data.population[0].cost);
			
			dbg(selection(e.data.population, e.data.generations));
		break;
		case 'stop':
			self.postMessage({
				'type' : 'debug',  
				"debug": "stopping"
			});
			self.close();
		break;
	};
},500);
