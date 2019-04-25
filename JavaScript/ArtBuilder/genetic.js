// JavaScript Document
/*jshint evil:true */
/*jshint loopfunc: true */
/*jshint esversion: 6 */


class LayerRules{
	constructor(minBot, maxBot, minTop, maxTop, minLeft, maxLeft, minRight, maxRight, height, width){
		this.minBot = minBot;
		this.maxBot = maxBot;
		this.minTop = minTop;
		this.maxTop = maxTop;
		this.minLeft = minLeft;
		this.maxLeft = maxLeft;
		this.minRight = minRight;
		this.maxRight = maxRight;
		this.height = height;
		this.width = width;
	}
}

class ImageLibrary{
	constructor(){	
		this.image = image;
		this.sky = sky;
		this.ground= ground;
		this.light = light;
	}

	getLocation(imageID){
		return this.image[imageID][1];
	}

	getAttributes(imageID){
		return this.image[imageID][2];
	}
}

class SceneAsset{
	constructor(imageID, library, skyorground){
		this.imageID = imageID;
		if(skyorground==="ground"){
			this.imageLocation = library.ground[imageID][1];
			this.imageAttributes = library.ground[imageID][2];
		}
		else if(skyorground ==="sky"){
			this.imageLocation = library.sky[imageID][1];
			this.imageAttributes = library.sky[imageID][2];
		}
		else if(skyorground==="light"){
			this.imageLocation = library.light[imageID][1];
			this.imageAttributes = library.light[imageID][2];
		}
		else{
			this.imageLocation = library.image[imageID][1];
			this.imageAttributes = library.image[imageID][2];
		}
		this.bottom = null;
		this.top = null;
		this.left = null;
		this.right = null;
		this.height = null;
		this.width = null;
	}

	setBottom(percentageFrom){
		this.bottom = percentageFrom;
	}

	setTop(percentageFrom){
		this.top = percentageFrom;
	}

	setLeft(percentageFrom){
		this.left = percentageFrom;
	}

	setRight(percentageFrom){
		this.right = percentageFrom;
	}

	setHeight(percentageFrom){
		this.height = percentageFrom;
	}

	setWidth(percentageFrom){
		this.width = percentageFrom;
	}
}

class Layer{
	constructor(){
		this.layerImages = [];
	}

	addImage(SceneAsset){
		this.layerImages.push(SceneAsset);
	}

	getNumOfImages(){
		return this.layerImages.length;
	}
}

class DNA{
	constructor(layers){
		this.numLayers = layers.length;

		this.skyRules = new LayerRules(null, null, 0, 0, 0, 0, null, null, 30, 100);
		this.lightRules = new LayerRules(null, null, 0, 30, 0, 30, null, null, null, null);
		this.cloudRules = new LayerRules(null, null, 0, 20, 0, 60, null, null, null, null);
		this.groundRules = new LayerRules(0, 0, null, null, 0, 0, 70, 100);
		this.backgroundRules = new LayerRules(50, 50, null, null, 0, 100, null, null, null, null);
		this.treeRules = new LayerRules(10, 50, null, null, 0, 100, null, null, null, null);
		this.floraRules = new LayerRules(10, 50, null, null, 0, 100, null, null, null, null);
		this.platformRules = new LayerRules(10, 50, null, null, 0, 100, null, null, null, null);

		this.order = ["flora", "light", "flora", "tree", "flora", "tree", "flora", "platform", "flora", "flora", "cloud", "ground", "sky"];

		this.templateRules = [
			this.floraRules,
			this.lightRules,
			this.floraRules,
			this.treeRules,
			this.floraRules,
			this.treeRules,
			this.floraRules,
			this.platformRules,
			this.floraRules,
			this.floraRules,
			this.cloudRules,
			this.groundRules,
			this.skyRules
		];

		this.numPerLayerAllowed = [3,1,1,7,1,5,1,1,3,1,3,1,1];

		this.library = new ImageLibrary();

		this.layers = layers;
	}
	getNumOfImagesInLayer(layerID){
		return this.layers[layerID].getNumOfImages();
	}

	addImageAsset(layer, asset){
		this.layers[layer].addImage(asset);
	}

	generateHeight(layer){
		return this.templateRules[layer].height;
	}

	generateWidth(layer){
		return this.templateRules[layer].width;
	}

	generateTop(layer){
		var top = null;
		var layerType = this.templateRules[layer];
		if(layerType.minTop !== null && layerType.maxTop !== null){
			var max = layerType.maxTop;
			var min = layerType.minTop;
			top = Math.floor((Math.random() * max) + min);
		}
		return top;
	}

	generateBottom(layer){
		var bot = null;
		var layerType = this.templateRules[layer];
		if(this.order[layer]==="ground"){
			return 0;	
		}
		if(this.order[layer]==="sky"){
			return 70;
		}
		if(layerType.minBot !== null && layerType.maxBot !== null){
			var max = 5 * layer;
			var min = (layer - 1) * 5;
			bot = Math.floor(Math.random() * (max - min) + min);
		}

		return bot;
	}

	generateLeft(layer){
		var left = null;
		var layerType = this.templateRules[layer];
		if(layerType.minLeft !== null && layerType.maxLeft !== null){
			var max = layerType.maxLeft;
			var min = layerType.minLeft;
			left = Math.floor((Math.random() * max) + min);
		}
		return left;
	}

	generateRight(layer){
		var right = null;
		var layerType = this.templateRules[layer];
		if(layerType.minRight !== null && layerType.maxRight !== null){
			var max = layerType.maxRight;
			var min = layerType.minRight;
			right = Math.floor((Math.random() * max) + min);
		}
		return right;
	}
}

var reattachMethods = function(serialized,originalclass) {
	"use strict";
	serialized.__proto__ = originalclass.prototype; 
};

var Genetic = Genetic || (function(){
'use strict';	

// facilitates communcation between web workers
var Serialization = {
	"stringify": function (obj) {
		return JSON.stringify(obj, function (key, value) {
			if (value instanceof Function || typeof value === "function") {return "__func__:" + value.toString();}
			if (value instanceof RegExp) {return "__regex__:" + value;}
			return value;
		});
	}, "parse": function (str) {
		return JSON.parse(str, function (key, value) {
			if (typeof value !== "string") {return value;}
			if (value.lastIndexOf("__func__:", 0) === 0) {return eval('(' + value.slice(9) + ')');}
			if (value.lastIndexOf("__regex__:", 0) === 0) {return eval('(' + value.slice(10) + ')');}
			return value;
		});
	}
};

var Clone = function(obj) {
	if (obj === null || typeof obj !== "object"){
		return obj;
	}

	return JSON.parse(JSON.stringify(obj));
};

var Optimize = {
	"Maximize": function (a, b) { return a >= b; },
	"Minimize": function (a, b) { return a < b; }
};

var Select1 = {
	"Tournament2": function(pop) {
		var n = pop.length;
		var a = pop[Math.floor(Math.random()*n)];
		var b = pop[Math.floor(Math.random()*n)];
		return this.optimize(a.fitness, b.fitness) ? a.entity : b.entity;
	}, "Tournament3": function(pop) {
		var n = pop.length;
		var a = pop[Math.floor(Math.random()*n)];
		var b = pop[Math.floor(Math.random()*n)];
		var c = pop[Math.floor(Math.random()*n)];
		var best = this.optimize(a.fitness, b.fitness) ? a : b;
		best = this.optimize(best.fitness, c.fitness) ? best : c;
		return best.entity;
	}, "Fittest": function (pop) {
		return pop[0].entity;
	}, "Random": function (pop) {
		return pop[Math.floor(Math.random()*pop.length)].entity;
	}, "RandomLinearRank": function (pop) {
		this.internalGenState.rlr = this.internalGenState.rlr||0;
		return pop[Math.floor(Math.random()*Math.min(pop.length,(this.internalGenState.rlr++)))].entity;
	}, "Sequential": function (pop) {
		this.internalGenState.seq = this.internalGenState.seq||0;
		return pop[(this.internalGenState.seq++)%pop.length].entity;
	}
};

var Select2 = {
	"Tournament2": function(pop) {
		return [Select1.Tournament2.call(this, pop), Select1.Tournament2.call(this, pop)];
	}, "Tournament3": function(pop) {
		return [Select1.Tournament3.call(this, pop), Select1.Tournament3.call(this, pop)];
	}, "Random": function (pop) {
		return [Select1.Random.call(this, pop), Select1.Random.call(this, pop)];
	}, "RandomLinearRank": function (pop) {
		return [Select1.RandomLinearRank.call(this, pop), Select1.RandomLinearRank.call(this, pop)];
	}, "Sequential": function (pop) {
		return [Select1.Sequential.call(this, pop), Select1.Sequential.call(this, pop)];
	}, "FittestRandom": function (pop) {
		return [Select1.Fittest.call(this, pop), Select1.Random.call(this, pop)];
	}
};

function Genetic() {

	// population
	this.fitness = null;
	this.seed = null;
	this.mutate = null;
	this.crossover = null;
	this.select1 = null;
	this.select2 = null;
	this.optimize = null;
	this.generation = null;
	this.notification = null;


	this.configuration = {
		"size": 250,
		"crossover": 0.9,
		"mutation": 0.2,
		"iterations": 100,
		"fittestAlwaysSurvives": true,
		"maxResults": 100,
		"webWorkers": true,
		"skip": 0
	};

	this.userData = {};
	this.internalGenState = {};

	this.entities = [];

	this.usingWebWorker = false;

	this.start = function() {

		var i;
		var self = this;

		function mutateOrNot(entity) {
			// applies mutation based on mutation probability
			return Math.random() <= self.configuration.mutation && self.mutate ? self.mutate(Clone(entity)) : entity;
		}

		// seed the population
		for (i=0;i<this.configuration.size;++i)  {
			this.entities.push(Clone(this.seed()));
		}

		for (i=0;i<this.configuration.iterations;++i) {
			// reset for each generation
			this.internalGenState = {};

			// score and sort
			var pop = this.entities
				.map(function (entity) {
					return {"fitness": self.fitness(entity), "entity": entity };
				})
				.sort(function (a, b) {
					return self.optimize(a.fitness, b.fitness) ? -1 : 1;
				});

			// generation notification
			var mean = pop.reduce(function (a, b) { return a + b.fitness; }, 0)/pop.length;
			var stdev = Math.sqrt(pop
				.map(function (a) { return (a.fitness - mean) * (a.fitness - mean); })
				.reduce(function (a, b) { return a+b; }, 0)/pop.length);

			var stats = {
				"maximum": pop[0].fitness,
				"minimum": pop[pop.length-1].fitness,
				"mean": mean,
				"stdev": stdev
			};

			var r = this.generation ? this.generation(pop, i, stats) : true;
			var isFinished = (typeof r !== "undefined" && !r) || (i === this.configuration.iterations-1);

			if (
				this.notification &&
				(isFinished || this.configuration.skip === 0 || i%this.configuration.skip === 0)
			) {
				this.sendNotification(pop.slice(0, this.maxResults), i, stats, isFinished);
			}

			if (isFinished){
				break;
			}

			// crossover and mutate
			var newPop = [];

			if (this.configuration.fittestAlwaysSurvives){ // lets the best solution fall through
				newPop.push(pop[0].entity);
			}

			while (newPop.length < self.configuration.size) {
				if (
					this.crossover && // if there is a crossover function
					Math.random()  <= this.configuration.crossover && // base crossover on specified probability
					newPop.length+1 < self.configuration.size) // keeps us from going 1 over the max population size
				 {
					var parents = this.select2(pop);
					var children = this.crossover(Clone(parents[0]), Clone(parents[1])).map(mutateOrNot);
					newPop.push(children[0], children[1]);
				} else {
					newPop.push(mutateOrNot(self.select1(pop)));
				}
			}

			this.entities = newPop;
		}
	};

	this.sendNotification = function(pop, generation, stats, isFinished) {
		var response = {
			"pop": pop.map(Serialization.stringify),
			"generation": generation,
			"stats": stats,
			"isFinished": isFinished
		};


		if (this.usingWebWorker) {
			postMessage(response);
		} else {
			// self declared outside of scope
			self.notification(response.pop.map(Serialization.parse), response.generation, response.stats, response.isFinished);
		}

	};
}

Genetic.prototype.evolve = function(config, userData) {

	var k;
	for (k in config) {
		this.configuration[k] = config[k];
	}

	for (k in userData) {
		this.userData[k] = userData[k];
	}

	// determine if we can use webworkers
	this.usingWebWorker = this.configuration.webWorkers&&
		 typeof Blob !== "undefined"&&
		 typeof Worker !== "undefined"&&
		 typeof window.URL !== "undefined"&&
		 typeof window.URL.createObjectURL !== "undefined";

	function addslashes(str) {
		return str.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
	}

	// bootstrap webworker script
	var blobScript = "'use strict'\n";
	blobScript += "var Serialization = {'stringify': " + Serialization.stringify.toString() + ", 'parse': " + Serialization.parse.toString() + "};\n";
	blobScript += "var Clone = " + Clone.toString() + ";\n";

	// make available in webworker
	blobScript += "var Optimize = Serialization.parse(\"" + addslashes(Serialization.stringify(Optimize)) + "\");\n";
	blobScript += "var Select1 = Serialization.parse(\"" + addslashes(Serialization.stringify(Select1)) + "\");\n";
	blobScript += "var Select2 = Serialization.parse(\"" + addslashes(Serialization.stringify(Select2)) + "\");\n";

	blobScript += "var Layer = Serialization.parse(\"" + addslashes(Serialization.stringify(Layer)) + "\");\n";
	blobScript += "var LayerRules = Serialization.parse(\"" + addslashes(Serialization.stringify(LayerRules)) + "\");\n";
	blobScript += "var ImageLibrary = Serialization.parse(\"" + addslashes(Serialization.stringify(ImageLibrary)) + "\");\n";
	blobScript += "var SceneAsset = Serialization.parse(\"" + addslashes(Serialization.stringify(SceneAsset)) + "\");\n";
	blobScript += "var DNA = Serialization.parse(\"" + addslashes(Serialization.stringify(DNA)) + "\");\n";
	blobScript += "var reattachMethods = Serialization.parse(\"" + addslashes(Serialization.stringify(reattachMethods)) + "\");\n";
	blobScript += "var image = Serialization.parse(\"" + addslashes(Serialization.stringify(image)) + "\");\n";
	blobScript += "var sky = Serialization.parse(\"" + addslashes(Serialization.stringify(sky)) + "\");\n";
	blobScript += "var ground = Serialization.parse(\"" + addslashes(Serialization.stringify(ground)) + "\");\n";
	blobScript += "var light = Serialization.parse(\"" + addslashes(Serialization.stringify(light)) + "\");\n";


	// materialize our ga instance in the worker
	blobScript += "var genetic = Serialization.parse(\"" + addslashes(Serialization.stringify(this)) + "\");\n";
	blobScript += "onmessage = function(e) { genetic.start(); }\n";

	var self = this;

	if (this.usingWebWorker) {
		// webworker
		var blob = new Blob([blobScript]);
		var worker = new Worker(window.URL.createObjectURL(blob));
		worker.onmessage = function(e) {
		  var response = e.data;
		  self.notification(response.pop.map(Serialization.parse), response.generation, response.stats, response.isFinished);
		};
		worker.onerror = function(e) {
			alert('ERROR: Line ' + e.lineno + ' in ' + e.filename + ': ' + e.message);
		};
		worker.postMessage("");
	} else {
		// simulate webworker
		(function(){
			var onmessage;
			eval(blobScript);
			onmessage(null);
		})();
	}
};

return {
	"create": function() {
		return new Genetic();
	}, "Select1": Select1,
	"Select2": Select2,
	"Optimize": Optimize,
	"Clone": Clone

};

})();