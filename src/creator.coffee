PopupCreator = angular.module( 'popupCreator', [] )

PopupCreator.controller 'popupCtrl', ['$scope', '$http', ($scope, $http) ->
	$scope.widget =
		engineName: "Roulette"
		title     : ""

	$scope.state =
		isEditingExistingWidget: false

	qset = ""

	$scope.initNewWidget = (widget) ->
		$scope.$apply ->
			$scope.widget.engineName = $scope.widget.title = widget.name

		$http.get('assets/questions.json').then (success) ->
			qset = success.data.qset.data
		, (fail) ->
			alert "Could not load preset questions!"

	$scope.initExistingWidget = (title, widget, qset, version, baseUrl) ->
		$scope.state.isEditingExistingWidget = true
		$scope.$apply ->
			$scope.widget.engineName = widget.name
			$scope.widget.title     = title

		unless qset.length
			$http.get('assets/questions.json').then (success) ->
				qset = success.data.qset.data
			, (fail) ->
				alert "Could not load preset questions!"

	$scope.onSaveClicked = (mode = 'save') ->

		if ( !qset.beginner or !qset.advanced) then Materia.CreatorCore.cancelSave 'Something went wrong! Question set empty!'

		if $scope.widget.title
			Materia.CreatorCore.save $scope.widget.title, qset
		else Materia.CreatorCore.cancelSave 'This widget has no title!'

	$scope.onSaveComplete = (title, widget, qset, version) -> null

	$scope.onMediaImportComplete = (media) -> null

	# Private methods
	_buildSaveData = ->
		name    : ''
		items   : []


	Materia.CreatorCore.start $scope
]
