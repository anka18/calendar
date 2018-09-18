 'use strict';

 angular.module('monthApp', [])
    .controller('MonthController', ['$scope', '$http', MonthController]);
            
function MonthController ($scope, $http) {
    $scope.userReservedDay = null;
    $scope.phoneNumber = "";
    // post request
    $scope.statusSendData = {
        'status': null
    }
    // is disable button
    $scope.phoneNumberIsValid = false;
    // get request
    $scope.statusGetData = {
        'status': null
    };

    $scope.$watch('phoneNumber', function() {
        function telephone(tel) {
            // https://stackoverflow.com/questions/12700145/format-telephone-and-credit-card-numbers-in-angularjs
            if (!tel) { return ''; }

            var value = tel.toString().replace(/[^0-9.]/g, '');
            if (value.length > 11) {
                value = value.substr(0, 11);
            }
            if (value.match(/[^0-9]/)) {
                return tel;
            }
            var country, city, number;

            switch (value.length) {
                case 11: // +CPPP####### -> CCC (PP) ###-####
                    country = value[0];
                    city = value.slice(1, 4);
                    number = value.slice(4);
                    $scope.phoneNumberIsValid = true;
                    break;
                default:
                    $scope.phoneNumberIsValid = false;
                    return value;
            }                         
            return ("+" + country + " (" + city + ") " + number).trim();
        }
        $scope.phoneNumber = telephone($scope.phoneNumber);
    });
    
    $scope.clickDay = function (day) {
        if (day.is_reserved == false || day.is_empty == false) {
            if (day.is_user_reserved == undefined) {
                if ($scope.userReservedDay != null) {
                    delete $scope.userReservedDay.is_user_reserved;
                }
                $scope.userReservedDay = day;
                day.is_user_reserved = true;
            } else {
                delete day.is_user_reserved;
                $scope.userReservedDay = null;
            }                   
        }
    }

    $scope.updateData = function () {
        if ($scope.userReservedDay != null && $scope.phoneNumberIsValid == true) {
            delete $scope.userReservedDay.is_user_reserved;
            $scope.userReservedDay.is_reserved = true;

            $http.post('/send_data.php', $scope.months)
                .then(function (response) {
                    if (response.status == 200) {
                        $scope.statusSendData.status = 'success';
                    } else {
                        $scope.statusSendData.status = 'error';
                    }
            });
        }
    }

    $http.get('/months.json')
        .then(function (response) {
            if (response.status == 200) {
                $scope.months = response.data;;
                $scope.statusGetData.status = 'success';
            } else {
                $scope.statusGetData.status = 'error';
            }
    });
} 