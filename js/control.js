var app = angular.module("maintenance", ['ui.bootstrap', 'LocalStorageModule']);

app.filter('startFrom', function() {
    return function(input, start) {
        if (input) {
            start = +start; //parse to int
            return input.slice(start); //fnc cut text
        }
        return [];
    }
});
app.config(function(localStorageServiceProvider, $locationProvider) {
    localStorageServiceProvider.setStorageCookie(45, '/');

    // $locationProvider.html5Mode(true);
});

app.controller("Ctrl", function($scope, $rootScope, $http, $timeout, $modal, $log, $filter, $location, localStorageService) {
    get();
    login();
    $scope.alerts = [];

    $scope.tabs = [{
        title: 'หน้าหลัก',
        url: 'include/home.tpl.html'
    }, {
        title: 'แบบฟอร์มแจ้งซ่อม',
        url: 'include/forms.tpl.html'
    }];
    var manager = { title: 'การจัดการระบบ', url: 'include/admin.tpl.html' };

    if ($scope.user && $scope.tabs.indexOf(manager) == -1) { $scope.tabs.push(manager); }

    $scope.currentTab = 'include/home.tpl.html';

    $scope.onClickTab = function(tab) {
        $scope.currentTab = tab.url;
        var data = { title: tab.title };
        //$locationProvider.html5Mode(true).
        //$window.history.replaceState(data, tab.title, tab.url.split('/').slice(-1)[0]);
        //$location.path(tab.url.split('/').slice(-1)[0]);
        history.pushState(data, tab.title, tab.url.split('/').slice(-1)[0]);
    }
    $rootScope.$on('$routeChangeStart', function(event) {
        event.preventDefault();
    });

    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    }

    function get() {
        $http.get("ajax/get.php").success(function(data) {
            $scope.tasks = data;

            $scope.totalItems = $scope.tasks.length;
            $scope.currentPage = 1; //current page
            $scope.entryLimit = 10; //max no of items to display in a page

            $scope.filteredItems = $scope.tasks.length; //initially for no filter
            //console.log(data);
        });
        $scope.setPage = function(pageNo) {
            $scope.currentPage = PageNo;
        };
        $scope.pageChanged = function() {
            $log.log('Page changed to:' + $scope.currentPage);
        }
        $scope.filter = function() {
            $timeout(function() {
                $scope.filteredItems = $scope.filtered.length;
            }, 10);
        };
        $scope.sort_by = function(predicate) {
            $scope.predicate = predicate;
            $scope.reverse = !$scope.reverse;
        };
    }
    $scope.save = function(isValid) {
        //console.log(angular.element(document.querySelector('#contact')).val())

        if (angular.element(document.querySelector('#g')).val().length == 0) {
            var alert = { type: 'success', msg: 'ฉันไม่ใช้โปรแกรมอัตโนมัตใช้หรือไม่!!' };

            $scope.alerts.push(alert);
            $timeout(function() {
                $scope.alerts.splice($scope.alerts.indexOf(alert), 1);
                console.log($scope.alerts.indexOf(alert));
            }, 5000); // maybe '}, 3000, false);' to avoid calling apply

        } else {

            if (isValid) {
                var request = $http({
                    method: "post",
                    url: "ajax/add.php",
                    data: {
                        contact: angular.element(document.querySelector('#contact')).val(),
                        symptom: angular.element(document.querySelector('#symptom')).val(),
                        agency: angular.element(document.querySelector('#agency')).val(),
                        location: angular.element(document.querySelector('#location')).val(),
                        recapcha: angular.element(document.querySelector('#g')).val()
                    },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
                request.success(function(data) {
                    console.log(data);
                    if (data == 1) {
                        //alert("Saved!");
                        var alert = { type: 'success', msg: 'ระบบได้ทำการบันทึกข้อมูลเรียบร้อยแล้ว!' };
                        $scope.alerts.push(alert);
                        $timeout(function() {
                            $scope.alerts.splice($scope.alerts.indexOf(alert), 1);
                            console.log($scope.alerts.indexOf(alert));
                        }, 5000); // maybe '}, 3000, false);' to avoid calling apply
                        get();
                        $scope.currentTab = 'include/home.tpl.html';
                    } else {
                        angular.element(document.querySelector('#message')).html(data);
                        //console.log(data);
                    }
                });
            }
        }
    };
    $scope.open = function(size) {
        var modalInstance = $modal.open({
            templateUrl: 'dialog/login.html',
            size: 'sm',
            controller: function($scope, $modalInstance, $log, $http, user, localStorageService) {
                $scope.user = user;

                $scope.login = function(user, isValid) {
                    if (!isValid) {
                        $scope.error = "Username or Password Required!";
                        return false;
                    }
                    //$log.log('Submiting user info.');
                    // $log.log(JSON.stringify($scope.user));
                    var request = $http({
                        method: 'post',
                        url: 'ajax/login.php',
                        data: { user: $scope.user },
                        header: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    });
                    request.success(function(data) {
                        if (data == 0) {
                            $scope.error = "Username or Password Incorrect!";
                        } else {
                            $scope.error = "";
                            //console.log(localStorageService.get('user'));
                            if ($scope.user.checked) {
                                localStorageService.cookie.set('user', data);
                                $modalInstance.close(localStorageService.cookie.get('user'));
                                //alert('checked');
                            } else {
                                localStorageService.set('user', data);
                                $modalInstance.close(localStorageService.get('user'));
                            }
                            $log.info(data.username + ' Logging at' + new Date());
                            //alert("Saved!");
                        }
                    });

                };
                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                };
            },
            resolve: {
                user: function() {
                    return $scope.user;
                }
            }
        });
        modalInstance.result.then(function(user) {
            $scope.user = user;
            $scope.tabs.push(manager);
            var msg = "ยินดีต้อนรับคุณเจ้าหน้าที่ คุณได้เข้าระบบเมื่อ " + $filter('date')(new Date(), 'HH:mm:ss yyyy-MM-dd Z');
            var alert2 = { type: 'success', msg: msg };
            $scope.alerts.push(alert2);
            $timeout(function() {
                $scope.alerts.splice($scope.alerts.indexOf(alert2), 1);
                console.log($scope.alerts.indexOf(alert2));
            }, 5000); // maybe '}, 3000, false);' to avoid calling apply
        });
    };

    function login() {
        if (localStorageService.get('user')) {
            $scope.user = localStorageService.get('user');
        }
        if (localStorageService.cookie.get('user')) {
            $scope.user = localStorageService.cookie.get('user');
        }
    }
    $scope.logout = function() {
        if (localStorageService.remove('user')) {
            $scope.user = localStorageService.get('user');
        }
        if (localStorageService.cookie.remove('user')) {
            $scope.user = localStorageService.cookie.get('user');
        }
        $scope.tabs.splice($scope.tabs.indexOf(manager), 1);
        $scope.currentTab = 'include/home.tpl.html';
    }
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.editStatus = function(id) {
        modalInstance = $modal.open({
            templateUrl: 'dialog/status.html',
            size: 'sm',
            controller: function($scope, $modalInstance) {
                $scope.options = [
                    { label: 'รอดำเนินการ', value: 0 },
                    { label: 'ดำเนินการเสร็จสิ้น', value: 1 }
                ];

                $http({
                    method: 'post',
                    url: 'ajax/getStatus.php',
                    data: { id: id },
                    header: { 'Content-Type': 'application/x-www-form-urlencoded' },
                }).success(function(response) {
                    $scope.status = $scope.options[response.status];
                    console.log(response.status);
                });

                $scope.save = function(status) {
                    $http({
                        method: 'post',
                        url: 'ajax/saveStatus.php',
                        data: { id: id, status: status.value },
                        header: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    }).success(function(response) {
                        if (response == 1) {
                            $modalInstance.dismiss('cancel');
                            get();
                        } else {

                            console.log(data);
                        }
                    });
                }
                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                }
            }
        });
    };
    $scope.viewStatus = function(id) {
        $http({
            method: 'post',
            url: 'ajax/view.php',
            data: { id: id },
            header: { 'Content-Type': 'application/x-www-form-urlendcoded' }
        }).success(function(response) {
            //console.log(response);
            var modalInstance = $modal.open({
                templateUrl: 'dialog/view.html',
                controller: function($scope, $modalInstance) {
                    $scope.row = response;
                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    }
                }
            });
        });
    };
    $scope.delete = function(id) {
        $http({
            method: 'post',
            url: 'ajax/delete.php',
            data: { id: id },
            header: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            if (response == 1) {
                var alert = { type: 'success', msg: 'ระบบได้ทำการลบข้อมูลเรียบร้อยแล้ว!' };

                $scope.alerts.push(alert);
                $timeout(function() {
                    $scope.alerts.splice($scope.alerts.indexOf(alert), 1);
                    console.log($scope.alerts.indexOf(alert));
                }, 5000); // maybe '}, 3000, false);' to avoid calling apply
                get();
            } else { console.log(response); }
        });

    };
    $scope.ChangPwd = function() {
        $modal.open({
            templateUrl: 'dialog/ChangePassword.html',
            size: 'sm',
            controller: function($scope, $modalInstance) {
                $scope.change = function(value, isValid) {
                    if (isValid) {
                        $http({
                            method: 'post',
                            url: 'ajax/verifypassword.php',
                            data: { OldPassword: value.OldPassword },
                            header: { 'Content-Type': 'application/x-www-form-urlencoded' }
                        }).success(function(response) {
                            if (response == 1) {
                                if (value.NewPassword === value.RePassword) {
                                    $http({
                                        method: 'post',
                                        url: 'ajax/ChangePassword.php',
                                        data: { newpassword: value.NewPassword },
                                        header: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                    }).success(function(res) {
                                        if (res == 1) {
                                            $modalInstance.dismiss('cancel');
                                        } else {
                                            console.log(res);
                                        }
                                    });
                                } else {
                                    alert("รหัสผ่านไม่ตรงกัน!");
                                }
                            } else if (response == 0) {
                                alert("ไม่ตรงกับรหัสผ่านเดิมในระบบ!");
                            }
                        });
                    } else {
                        alert("กรุณากรอกข้อมูลให้ครบ!");
                    }
                }
                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                }
            }
        });
    }
}); //end Ctrl
app.directive('ngConfirmClick', [
    function() {
        return {
            link: function(scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.confirmedClick;
                element.bind('click', function(event) {
                    if (window.confirm(msg)) {
                        scope.$eval(clickAction)
                    }
                });
            },
        };
    }
]);

app.directive('script', function() {
    return {
        restrict: 'E',
        scope: false,
        link: function(scope, elem, attr) {
            if (attr.type == 'text/javascript-lazy') {
                var code = elem.text();
                var f = new Function(code);
                f();
            }
        }
    };
});

function loadjscssfile(filename, filetype) {
    if (filetype == "js") { //if filename is a external JavaScript file
        var fileref = document.createElement('script')
        fileref.setAttribute("type", "text/javascript")
        fileref.setAttribute("src", filename)
        fileref.async = true
        fileref.defer = true
    } else if (filetype == "css") { //if filename is an external CSS file
        var fileref = document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref != "undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}
var verifyCallback = function(response) {
    //alert(response);
    //return response;
    var input = document.getElementById("g");
    input.value = response;
};
var onloadCallback = function() {
    // Renders the HTML element with id 'example1' as a reCAPTCHA widget.
    // The id of the reCAPTCHA widget is assigned to 'widgetId1'.

    grecaptcha.render('recapcha', {
        'sitekey': '6LcG0wATAAAAAEj3ki4Z7QA7WTza3t0hcgLhrN6c',
        'callback': verifyCallback,
        'theme': 'light'
    });
};