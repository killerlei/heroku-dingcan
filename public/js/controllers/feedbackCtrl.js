define(['app', 'storageUtils'], function (app, storageUtils) {
    return app.controller('feedbackCtrl', ['$scope','$rootScope','serverService',
        function ($scope, $rootScope, serverService) {

            $rootScope.headTitle = "意见反馈";

            var user = storageUtils.local.getItem(storageUtils.USER_KEY);

            $scope.feedback = {
                user_id : user._id,
                phone : user.phone
            };

            $scope.submit = function () {
                serverService.feedback($scope.feedback)
                    .then(
                        result => {
                            alert('吐槽成功!');
                            window.location = '#/personal';
                        },
                        () => alert('吐槽失败!')
                    );
            }
    }])
})