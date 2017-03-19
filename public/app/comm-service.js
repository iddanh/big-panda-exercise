(function () {
	'use strict';

	angular.module('app').factory('commService', ['$http',
		function ($http) {

			return {
				getAll: function () {

					return $http.get('/messages')
						.then(function (res) {

							return res.data;

						})
						.catch(function (error) {

							console.error('Error getting messages', error);

						});

				},

				postNew: function (email, message) {

					return $http.post('/messages', {email: email, message: message})
						.then(function (res) {

							return res.data;

						})
						.catch(function (error) {

							console.error('Error posting message', error);

						});

				}
			};

		}]);

})();
