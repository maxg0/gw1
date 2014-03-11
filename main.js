var changeCosts = [
	[0,	324,	2786,	0,	4567,	3594,	949,	785],
	[626,	0,	2332,	633,	596,	3594,	949,	3664],
	[939,	487,	0,	949,	0,	3594,	949,	2452],
	[0,	324,	2786,	0,	894,	3594,	949,	1346],
	[626,	0,	2786,	633,	0,	3594,	949,	3664],
	[3130,	1622,	3482,	2345,	0,	0,	3163,	0],
	[939,	487,	1045,	657,	2979,	3594,	0,	3664],
	[1734,	1622,	3482,	3163,	894,	0,	3163,	0]
];
var demand = [
	[0,0,3471,1115,0,1609,0,1182,0,2345,2327,0,1054,0,0,0,1477,0,1176,0,0,2222,1054,0,0,0,1477,0,0,1180],
	[749,478,0,0,1931,0,0,0,512,0,0,0,0,647,0,1765,1449,0,0,0,0,0,0,789,0,1765,952,0,450,0],
	[0,3234,2269,1486,0,0,1307,2761,2145,1501,0,1188,1182,0,0,5487,0,0,0,0,0,2211,0,0,0,4851,0,0,0,0],
	[2449,0,1088,0,0,0,0,783,0,1155,0,0,0,0,0,1426,0,1487,0,2629,450,0,0,0,0,0,1350,100,0,2710],
	[0,0,0,0,1555,0,1239,0,312,0,412,0,0,0,0,890,0,0,0,0,0,0,511,0,0,1033,0,0,0,0],
	[3256,0,1341,395,0,0,0,0,0,7605,0,0,0,1002,0,911,0,2920,0,2134,0,0,0,345,0,1256,2001,851,0,2154],
	[1512,0,0,0,786,0,836,0,0,1211,0,0,725,0,0,2105,0,806,0,0,0,0,0,655,0,2045,0,780,0,0],
	[0,0,1331,2898,1212,0,1045,816,0,0,454,0,0,3567,2554,578,1996,0,0,0,0,3755,0,0,2663,888,2100,0,0,0]
];

function checkCost(dna){
	var shortage = 0.25;
	var storage = 0.025;
	var production = 5000;
	var producing = 8;
	var inventory = [ 2571, 1182, 3350, 1978, 1121, 3011, 1554, 2469]; // x
	var backlog   = [0,0,0,0,0,0,0,0]; // p
	var inventoryHeld = [0,0,0,0,0,0,0,0]; // q
	var totalCosts = 0;
	var costsOfStorage = 0;
	var costsOfShortage = 0;
	
	for(var t = 0; t < 30; t++){

		for(var order = 0; order < demand.length; order++){
			// remove sales from inventory
			inventory[order] -= demand[order][t];
			// add to backlog and inventoryHeld
			if(inventory[order] <= 0){
				backlog[order] = Math.abs(inventory[order]);
				inventoryHeld[order] = 0;
			} else {
				inventoryHeld[order] = inventory[order];
				backlog[order] = 0;
			}
			// charge for backlog
			totalCosts += backlog[order] * shortage;
			costsOfShortage += backlog[order] * shortage;
			// charge for storage
			if(inventory[order] > 0){
				totalCosts += inventory[order] * storage;
			}
		}
		// produce more
		if(dna.producing[t]){
			inventory[producing-1] += production;
		}
		// charge for changing production
		totalCosts += changeCosts[producing-1][dna.production[t]-1];
		// change production
		producing = dna.production[t];
		
	}
	return [totalCosts, dna];
}

function random(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function createRandomDNA(){
	var dna = {
		production: [],
		producing: []
	}
	for( var i = 0; i < 30; i++ ){
		dna.production[i] = random(1,8);
		dna.producing[i] = true;
	}
	return dna;
}

$(document).ready(function(){
	var dna = createRandomDNA();
	var best = checkCost(dna);
	var candidate = '';
	for(var i = 0; i < 1000000; i++){
		candidate = checkCost(createRandomDNA());
		if(candidate[0] < best[0]){
			console.log("new best found:");
			console.log(best);
			console.log(candidate);
			best = candidate;
		}
	}

});
