// JavaScript Document
/*jshint evil:true */
/*jshint loopfunc: true */
/*jshint esversion: 6 */

var genetic = Genetic.create();

genetic.optimize = Genetic.Optimize.Maximize;
genetic.select1 = Genetic.Select1.Tournament2;
genetic.select2 = Genetic.Select2.Tournament3;

genetic.seed = function() {
	"use strict";	
	
	//a solution
	var layers = new Array(13);
		for(var p = 0; p<13; p++){
			let newlayer =  new Layer();
			layers[p] = newlayer;
		}

	var dna = new DNA(layers);
	
	//insert pictures into each layer
	for(var index=0; index < dna.layers.length; index++){
		
		//figure out how many images to put in  this layer
		var numImages = 1 + Math.floor(Math.random() * dna.numPerLayerAllowed[index]);
		
		//create images
		for(var y=0; y<numImages;y++){
			
			//pick image ID based on layer type
			if(dna.order[index]==="sky"){
				
				var imageID = Math.floor(Math.random() * dna.library.sky.length);
				console.log(imageID);
				var img = new SceneAsset(imageID, dna.library, "sky");
			}
			else if(dna.order[index]==="ground"){
				var imageID = Math.floor(Math.random() * dna.library.ground.length);
				var img = new SceneAsset(imageID, dna.library, "ground");
			}
			else if(dna.order[index]==="light"){
				var imageID = Math.floor(Math.random() * dna.library.light.length);
				var img = new SceneAsset(imageID, dna.library, "light");
			}
			else{
				var imageID = Math.floor(Math.random() * dna.library.image.length);
				var img = new SceneAsset(imageID, dna.library);
			}

			img.setHeight(dna.generateHeight(index));
			img.setWidth(dna.generateWidth(index));
			img.setBottom(dna.generateBottom(index));
			img.setTop(dna.generateTop(index));
			img.setLeft(dna.generateLeft(index));
			img.setRight(dna.generateRight(index));
			
			dna.addImageAsset(index,img);
		}
		
	}	
	return dna;
};

genetic.mutate = function(dna) {
    "use strict";
    function mutateChromosome(dna, index) {
		
		reattachMethods(dna, DNA);
		dna.layers[index] = new Layer();
		var numImages = 1 + Math.floor(Math.random() * dna.numPerLayerAllowed[index]);
		
		//create images
		for(var y=0; y<numImages;y++){
			
			//pick image ID based on layer type
			if(dna.order[index]==="sky"){
				var imageID = Math.floor(Math.random() * dna.library.sky.length);
				var img = new SceneAsset(imageID, dna.library, "sky");
			}
			else if(dna.order[index]==="ground"){
				var imageID = Math.floor(Math.random() * dna.library.ground.length);
				var img = new SceneAsset(imageID, dna.library, "ground");
			}
			else if(dna.order[index]==="light"){
				var imageID = Math.floor(Math.random() * dna.library.light.length);
				var img = new SceneAsset(imageID, dna.library, "light");
			}
			else{
				var imageID = Math.floor(Math.random() * dna.library.image.length);
				var img = new SceneAsset(imageID, dna.library);
			}

			img.setHeight(dna.generateHeight(index));
			img.setWidth(dna.generateWidth(index));
			img.setBottom(dna.generateBottom(index));
			img.setTop(dna.generateTop(index));
			img.setLeft(dna.generateLeft(index));
			img.setRight(dna.generateRight(index));
			
			dna.addImageAsset(index,img);
		}
		//dna[i]=Math.floor(Math.random() * dna.library.image.length);
        return dna;
    }
    
    // chromosomal drift
    var i = Math.floor(Math.random()*(dna.numLayers));  
    return mutateChromosome(dna, i);
};

genetic.crossover = function(mother, father) {
	"use strict";
    // two-point crossover
    var len = mother.length;
    var ca = Math.floor(Math.random()*len);
    var cb = Math.floor(Math.random()*len);     
    if (ca > cb) {
        var tmp = cb;
        cb = ca;
        ca = tmp;
    }
	
    var son = father.layers.slice(0,ca).concat(mother.layers.slice(ca, cb-ca).concat(father.layers.slice(cb)));
    var daughter = mother.layers.slice(0,ca).concat(father.layers.slice(ca, cb-ca).concat(mother.layers.slice(cb))) ;
    
    return [new DNA(son), new DNA(daughter)];
};

genetic.fitness = function(dna) {
	"use strict";
	
    var fitness = 0;
	var solution = genetic.userData.solution;
	
	//validate sky
	var sky = dna.layers[dna.layers.length -1].layerImages[0].imageAttributes;
	if(sky.indexOf("sky") !== -1){
		fitness +=1;
	}
	else{
		fitness -=1;
	}
	if(sky.indexOf(solution.time)!==-1){
		fitness +=1;
	}
	else{
		fitness-=1;
	}
	if(sky.indexOf(solution.setting)!==-1){
		fitness +=1;
	}
	else{
		fitness-=1;
	}
			

	//validate ground
	var ground = dna.layers[dna.layers.length -2].layerImages[0].imageAttributes;

	if(ground.indexOf("ground") !== -1){
		fitness +=1;
	}
	else{
		fitness -=1;
	}
	if(ground.indexOf(solution.material)!==-1){
		fitness +=1;
	}
	else{
		fitness-=1;
	}
	
	//look at each layer
	for(var i = 0; i < dna.layers.length ; i++){
		var len = dna.layers[i].layerImages.length ;
		
		
		//look at each image in that layer
		for(var x=0;x<len;x++){

			var attributes = dna.layers[i].layerImages[x].imageAttributes;
			
			//increase fitness if image matches theme
			if(attributes.indexOf(solution.theme)!==-1){
			   fitness ++;
			}
			else{
				fitness--;
			}
			
			//increase fitness if image matches scene
			if(attributes.indexOf(solution.setting)!==-1){
			   fitness ++;
			}
			
			//If theres a ground or a sky image where there shouldn't be
			if(!(dna.order[i] === "sky" || dna.order[i]==="ground") && (attributes.indexOf("sky")!==-1 || attributes.indexOf("ground")!==-1)){
				fitness -= 100;
			}//increase fitness if image is in correct layer
			else if(attributes.indexOf(dna.order[i])!==-1){
				fitness++;
			}
			else{
				fitness--;
			}
			
		}
		
	}
	dna.fitness = fitness;
    return fitness;
};

genetic.notification = function(pop, generation) {
	"use strict";

	var dna = pop[0].entity;
	reattachMethods(dna, DNA);
	$("#loading").html("<img src='../DesignImages/loading.gif' style='opacity:0.8; border-radius:8px;'>");
	$("#results").html("<h3>Generation: " + generation + " Fitness Score: " + dna.fitness+"</h3>");
	$("#levelBody").html("");
	for(var i=0; i<dna.numLayers; i++){
		
		$("#levelBody").append("<div id='" + i + "'class='Asset' style='z-index:" + (dna.numLayers - i )+ "'></div>");
		
		var len = dna.layers[i].layerImages.length ;
		for(var x = 0; x<len; x++){
			var bottom = "";
			var top ="";
			var left = "";
			var right = "";
			var height = "";
			var width = "";

			var workingImage = dna.layers[i].layerImages[x];
			reattachMethods(workingImage, SceneAsset);
			
			if(workingImage.bottom !== null){
				bottom ="bottom: " + workingImage.bottom + "%;";
			}
			if(workingImage.top !== null){
				top ="top: " + workingImage.top + "%;";
			}
			if(workingImage.left !== null){
				left ="left: " + workingImage.left + "%;";
			}
			if(workingImage.right !== null){
				right ="right: " + workingImage.right + "%;";
			}
			if(workingImage.height !== null){
				height ="bottom: " + workingImage.height + "%;";
			}
			if(workingImage.width !== null){
				width ="width: " + workingImage.width + "%;";
			}
			var style = bottom + top + left + right + height + width;
			  
			eval("$(\"#" + i + "\").append(\"<img src='" + workingImage.imageLocation + "' style = '" + style + "'>\")");

		}
		
	}
	
};


function runner(solution, population, mutation, crossover){
	"use strict";
		var config = {
		"size": population,
		"crossover": crossover,
		"iterations": 1000,
		"mutation": mutation,
		"webWorkers": true
	};
	
	var userData = {
		"solution": solution
	};
	$("#seeder").html("<h1>Seeding</h1>");
	genetic.evolve(config, userData);
}
