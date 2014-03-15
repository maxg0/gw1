function checkCost(dna){
	producing = 8;
	var inventory = startInventory.slice(0); // x
	var backlog   = [0,0,0,0,0,0,0,0]; // p
	var inventoryHeld = [0,0,0,0,0,0,0,0]; // q
	var storageCosts = 0;
	var shortageCosts = 0;
	var setupCosts = 0;
	var totalCosts = 0;
	var thisRound = 0;

	for(var t = 0; t < 30; t++){
		// change production
		producing = dna.production[t];
		// produce more
		if(producing != 0){
			inventory[producing-1] += production;
		}
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
			if(inventory[order] < 0){
				shortageCosts += (backlog[order] * shortage);
			}
			// charge for storage
			if(inventory[order] > 0){
				storageCosts += (inventoryHeld[order] * storage);
			}
		}
		// charge for changing production
		if(dna.production[t] != 0 && dna.production[t-1] != 0){
			if(t >= 1){
				try{
				setupCosts += changeCosts[dna.production[t-1]-1][dna.production[t]-1];
				} catch (e){
					dbg(e);
				}
			} else {
				setupCosts += changeCosts[7][dna.production[t]-1];
			}
		}
	}
	totalCosts = storageCosts + shortageCosts + setupCosts;
	return {
		"cost": totalCosts,
		"dna": dna
	};
}
