/*

Materia
It's a thing

Widget	: Enigma, Creator
Authors	: Jonathan Warner
Updated	: 3/14
*/


(function() {
  var EnigmaCreator;

  EnigmaCreator = angular.module('enigmaCreator', []);

  EnigmaCreator.controller('enigmaCreatorCtrl', [
    '$scope', function($scope) {
      $scope.title = '';
      $scope.qset = {};
      $scope.curQuestion = false;
      $scope.curCategory = false;
      $scope.imported = [];
      $scope.numQuestions = function() {
        var category, i, question, _i, _j, _len, _len1, _ref, _ref1;
        if ($scope.qset.items == null) {
          return 0;
        }
        i = 0;
        _ref = $scope.qset.items;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          category = _ref[_i];
          _ref1 = category.items;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            question = _ref1[_j];
            if (question.used) {
              i++;
            }
          }
        }
        return i;
      };
      $scope.categoryOpacity = function(category, $index) {
        var opacity;
        opacity = 0.1;
        if ($scope.step === 1 && $index === 0) {
          opacity = 1;
        }
        if (category.name || category.isEditing) {
          opacity = 1;
        }
        return opacity;
      };
      $scope.categoryShowAdd = function(category, $index) {
        return !category.name && !category.isEditing && ($index === 0 || $scope.qset.items[$index - 1].name);
      };
      $scope.categoryEnabled = function(category, $index) {
        return $index === 0 || $scope.qset.items[$index - 1].name;
      };
      $scope.questionShowAdd = function(category, question, $index) {
        return !question.questions[0].text && category.name && ($index === 0 || category.items[$index - 1].questions[0].text);
      };
      $scope.editCategory = function(category) {
        category.isEditing = true;
        return $scope.curQuestion = false;
      };
      $scope.stopCategory = function(category) {
        return category.isEditing = false;
      };
      $scope.changeTitle = function() {
        $('#backgroundcover, .title').addClass('show');
        $('.title input[type=text]').focus();
        return $('.title input[type=button]').click(function() {
          return $('#backgroundcover, .title').removeClass('show');
        });
      };
      $scope.editQuestion = function(category, question, $index) {
        var answer, _i, _len, _ref;
        if (category.name && $index === 0 || category.items[$index - 1].questions[0].text !== '') {
          $scope.curQuestion = question;
          $scope.curCategory = category;
          question.used = true;
          setTimeout(function() {
            return $('#question_text').focus();
          }, 0);
          _ref = question.answers;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            answer = _ref[_i];
            answer.options.correct = false;
            answer.options.custom = false;
            if (answer.value === 100) {
              answer.options.correct = true;
            } else if (answer.value !== 100 && answer.value !== 0) {
              answer.options.custom = true;
            }
          }
          if ($scope.step === 3) {
            return $scope.step = 4;
          }
        }
      };
      $scope.editComplete = function() {
        var answer, _i, _len, _ref;
        _ref = $scope.curQuestion.answers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          answer = _ref[_i];
          answer.value = parseInt(answer.value, 10);
          if (answer.options.custom) {
            if (answer.value === 100 || answer.value === 0) {
              answer.options.custom = false;
              answer.options.correct = answer.value === 100 ? true : false;
            }
          } else {
            answer.value = answer.options.correct ? 100 : 0;
          }
        }
        return $scope.curQuestion = false;
      };
      $scope.deleteQuestion = function(i) {
        $scope.qset.items[$scope.curCategory.index].items[$scope.curQuestion.index] = $scope.newQuestion(i);
        return $scope.curQuestion = false;
      };
      $scope.addAnswer = function() {
        return $scope.curQuestion.answers.push($scope.newAnswer());
      };
      $scope.deleteAnswer = function(index) {
        return $scope.curQuestion.answers.splice(index, 1);
      };
      $scope.newAnswer = function() {
        return {
          id: '',
          text: '',
          value: 0,
          options: {
            feedback: '',
            custom: false,
            correct: false
          }
        };
      };
      $scope.newQuestion = function(i) {
        if (i == null) {
          i = 0;
        }
        return {
          type: 'MC',
          id: '',
          questions: [
            {
              text: ''
            }
          ],
          answers: [$scope.newAnswer(), $scope.newAnswer()],
          used: 0,
          index: i
        };
      };
      $scope.toggleAnswer = function(answer) {
        answer.value = answer.value === 100 ? 0 : 100;
        return answer.options.custom = false;
      };
      $scope.newCategory = function(index, category) {
        $('#category_' + index).focus();
        category.isEditing = true;
        if ($scope.step === 1) {
          return $scope.step = 2;
        }
      };
      return $scope.updateCategory = function() {
        return setTimeout(function() {
          return $scope.$apply(function() {
            if ($scope.step === 2) {
              return $scope.step = 3;
            }
          });
        }, 0);
      };
    }
  ]);

  Namespace('Enigma').Creator = (function() {
    var $scope, initExistingWidget, initNewWidget, onMediaImportComplete, onQuestionImportComplete, onSaveClicked, onSaveComplete, zIndex, _buildSaveData, _buildScaffold, _initDragDrop, _initScope;
    $scope = {};
    zIndex = 9999;
    _initScope = function() {
      return $scope.$watch(function() {
        if ($scope.qset.items[$scope.qset.items.length - 1].name) {
          $scope.qset.items.push({
            items: [],
            used: 0
          });
          return _buildScaffold();
        }
      });
    };
    initNewWidget = function(widget, baseUrl) {
      $scope = angular.element($('body')).scope();
      _initScope();
      $scope.$apply(function() {
        $scope.title = 'My enigma widget';
        $scope.qset = {
          items: [],
          options: {
            randomize: true
          }
        };
        return _buildScaffold();
      });
      $('#backgroundcover, .intro').addClass('show');
      return $('.intro input[type=button]').click(function() {
        $('#backgroundcover, .intro').removeClass('show');
        return $scope.$apply(function() {
          $scope.title = $('.intro input[type=text]').val() || $scope.title;
          return $scope.step = 1;
        });
      });
    };
    initExistingWidget = function(title, widget, qset, version, baseUrl) {
      $scope = angular.element($('body')).scope();
      if (qset.data) {
        qset = qset.data;
      }
      $scope.$apply(function() {
        $scope.title = title;
        return $scope.qset = qset;
      });
      return $scope.$apply(function() {
        _buildScaffold();
        return _initScope();
      });
    };
    _initDragDrop = function() {
      $('.importable').draggable({
        start: function(event, ui) {
          $scope.shownImportTutorial = true;
          $scope.curDragging = +this.getAttribute('data-index');
          this.style.position = 'absolute';
          this.style.zIndex = ++zIndex;
          this.style.marginLeft = $(this).position().left + 'px';
          this.style.marginTop = $(this).position().top + 'px';
          return this.className += ' dragging';
        },
        stop: function(event, ui) {
          this.style.position = 'relative';
          this.style.marginTop = this.style.marginLeft = this.style.top = this.style.left = '';
          return this.className = 'importable';
        }
      });
      return $('.question').droppable({
        drop: function(event, ui) {
          var category, question, questionobj;
          $(ui.draggable).css('border', '');
          category = +this.getAttribute('data-category');
          question = +this.getAttribute('data-question');
          questionobj = $scope.qset.items[category].items[question];
          if (!$scope.questionShowAdd($scope.qset.items[category], questionobj, question)) {
            return;
          }
          if (questionobj.questions[0].text === '') {
            $scope.$apply(function() {
              $scope.qset.items[category].items[question] = $scope.imported[$scope.curDragging];
              return $scope.imported.splice($scope.curDragging, 1);
            });
            return _initDragDrop();
          }
        },
        over: function(event, ui) {
          var category, question, questionobj;
          category = +this.getAttribute('data-category');
          question = +this.getAttribute('data-question');
          questionobj = $scope.qset.items[category].items[question];
          if (!$scope.questionShowAdd($scope.qset.items[category], questionobj, question)) {
            console.log('cant');
            return;
          }
          if (questionobj.questions[0].text !== '') {
            return $(ui.draggable).css('border', 'solid 3px #f6002b');
          } else {
            return $(ui.draggable).css('border', 'solid 3px #71be34');
          }
        },
        out: function(event, ui) {
          return $(ui.draggable).css('border', '');
        }
      });
    };
    _buildScaffold = function() {
      var category, i, question, _i, _j, _len, _len1, _ref, _ref1, _results;
      while ($scope.qset.items.length < 5) {
        $scope.qset.items.push({
          items: [],
          used: 0
        });
      }
      i = 0;
      _ref = $scope.qset.items;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        category = _ref[_i];
        category.index = i++;
      }
      _ref1 = $scope.qset.items;
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        category = _ref1[_j];
        i = 0;
        while (category.items.length < 6) {
          category.items.push($scope.newQuestion());
        }
        _results.push((function() {
          var _k, _len2, _ref2, _results1;
          _ref2 = category.items;
          _results1 = [];
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            question = _ref2[_k];
            _results1.push(question.index = i++);
          }
          return _results1;
        })());
      }
      return _results;
    };
    onSaveClicked = function(mode) {
      if (mode == null) {
        mode = 'save';
      }
      if (_buildSaveData()) {
        Materia.CreatorCore.save($scope.title, $scope.qset);
      } else {
        Materia.CreatorCore.cancelSave('Widget not ready to save.');
      }
      return _buildScaffold();
    };
    onSaveComplete = function(title, widget, qset, version) {
      return true;
    };
    onQuestionImportComplete = function(questions) {
      $scope.$apply(function() {
        return $scope.imported = questions.concat($scope.imported);
      });
      return _initDragDrop();
    };
    onMediaImportComplete = function(media) {
      return null;
    };
    _buildSaveData = function() {
      var answer, category, i, j, okToSave, question, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
      okToSave = true;
      i = 0;
      while (i < $scope.qset.items.length) {
        if (!$scope.qset.items[i].name) {
          $scope.qset.items.splice(i, 1);
          i--;
        }
        j = 0;
        while (j < $scope.qset.items[i].items.length) {
          if (!$scope.qset.items[i].items[j].questions[0].text) {
            $scope.qset.items[i].items.splice(j, 1);
            j--;
          }
          j++;
        }
        i++;
      }
      _ref = $scope.qset.items;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        category = _ref[_i];
        _ref1 = category.items;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          question = _ref1[_j];
          _ref2 = question.answers;
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            answer = _ref2[_k];
            delete answer.options.custom;
            delete answer.options.correct;
          }
          delete question.used;
        }
        delete category.index;
      }
      return okToSave;
    };
    return {
      initNewWidget: initNewWidget,
      initExistingWidget: initExistingWidget,
      onSaveClicked: onSaveClicked,
      onMediaImportComplete: onMediaImportComplete,
      onQuestionImportComplete: onQuestionImportComplete,
      onSaveComplete: onSaveComplete
    };
  })();

}).call(this);
