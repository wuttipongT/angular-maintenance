
<!DOCTYPE html>
<html lang="EN" ng-app="maintenance">
<head>

<script type="text/javascript" src="/static/js/analytics.js"></script>
<script type="text/javascript">archive_analytics.values.server_name="wwwb-app6.us.archive.org";archive_analytics.values.server_ms=1272;</script>
<link type="text/css" rel="stylesheet" href="/static/css/banner-styles.css"/>

	<title>ระบบซ่อมบำรุง สเปเชี่ยวตี่ เนเชอรัล โปรดักส์</title>
	<meta charset="UTF-8"/>
	<meta name="author" content="wuttipong thongmon webmaster@specialty innovation co.ltd"/>
	<meta name="description" content="Site Request Manternance of Specialty Natural Product Co.Ltd"/>
	<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
	<link rel="stylesheet" href="css/style.css" media="screen"/>
	<!--<link href="css/bootstrap.min.css" rel="stylesheet">--<link rel="stylesheet" type="text/css" href="/web/20160309001721/http://yui.yahooapis.com/3.18.1/build/cssreset/cssreset-min.css">>
	
	<!--<script src="/web/20160309001721/http://ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular.min.js"></script>
	<script src="/web/20160309001721/https://ajax.googleapis.com/ajax/libs/angularjs/1.1.5/angular.min.js"></script>
	<script src="/web/20160309001721/http://ajax.googleapis.com/ajax/libs/angularjs/1.4.0-beta.0/angular.min.js"></script>
	<script src="js/ui-bootstrap-tpls-0.10.0.min.js"></script>
	<script src="/web/20160309001721/http://m-e-conroy.github.io/angular-dialog-service/javascripts/dialogs.min.js" type="text/javascript"></script>-->
	<!--<script src='/web/20160309001721/https://www.google.com/recaptcha/api.js' async defer></script>-->
	<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.10/angular.min.js"></script>
    <script src="//angular-ui.github.io/bootstrap/ui-bootstrap-tpls-0.12.0.js"></script>
	
	<script src="js/angular-local-storage.min.js"></script>
	<script src="js/control.js"></script>
	<style>
	.animate-enter, 
.animate-leave
{ 
  -webkit-transition: 400ms cubic-bezier(0.250, 0.250, 0.750, 0.750) all;
  -moz-transition: 400ms cubic-bezier(0.250, 0.250, 0.750, 0.750) all;
  -ms-transition: 400ms cubic-bezier(0.250, 0.250, 0.750, 0.750) all;
  -o-transition: 400ms cubic-bezier(0.250, 0.250, 0.750, 0.750) all;
  transition: 400ms cubic-bezier(0.250, 0.250, 0.750, 0.750) all;
  position: relative;
  display: block;
} 
 
.animate-enter.animate-enter-active, 
.animate-leave {
  opacity: 1;
  top: 0;
  height: 30px;
}
 
.animate-leave.animate-leave-active,
.animate-enter {
  opacity: 0;
  top: -50px;
  height: 0px;
}
	</style>
    <!--<script src="/web/20160309001721/http://m-e-conroy.github.io/angular-dialog-service/javascripts/dialogs.min.js" type="text/javascript"></script>-->
</head>

<body ng-controller="Ctrl">
<alert style="position:fixed;width: 100%;top:0;left:0;" ng-repeat="alert in alerts" type="{{alert.type}}" close="closeAlert($index)" ng-animate="'animate'">{{alert.msg}}</alert>
<div class="container">
	<div class="section-top" class="clearfix">
		<div class="float-left">
			<img src="images/logo.jpg" alt="snpthai service" width="150"/>
		</div>
		<section class="float-left">
		<h1>Specialty Natural Product Co.,Ltd</h1>
		<p>ระบบแจ้งซ้อมบำรุง สเปเชี่ยวตี่ เนเชอรัล โปรดัสก์</p>
		</section>
		<i class="clearfix"></i>
		<div ng-show="user">Hi : <span class="glyphicon glyphicon-user" aria-hidden="true"></span>&nbsp;{{user.username}} | <a href="#" ng-click="logout()">Logout</a>
		</div>
	</div>
	<div class="section-middle">
		<ul class="nav nav-tabs">
			<li ng-repeat="tab in tabs" ng-class="{active:isActiveTab(tab.url)}"><a href="#" ng-click="onClickTab(tab)">{{tab.title}}</a></li>
		</ul>
		<div id="mainView">
			<div ng-include="currentTab"></div>
		</div>
		
		<div ng-show="selected">Selection from a modal: {{ selected }}</div>
	</div>
	<br/><br/><br/>
	<nav class="navbar navbar-inverse navbar-fixed-bottom">
		<div class="container-fluid">
			<div class="nav-bar-header">
				<a class="navbar-brand" href="#"> snp | Service</a>
			</div>
			<div>
				<ul class=" nav navbar-nav">
					<li ng-repeat="tab in tabs" ng-class="{active:isActiveTab(tab.url)}"><a href="#" ng-click="onClickTab(tab)">{{tab.title}}</a></li>
					<li ng-show="!user"><a href="#" ng-click="open()">สำหรับเจ้าหน้าที่</a></li>
				</ul>
			</div>
		</div>
	</nav>
</div><!--- end container -->

<!--<script type="text/ng-template" id="home.tpl.html">
	<div id="viewOne">
		<h1>View One</h1>
		<p>Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet. Nunc.</p>
	</div>
</script>
<script type="text/ng-template" id="forms.tpl.html">
	<div id="viewTwo">
		<h1>View Two</h1>
		<p>Curabitur vulputate, ligula lacinia scelerisque tempor, lacus lacus ornare ante, ac egestas est urna sit amet arcu. Class aptent taciti sociosqu.</p>
	</div>
</script>-->
<!--<script src="js/angular.min.js"></script>-->

</body>
</html>