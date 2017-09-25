(function(angular) {

    //创建模块对象声明依赖
    angular.module('todoList', ['ui.router'])
        //注入配置
        .config(['$stateProvider', '$urlRouterProvider', '$transitionsProvider', function($stateProvider, $urlRouterProvider, $transitionsProvider) {
            //在路径没有匹配的路由的时候，跳转到一个默认的路径
            $urlRouterProvider.otherwise('login');
            //配置登录页面路由规则
            $stateProvider.state('login', {
                    //登录路由匹配名称
                    url: '/login',
                    //登录路由匹配渲染模板
                    templateUrl: '/views/tpls/login.html',
                    //配置登录路由的控制器
                    controller: ['$scope', function() {

                    }]
                })
                //配置注册页面路由规则
                .state('register', {
                    //注册路由匹配名称
                    url: '/register',
                    //注册路由匹配渲染模板
                    templateUrl: '/views/tpls/register.html',
                    //配置注册路由的控制器
                    controller: ['$scope', '$http', '$state', function($scope, $http, $state) {
                        $scope.doRegister = function() {
                            if ($('#usernameIsOk').hasClass('glyphicon-ok') &&
                                $('#pwdIsOk').hasClass('glyphicon-ok') &&
                                $('#emailIsOk').hasClass('glyphicon-ok') &&
                                $('#yzmIsOk').hasClass('glyphicon-ok')
                            ) {
                                $http.post('/api/do-register', { username: $scope.username })
                                    .then(function(res) {
                                       alert(res.data)
                                    })
                                    .catch(function(err){
                                        console.log('卧槽',err)
                                    })

                            }

                            // if ($('#usernameIsOk').hasClass('glyphicon-ok') &&
                            //     $('#pwdIsOk').hasClass('glyphicon-ok') &&
                            //     $('#emailIsOk').hasClass('glyphicon-ok') &&
                            //     $('#yzmIsOk').hasClass('glyphicon-ok')) {
                            //     $http.post('/api/do-register', {
                            //         username: $scope.username,
                            //         password: $scope.password,
                            //         email: $scope.email,
                            //         yzm: $scope.yzm
                            //     }).then(function(res) {
                            //         alert(res);
                            //         $state.go('login');

                            //     }).catch(function(err) {
                            //         console.log('注册失败', err)
                            //     })
                            // }
                        }
                        //检查用户名是否存在
                        $scope.checkUserName = function() {
                            //判断用户名是否大于6位
                            if ($scope.username.length < 6) {
                                //更新提示信息
                                $scope.msg = '用户名至少6位';
                                $('#usernameIsOk').removeClass('glyphicon-ok');
                                $('#usernameIsOk').addClass('glyphicon-remove');
                                return;
                            }
                            $http.post('/api/check-username', { username: $scope.username })
                                .then(function(res) {

                                    if (res.data.code == '002') {
                                        $scope.msg = res.data.msg;
                                    }
                                    if (res.data.code == '001') {
                                        //变更提示信息
                                        $('#usernameIsOk').removeClass('glyphicon-remove');
                                        $('#usernameIsOk').addClass('glyphicon-ok');
                                        $scope.msg = res.data.msg;
                                    }
                                }).catch(function(err) {
                                    console.log(err)
                                })
                        }
                        //检查密码是否合格
                        $scope.checkPassword = function() {
                            //判断用户名是否大于6位
                            if ($scope.password.length < 6) {
                                if ($scope.password == '') {
                                    $scope.msg = '密码不能为空';
                                    return;
                                }
                                //更新提示信息
                                $scope.msg = '密码至少6位';
                                $('#pwdIsOk').removeClass('glyphicon-ok');
                                $('#pwdIsOk').addClass('glyphicon-remove');
                                return;
                            } else {
                                $('#pwdIsOk').removeClass('glyphicon-remove');
                                $('#pwdIsOk').addClass('glyphicon-ok');
                                var level = 0;
                                var reg1 = /[0-9]/;
                                var reg2 = /[a-zA-Z]/;
                                var reg3 = /[~!@#$%^&*()]/;
                                if (reg1.test($scope.password)) {
                                    level++;
                                }
                                if (reg2.test($scope.password)) {
                                    level++;
                                }
                                if (reg3.test($scope.password)) {
                                    level++;
                                }
                                if (level == 1) {
                                    $('.level').eq(0).css({ background: 'red' });
                                    $('.level').eq(1).css({ background: '' });
                                    $('.level').eq(2).css({ background: '' });
                                    $scope.msg = '密码不安全哦';
                                }
                                if (level == 2) {
                                    $('.level').eq(0).css({ background: '' });
                                    $('.level').eq(1).css({ background: 'orange' });
                                    $('.level').eq(2).css({ background: '' });
                                    $scope.msg = '密码不是很安全哦';
                                }
                                if (level == 3) {
                                    $('.level').eq(0).css({ background: '' });
                                    $('.level').eq(1).css({ background: '' });
                                    $('.level').eq(2).css({ background: 'green' });
                                    $scope.msg = '这下密码安全啦';
                                }
                            }
                        }
                        //检查邮箱是否合法
                        $scope.checkEmail = function() {
                            var email = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
                            if (!email.test($scope.email)) {
                                $scope.msg = '您的邮箱不符合规则';
                                $('#emailIsOk').removeClass('glyphicon-ok');
                                $('#emailIsOk').addClass('glyphicon-remove');
                                return;
                            }
                            $('#emailIsOk').removeClass('glyphicon-remove');
                            $('#emailIsOk').addClass('glyphicon-ok');
                            $scope.msg = '这个邮箱可以使用';
                        }
                        //返回验证码
                        $scope.yzmUrl = '/api/get-yzm?' + Date.now();
                        //检查验证码
                        $scope.checkyzm = function() {
                            $http.post('/api/check-yzm', {
                                yzm: $scope.yzm
                            }).then(function(res) {
                                if (res.data.code == '003') {
                                    $scope.msg = res.data.msg;
                                    $('#yzmIsOk').removeClass('glyphicon-ok');
                                    $('#yzmIsOk').addClass('glyphicon-remove');
                                }
                                if (res.data.code == '001') {
                                    $scope.msg = res.data.msg;;
                                    $('#yzmIsOk').removeClass('glyphicon-remove');
                                    $('#yzmIsOk').addClass('glyphicon-ok');
                                }

                            }).catch(function(err) {
                                console.log(err)
                            })
                        }

                    }]
                })
        }])
        //创建头部自定义指令即头部模块
        .directive('cHeader', function() {
            return {
                //定义头部模块渲染模板路径
                templateUrl: '/views/tpls/header.html'
            }
        })
        //创建底部自定义指令即底部模块
        .directive('cFooter', function() {
            return {
                //定义底部模块渲染模板路径
                templateUrl: './views/tpls/footer.html'
            }
        })

})(angular)