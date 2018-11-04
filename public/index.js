var app = angular.module('weibo', []);
app.controller('myCon', function ($scope, $http) {
    $scope.newComment = "我是新增的评论";
    $scope.comments = []; // 评论
    $scope.pages = []; // 总页数
    $scope.activeId = 1; // 当前页数
    $scope.limit = 0; // 每页评论条数
    // 每次加载到首页时，总是先获取 评论总页数 和 第一页的评论数据
    getPageCount();
    getPage(1);

    $scope.getPageCount = getPageCount;
    $scope.getPage = getPage;
    $scope.incLike = function (id, index) {
        // 调用后台接口改变数据库中的数据
        $http.get('/get_comments', {
            params: {
                act: 'incLike',
                id: id
            }
        }).success(function (res) {
            // 成功后先改变前台展示数据
            $scope.comments[index].like++;
        }).error(function (err) {
            alert("err");
        })
    }
    $scope.incUnlike = function (id, index) {
        // 调用后台接口改变数据库中的数据
        $http.get('/get_comments', {
            params: {
                act: 'incUnlike',
                id: id
            }
        }).success(function (res) {
            // 成功后先改变前台展示数据
            $scope.comments[index].unlike++;
        }).error(function (err) {
            alert("err");
        })
    }

    function getPage(page) {
        // 跳转到第page页
        $http.get('/get_comments', {
            params: {
                act: 'get',
                page: page
            }
        }).success(function (res) {
            $scope.comments = res;
            $scope.activeId = page;
        }).error(function (err) {
            alert("err");
        })
    }

    function getPageCount() {
        // 获取总页数，因为angular ng-repeat得是[]/{},所以用循环创建一个总页数长度的数组
        $http.get('/get_comments', {
            params: {
                act: 'get_page_count'
            }
        }).success(function (res) {
            for (let i = 0; i < res.pages; i++) {
                $scope.pages[i] = i;
            }
            $scope.limit = res.limit;
        }).error(function (err) {
            alert("err");
        })
    }
});