(function() {
  Namespace('Roulette').Engine = (function() {

    /////////////////////////////// HELPER FUNCTIONS & VARIABLES ///////////////////////////////

    // The following is a double array of example sentences of each pattern. i.e. example[pattern][exampleToDisplay(1-3)]
    var example = [
    ["The students are upstairs.","The cat is outside.","The ball is in the neighbor's yard."],                                                           //Pattern 1 Examples
    ["The students are diligent.","The students are very motivated.","The students are brilliant."],                                                      //Pattern 2 Examples
    ["The students are scholars.","Today's soup is chicken noodle.","His favorite ice cream is coffee toffee crunch."],                                   //Pattern 3 Examples
    ["The students seem diligent.","The cookies seem a little stale.","The girl grew sleepy."],                                                           //Pattern 4 Examples
    ["The students became scholars.","That puppy rapidly became my favorite companion.","The movie star remained a bachelor."],                           //Pattern 5 Examples
    ["The students slept.","The kitten yawned.","The car drove down the street."],                                                                        //Pattern 6 Examples
    ["The students studied their assignment.","Devon helped her little brother.","He baked delicious cookies."],                                          //Pattern 7 Examples
    ["The students gave the professor their homework.","He baked them some delicious cookies.","They awarded the prize to Mary."],                        //Pattern 8 Examples
    ["The students consider the teacher intelligent.","The students consider grammar fascinating.","The students found the practice game enjoyable."],    //Pattern 9 Examples
    ["The students consider the course a challenge.","They elected him treasurer.","She made the former nursery her office."],                            //Pattern 10 Examples
    ];

    // The following is a array of different phrases users may see when they are to be given an example sentence
    var exampleStatement = [
      "Since you had trouble, here's another example of a sentence considered Pattern ",
      "Here's another example of a sentence considered Pattern ",
      "Had trouble? Here's another example of a sentence considered Pattern "
    ];

    // tells user to either "Pick a pattern, or their potential winnings when they have at least one pattern selected."
    function messageUpdate(pCount) {
      switch (pCount) {
        case 0:
          $('#message_text').html("Pick a pattern.");
          break;

        case 1:
          $('#message_text').html("You can win 2X your bet.");
          break;

        case 2:
          $('#message_text').html("You can win 1.5X your bet.");
          break;

        case 3:
          $('#message_text').html("You can win 1X your bet.");
          break;

        default:
          break;
      }
    }

    // Determines whether user has selected correct pattern type
    function isRight () {

      for ( var k = 0; k < patterns.curr_pattern.length; k++)
        for (var i = 0; i < patternGuess.length; i++) {

          if ( patterns.curr_pattern[k] == patternInverse(patternGuess[i]) ) {
            return true;
          }
        }

      return false;
    }


    //Resets current game.
    function resetGame() {
      // resets global variables and spinner for spinWheel()
      excess = 0;
      number_selected = 0;

      $("#roulette_wheel").attr('style','');


      // resets variables for Game
      count = 0;
      right = 0;
      wrong = 0;
      hightTotal = 0;
      showCurrBet = false;

      $('#sentence1').html("");
      $('#sentence2').html("");

      game.total_money = 1000.00;
      $('#total').html(parseFloat(Math.round(game.total_money * 100) / 100).toFixed(2));

      // resets displayed game progress
      $('#progress').html(count);
      $('#numRight').html(right);
      $('#numWrong').html(wrong);
      $('#highTotal').html("N/A");

      messageUpdate(0);

      for (var i = 1; i <= 25; i++) {
        $('#q'+ i + '_results').html("You have not yet answered this question");
        $('#f'+ i + '_results').html("You have not yet answered this question");

      }
      
      // De-selects all current pattern selections
      for (var j = 0; j < patternGuess.length; j++) {
          patternCount = selectPattern(patternGuess[j], patternCount);
      }

      selectPattern(patternGuess[0], patternCount);
      patternCount = 0;
    }

    function canBet () {
      if ( patternCount > 0 && $('#bet').val() > 0 ) {
        $('.option-style4').css('color',"#fff");
        return;
      } else {
        $('.option-style4').attr('style','');
        return;
      }
    }

    //registers users pattern selections
    //allows users to select multiple patterns
    function selectPattern(value, pCount) {

      if( $("#bet_p" + value).attr('disabled') == 'false' ) {
        //disallows user from selecting more than 3 patterns
        if (pCount == 3) {
          return 3;
        }
          
        pCount++;

        $("#bet_p" + value).css({'border':"3px solid #FFF",'margin':"2px"});
        $("#bet_p" + value).attr('disabled','true');
        $("#bet_h" + value).css({'background': "rgba(0,0,0,0.5)"});

        patternGuess.push(value);

        return pCount;
      }

      else {
        pCount--;

        $("#bet_p" + value).attr('style','');
        $("#bet_p" + value).attr('disabled','false');
        $("#bet_h" + value).attr('style','');

        var i = patternGuess.indexOf(value);
          if ( i != -1 ) {
            patternGuess.splice(i, 1);
          }

        return pCount;
      }

    }

    //determines and returns integer equivalent (0-9) to Roman Numeral number passed in
    function pattern(sentence_pattern) {
      switch (sentence_pattern) {
        case "I":
          return 1;
        case "II":
          return 2;
        case "III":
          return 3;
        case "IV":
          return 4;
        case "V":
          return 5;
        case "VI":
          return 6;
        case "VII":
          return 7;
        case "VIII":
          return 8;
        case "IX":
          return 9;
        case "X":
          return 10;
        default:
          return false;
      }
    }

    //determines and returns roman numeral equivalent (I-X) to integer number passed in
    function patternInverse(number) {
      switch (number) {
        case 1:
          return "I";
        case 2:
          return "II";
        case 3:
          return "III";
        case 4:
          return "IV";
        case 5:
          return "V";
        case 6:
          return "VI";
        case 7:
          return "VII";
        case 8:
          return "VIII";
        case 9:
          return "IX";
        case 10:
          return "X";
        default:
          return false;
      }
    }

    //takes in array of integers & returns Roman Numeral array equivalent passed in arrray
    function patternInverse2(numbers) {
      var patternGuess2 = [];
      var i;

      for ( i = 0; i < numbers.length; i++) {
        num = numbers[i];
        if (num == 1){
          patternGuess2.push("I");
        } else if (num == 2){
          patternGuess2.push("II");
        } else if (num == 3){
          patternGuess2.push("III");
        } else if (num == 4){
          patternGuess2.push("IV");
        } else if (num == 5){
          patternGuess2.push("V");
        } else if (num == 6){
          patternGuess2.push("VI");
        } else if (num == 7){
          patternGuess2.push("VII");
        } else if (num == 8){
          patternGuess2.push("VIII");
        } else if (num == 9){
          patternGuess2.push("IX");
        } else if (num == 10){
          patternGuess2.push("X");
        }
      }
      return patternGuess2;
    }

    //determines deg of spin to land on specific number. (Degree wheel needs to spin to)
    function degree(num) {
      switch (num) {
        case 1:
          return 0;
        case 10:
          return 18;
        case 9:
          return 36;
        case 2:
          return 54;
        case 7:
          return 72;
        case 4:
          return 90;
        case 5:
          return 108;
        case 6:
          return 126;
        case 3:
          return 144;
        case 8:
          return 162;
        default:
          return;

      }
    }

    //variable to hold degrees remaining to reset wheel
    var excess = 0;
    var number_selected = 0;

    //spins wheel and returns value wheel lands on
    function spinWheel(spinToNumber) {
      $("#ball").fadeOut('fast');
      $("#ball").animate({marginTop: "-101.5%"}, 0);


      number_selected = spinToNumber;

      var firstOrSecond = Math.floor(Math.random() * 2);
      var deg_add = ~~degree(number_selected);

      var deg = 1080 + (firstOrSecond * 180) + deg_add + excess;

      excess = 360 - deg_add + deg + (firstOrSecond * 180);

      //spins wheel by adding current degree to spin to and 1080 degrees (3 extra turns) to current wheel styling to induce spin
      $("#roulette_wheel").css({'-webkit-transform':"rotate(" + deg + "deg)",'transform':"rotate(" + deg + "deg)",
                          '-webkit-transition-property':"rotate",'transition-property':"rotate", 'transition':"4s"});
      
      setTimeout(function() {
        $("#ball").fadeIn('slow');
        $("#ball").css({'-webkit-transform':"rotate(" + (-excess) + "deg)",'transform':"rotate(" + (-excess) + "deg)",
                '-webkit-transition-property':"transform",'transition-property':"transform", 'transition-duration':"4s"});
      }, 250);

      setTimeout(function() {
        $("#ball").animate({marginTop: "-78%"}, 300, "linear");
      }, 1800);

      return number_selected;
    }

    //////////////////////////////////// END HELPER FUNCTIONS //////////////////////////////////

    // game object declaration
    // patterns = object from below
    function theGame(total_money, patterns) {
      
      
      this.total_money = total_money;
      this.patterns = patterns;
      this.bet = 0;

      this.manageGuess = function () {
        event.preventDefault();

        spinWheel(this.patterns.curr_pattern);
        this.patterns.curr_guess = $("#curr_guess").val();

        return true;
      };

      //determines winnings from number passed in and updates in game total
      this.winMoney = function (multiplier) {
        var win;

        switch (multiplier) {
          case 1:
            win =  Number(this.bet);
            this.total_money = Number(this.total_money) + win;
            break;

          case 1.5:
            win = (1.5 * this.bet);
            this.total_money = (this.total_money) + win;
            break;

          case 2:
            win = Number(2 * this.bet);
            this.total_money = Number(this.total_money) + win;
            break;

          default:
            break;
        }

        //displays to user their current winnings
        $('#adjustment').html("+" + win);

        $('#adjustment').slideToggle('slow');

        setTimeout(function () {
          $('#adjustment').slideToggle('slow');
          $('#total').html(parseFloat(Math.round(game.total_money * 100) / 100).toFixed(2));
        }, 1000);
        
      };

      //Manages current bet. Subtracts current be from total in order to hold until bet has been completed
      this.manageBet = function (lose) {
        this.total_money = (this.total_money) - lose;

        $('#total').html(parseFloat(Math.round(this.total_money * 100) / 100).toFixed(2));
      };
    }

    // patterns object
    // Will presumably have a sample library to pull from with sentences and their patterns?  Implement that later (SEE sentences.txt and use a qset!!!).  Rollin' with numbers for now!
    function thePatterns(num_patterns) {
      this.num = num_patterns;

      // current sample
      this.curr_sample = '';

      // pattern type of current sample
      this.curr_pattern = '';
    }

    // Initiates this instant of the game.
    var patterns = new thePatterns(10);
    var game = new theGame(1000.00, patterns);

    //pattern selected by user
    var patternGuess = [];

    //variables controlling patter selection
    var patternCount = 0;
    var patternLimit = false;

    // detScores variables
    var right = 0;
    var wrong = 0;
    var highTotal = 0;

    var count = 0;

    var showCurrBet = false;

    // sets limits to qset
    var set;
    var setSize;

    var senExpand = false;

    // confirmation for user requested reset
    var reset = false;

    start = function(instance, qset, version) {

      //Makes ball dissapear when document loads
      $("#ball").hide();

      // User has chosen to use the beginner qset. Beginner qset loaded to set variable for use in-game
      // This is triggered when the user selects [Beginner] within the #startModal
      $('#beginnerStart').click(function() {
        $("#start").fadeOut("slow");


        set = qset.beginner;
        selectSentence();
      });

      // User has chosen to use the advanced qset. Advanced qset loaded to set variable for use in-game
      // This is triggered when the user selects [Advanced] within the #startModal
      $('#advancedStart').click(function() {
        $("#start").fadeOut("slow");

        set = qset.advanced;
        selectSentence();
      });

      // Expanded sentence holder allows user to view entire sentence when it is out of bounds of the default sentence container
      // This is triggered when user selects the [+] or [-] next to the header of the sentence contianer
      $('#senExpand').click(function() {
        if ( !(senExpand) ) {
          $('#senExpandButton').html("<i class=\"fa fa-minus-square-o fa-1g\"></i>");
          $('#senExpansion').slideToggle('slow');
          senExpand = true;
        } else {
          $('#senExpandButton').html("<i class=\"fa fa-plus-square-o fa-1g\"></i>");
          $('#senExpansion').slideToggle('slow');
          senExpand = false;
        }
        
      });

      // Closes #resultsModal which displays when user submits bet
      // This is triggered when the user selects [Next] withing the #resultsModal
      $('#next').click(function() {
        $('#resultsModal').attr('style','');

        if (count == 25) {
          $('#finishModalText').html("The following is the results to your game, take note of what you got wrong and select RESET to start a new game.");
          $('#finishModal').css({'opacity': "1",'pointer-events': "auto"});
        } else if ( game.total_money < 25 ) {
          $('#finishModalText').html("Your score go too low, so the game ended. Take note of what you got wrong and select RESET to start a new game.");
          $('#finishModal').css({'opacity': "1",'pointer-events': "auto"});
        } else {
          selectSentence();
        }

      });

      // This is triggered when the user selects a pattern
      // This adds or removes their selection from their current guesses
      $('.bet_selection').click(function() {
        var temp = $(this).attr('value');

        selectPattern(pattern(temp), patternCount);

        patternCount = patternGuess.length;

        messageUpdate(patternCount);

        canBet();

      });

      // Resets game and closes finishModal
      // This is triggered when the user selects ["FINISH"] within the #finishModal
      $('#finish').click(function() {
        $("#finishModal").fadeOut("slow");

        resetGame();

        setTimeout(function () {
          $("#start").fadeIn("slow");
        }, 750);
        
      });


      //loads sentence to the game
      //All inclusive. Assigns sentence, pattern, and numbe to spinTo to in-game variables.
      // Displays sentence to user
      var sample_pattern = [];
      function selectSentence () {

        var print;

        //chooses random number between 0 and 216. This will be our sample
        var sample = Math.floor(Math.random() * set.items.length);
        sample_pattern = [];

        if( pattern(set.items[sample].answers[0].text) != false ) {
          sample_pattern.push(set.items[sample].answers[0].text);
        } else {
          var multiLine = set.items[sample].answers[0].text.split("\n");
          var multiWord = multiLine[multiLine.length - 1].split(" ");
          
          if ( pattern( multiWord[0] ) == false ) {
            multiWord = multiLine[multiLine.length - 2].split(" ");
          }

          for ( var j = 0; j < multiWord.length; j++) {
            sample_pattern.push(multiWord[j]);
          }
        }
        
        var printSample = set.items[sample].questions[0].text.split("\n");

        for (print = 0; print < printSample.length; print++) {
          if ( print === 0 && printSample.length > 2 ) {
            patterns.curr_sample = "<i>" + printSample[print] + "</i>";
          } else if ( print === 0 ) {
            patterns.curr_sample = printSample[print];
          }  else {
            patterns.curr_sample = patterns.curr_sample.concat(printSample[print]);
          }

          if ( print < (printSample.length - 1) ) {
            patterns.curr_sample = patterns.curr_sample.concat("<br />");
          }
        }

        patterns.curr_pattern = sample_pattern;
        game.spinTo = pattern(game.patterns.curr_pattern[0]);

        $('#sentence1').hide(750);

        setTimeout(function () {
          $('#sentence1').html(patterns.curr_sample);
          $('#sentence2').html(patterns.curr_sample);
            
        }, 750);

        setTimeout(function () {
          $('#sentence1').show(750);
        }, 1750);

        $('#betting').get(0).reset();
      }

      // This is triggered when the user selects a bet, other then the default value, within the bet amount selector
      // This updates their current wager and subtracts from and displays total after wager
      $('#bet').change(function() {

        $('#currBet').html( $('#bet').val() );

        game.manageBet( $('#bet').val() );

        if ( !(showCurrBet) ) {
          $('#currentBet').slideToggle('slow');
          showCurrBet = true;
        }

        canBet();
        
      });

      // This is triggered when the user selects [BET] within game. User must have already selected a pattern and amount they intend to bet
      // This handles then ins and outs of processing the users bet. Determines whether user was right, and totals to be updated
      // This also triggers the #resultsModal to open
      $('#submit_bet').click(function() {

        setTimeout(function() {
          $('#currentBet').slideToggle('slow');
        },3500);

        showCurrBet = false;

        game.bet = ~~$('#bet').val();

        if ( patternCount == 0 || game.bet == 0 ) {
          //alert("You forgot to do one of the following:\n  - Select the pattern of the sentence dispayed.\n - Select the amount you wanted to bet");
          return;
        }

        count++;

        spinWheel(game.spinTo);
        
        setTimeout(function() {
          var sample = Math.floor(Math.random() * 3);

          if ( isRight() ) {
            right++;

            //code for updating results and modal pop-up. Case: isRight = true
            $('#q'+ count + '_results').html("<font color = \"green\">CORRECT</font><br />" + patterns.curr_sample + "<br />Correct Answer: " + patterns.curr_pattern + ", You answered: " + patternInverse2(patternGuess));
            $('#f'+ count + '_results').html("<font color = \"green\">CORRECT</font><br />" + patterns.curr_sample + "<br />Correct Answer: " + patterns.curr_pattern + ", You answered: " + patternInverse2(patternGuess));
            $('#resultsModalResult').html("<font color = \"green\" size = \"20px\">CORRECT</font>");
            $('#resultsModalText').html(patterns.curr_sample + "<br /><br />" + "Correct Answer: " + patterns.curr_pattern + ", You answered: " + patternInverse2(patternGuess));
            $('#resultsModalExample').html("");

            for (var i = 0; i < patternGuess.length; i++) {
              if (patternCount == 1) {
                game.winMoney(2);
                break;
              } else if (patternCount == 2) {
                game.winMoney(1.5);
                break;
              } else {
                game.winMoney(1);
                break;
              }
            }
          } else {
            wrong++;

            //code for updating results and modal pop-up. Case: isRight = false
            $('#q'+ count + '_results').html("<font color = \"red\">INCORRECT</font><br />" + patterns.curr_sample + "<br />Correct Answer: " + patterns.curr_pattern + ", You answered: " + patternInverse2(patternGuess) );
            $('#f'+ count + '_results').html("<font color = \"red\">INCORRECT</font><br />" + patterns.curr_sample + "<br />Correct Answer: " + patterns.curr_pattern + ", You answered: " + patternInverse2(patternGuess) );
            $('#resultsModalResult').html("<font color = \"red\" size = \"20px\">INCORRECT</font>");
            $('#resultsModalText').html(patterns.curr_sample + "<br /><br />Correct Answer: " + patterns.curr_pattern + ", You answered: " + patternInverse2(patternGuess) + "<br />");
            if ( set == qset.beginner ) {
              $('#resultsModalExample').html(exampleStatement[sample] + patterns.curr_pattern + ": " + example[ pattern(patterns.curr_pattern[0])-1 ][sample] );
            }
          }

          for (var k = 0; k < patternGuess.length; k++) {
            patternCount = selectPattern(patternGuess[k], patternCount);
          }

          patternCount = selectPattern(patternGuess[0], patternCount);
          patternCount = 0;

          canBet();
          $('#resultsModal').css({'opacity': "1",'pointer-events': "auto"});

        }, 4000);

        setTimeout(function () {
          if(game.total_money > highTotal)
            highTotal = game.total_money;

          $('#progress').html(count);
          $('#numRight').html(right);
          $('#numWrong').html(wrong);
          $('#highTotal').html(highTotal);

          messageUpdate(0);
        }, 9000);
        
        patternCount = patternGuess.length;

      });

      // user selected yes within the #resetModal
      // resets game, triggers #startModal to appear after game reset
      $('#yes').click(function() {
        reset = true;

        $('#resetModal').attr('style', 'none');

        resetGame();

        setTimeout(function () {
          $("#start").fadeIn("slow");
        }, 500);

        reset = false;
      });

      // user selected no within the #resetModal
      // returns user to game
      $('#no').click(function() {
        reset = false;

        $('#resetModal').attr('style', 'none');
      });

      // user has selected to reset game, induces #resetModal to appear
      $('#reset').click(function() {

        $('#resetModal').css({'opacity': "1",'pointer-events': "auto"});
        
      });


      return Materia.Engine.setHeight();
    };

    return {
       manualResize: true,
       start: start
    };

  })();
}).call(this);
