(function () {
	'use strict';

	angular.module('app').controller('MessageController', ['commService', '$scope',
		function (commService, $scope) {

			var vm = this;
			vm.messages = [];
			vm.submit = submit;
			vm.getGravatar = getGravatar;

			init();

			function init() {

				commService
					.getAll()
					.then(function (messages) {

						vm.messages = messages;

					});

			}

			function submit(email, message) {

				//Set all required fields to touched
				angular.forEach($scope.form.$error.required, function (field) {
					field.$setTouched();
				});

				//Check that the from is valid
				if (!$scope.form.$valid) {
					return;
				}

				commService
					.postNew(email, message)
					.then(init);

				//After submit reset form
				resetFrom();

			}

			function resetFrom() {

				$scope.email = "";
				$scope.message = "";
				angular.forEach($scope.form, function (input) {
					if (input && input.hasOwnProperty('$viewValue')) {
						input.$setUntouched();
					}
				});

			}

			function getGravatar(email) {

				email = email.trim().toLowerCase();
				var hash = md5(email);

				return 'https://www.gravatar.com/avatar/' + hash + '?s=50';

			}

		}]);

})();
