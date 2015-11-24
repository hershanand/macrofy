angular.module('macrofy')

.service('SearchLocation', function(RestaurantSearch, geolocation, NutritionSearch) {
	var self = this;
	
	self.getFoodsForPosition = function(searchCriteria, resturantList, onCompletion /*function that wants foods*/) {
		geolocation.getLocation()
		.then(function(data){
			var coords = {lat:data.coords.latitude, long:data.coords.longitude};       
			var position = new google.maps.LatLng(coords.lat, coords.long);
			self.finalData = [];
			RestaurantSearch.findRestuarantsNearMe(position, function(restaurants) {
			
				for(var i=0; i < restaurants.length; ++i) {
					for (var j=0; j<restaurants[i].length; j++) {
						for(var k=0; k<resturantList.length; k++){
							if (restaurants[i][j].name == resturantList[k]){
								resturantList.splice(k, 1);
								// call the nutrition api
								//console.log(restaurants[i][j]);
								NutritionSearch.getFoods(searchCriteria, restaurants[i][j].name, function(response){
									// process foods that were returned

									//console.log(response);
									var food = response.hits;
									console.log('Nutrition IX results: ');
									console.log(food);

									for (var i=0;i<food.length;i++){
										if((food[i].fields.nf_total_fat <= (searchCriteria.userFats+5) && 
										   food[i].fields.nf_protein <= searchCriteria.userProtein &&
										   food[i].fields.nf_total_carbohydrate <= searchCriteria.userCarbs) ||
										  (food[i].fields.nf_total_fat <= searchCriteria.userFats && 
										   food[i].fields.nf_protein <= (searchCriteria.userProtein+5) &&
										   food[i].fields.nf_total_carbohydrate <= searchCriteria.userCarbs) ||
										  (food[i].fields.nf_total_fat <= searchCriteria.userFats && 
										   food[i].fields.nf_protein <= searchCriteria.userProtein &&
										   food[i].fields.nf_total_carbohydrate <= (searchCriteria.userCarbs+5))){
											// store data in an array
											self.finalData.push(food[i]);
										}
									}
									console.log('Filtered data: ');
									console.log(self.finalData);
									//onCompletion(self.finalData);

								});
							}
						}
					}
				}
			console.log('Google Places: ');
			console.log(restaurants);
			});
		});
	
	};
})

.service('NutritionSearch', function($resource) {
	var self = this;
	self.getFoods = function(userMacros, brandName, callback){
		console.log(userMacros);
		//NutritionIX API key & ID
		var appKey = '9b847fd23a800829496fb73d1abc5b8b';
		var appId = '25d94531';
		var calories = userMacros.userFats*9 + userMacros.userCarbs*4 + userMacros.userProtein*4;
		var cal_min = calories - (calories*(1/4));
		var foodSearch = $resource('https://api.nutritionix.com/v1_1/search/'+brandName, null, {
			query: {
				method: 'GET',
				isArray: false,
				params: {
							'results': '0:20',
							'type': '1',
							'cal_max': calories,
							'cal_min': cal_min,
							'fields': 'item_name,brand_name,item_id,brand_id,item_type,nf_calories,nf_protein,nf_total_carbohydrate,nf_total_fat',
							'appKey': appKey,
							'appId': appId,
							'filters': {
								'item_type': 1
							}
				}
			}
		});
		console.log('Total calorie is: '+calories);
		foodSearch.query(null, function(response){
			callback(response);
		});
	};
})

.factory('RestaurantSearch', function(){     
	return {
		findRestuarantsNearMe: function (myPosition, callback) {
			var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
			var params = {
				location: myPosition,
				radius: 320,
				types: ['restaurant']
			};
			var finalResults = [];
			
			function processResults(results, status, pagination){
				console.log(results);
				finalResults.push(results);
				if(pagination.hasNextPage){
					pagination.nextPage();
				} else {
					callback(finalResults);
				}
				
			}

			map = new google.maps.Map(document.getElementById('map-canvas'), {
				center: myPosition,
				zoom: 15
			});

			var service = new google.maps.places.PlacesService(map);
			service.nearbySearch(params, processResults);
		}
	};
});