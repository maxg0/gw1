function test(){
	return true;
}
function checkCost(dna){
	var inventory = startInventory.slice(0); // x
	var backlog   = [0,0,0,0,0,0,0,0]; // p
	var inventoryHeld = [0,0,0,0,0,0,0,0]; // q
	var costsOfStorage = 0;
	var costsOfShortage = 0;
	var totalCosts = 0;
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
		// TODO no charging if no production took place last time,
		// so dont do this if dna.producing[t-1] is false(?)
		totalCosts += changeCosts[producing-1][dna.production[t]-1]; // cannot read property of undefined error on this line
		// change production
		producing = dna.production[t];
		
	}
	return {
		cost: totalCosts,
		dna: dna,
		inventory: inventory
	};
}

