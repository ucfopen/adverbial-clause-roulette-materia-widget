(function() {
  Namespace('Roulette').Engine = (function() {

    //////////////////////////////////// HELPER FUNCTIONS ////////////////////////////////////

    // RESET FUNCTION
    // Resets game state to start
    function reset() {
      return true;
    }

    //determines numerical (0-9) to Roman Numeral number passed in
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
          return;
      }
    }

    //determines deg of spin to land on specific number
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


      number_selected = spinToNumber;

      var firstOrSecond = Math.floor(Math.random() * 2);
      var deg_add = degree(number_selected);

      console.log("Number selected: " + number_selected + " firstOrSecond: " + firstOrSecond + " deg_add: " + deg_add + " excess: "+ excess);
      var deg = 1080 + (firstOrSecond * 180) + deg_add + excess;
      console.log(deg);

      excess = 360 - deg_add + deg + (firstOrSecond * 180);

      $("#roulette_wheel").css({'transform':"rotate(" + deg + "deg)",'transition-property':"transform", 'transition':"4s"});
      $("#ball").fadeIn();
      $("#ball").css({'transform':"rotate(" + (-excess) + "deg)", 'transition-property':"transform", 'transition-duration':"4s"});
      
      setTimeout(function() {
        $("#ball").animate({marginTop: "-78%"}, 300, "linear");
      }, 1800);

      setTimeout(function() {
        $("#ball").fadeOut("slow");
        $("#ball").animate({marginTop: "-101.5%"}, 0);
      }, 7000);

      if ( excess > 9000000000002000) {
        setTimeout(function() {
          $("#roulette_wheel").fadeOut();
          $("#roulette_wheel").removeAttr('style');
          $("#ball").removeAttr('style');
          excess = 0;
        }, 8000);

        setTimeout(function() {
          $("#roulette_wheel").fadeIn();
        }, 9000);
      }

      console.log("I landed on: " + number_selected);

      return number_selected;
    }
    ////////////////////////////////// END HELPER FUNCTIONS //////////////////////////////////

    // game object declaration
    // patterns = object from below
    function theGame(total_money, patterns) {
      this.announce = function(winnings) {
        switch (winnings) {
          case -1:
            $('#message').html(this.win_once);
            break;
          case 1:
            break;
          default:
            break;
        }
        
        this.win_once = "You've won the round!";
        this.win_double = "You've won double this round!";
        this.lose = "Sorry, you've lost this round.";
      };
      
      this.total_money = total_money;
      this.patterns = patterns;
      this.bet = 0;
      this.betting = false;

      this.manageGuess = function () {
        event.preventDefault();

        if (!(this.betting)) {
          alert("You forgot to make a bet!");
          return false;
        }


        spinWheel(this.patterns.curr_pattern);
        this.patterns.curr_guess = $("#curr_guess").val();

        if (this.patterns.curr_guess == 0) {
          alert("You forgot to choose your answer!");
          return false;
        }

        if (this.patterns.curr_pattern == this.patterns.curr_guess) {
          if (this.patterns.curr_pattern == this.patterns.curr_bet) {
            //$('#message').html(this.win_double);

            this.winMoney(2);
            $('#total').html(this.total_money);

            return true;
          }
          else {
            //$('#message').html(this.win_once);

            this.winMoney(1);
            $('#total').html(this.total_money);

            return true;
          }
        }
        else {
          //$('#message').html(this.lose);

          $('#total').html(this.total_money);

          return true;
        }
      };

      //Add up winnings (win 2x the bet if curr_guess and curr_bet were both correct)
      this.winMoney = function (multiplier) {
        switch (multiplier) {
          case 1:
            this.total_money = Number(this.total_money) + Number(this.bet);
            break;

          case 2:
            this.total_money = Number(this.total_money) + Number(2 * this.bet);
            break;

          default:
            break;
        }
      };

      //Subtract the bet from the total
      //Maybe won't need this?  Maybe you just don't win?  What point?  Who knows...
      this.loseMoney = function () {
        this.total_money = this.total_money - this.bet;
        //$('#total').html(game.total_money);
      };

      // Handle what happens when user clicks the bet button
      // Prevent default behavior (disable actual submitting)
      this.handleBet = function ()  {
        // prevent form from submitting
        event.preventDefault();

        if (game.betting) {
          alert("There is already a bet made. Please finish the current round before you move on.");
          return false;
        }

        //this.patterns.generatePattern();
        this.bet = $("#bet").val();
        this.patterns.curr_bet = $("#curr_bet").val();

        if (this.bet == 0 || this.patterns.curr_bet == 0) {
          alert("You forgot to do one of the following:\n\t- Place a bet.\n\t- Pick a pattern to bet on.");
          return false;
        }

        console.log("Current Bet (inside function): " + this.bet);
        this.loseMoney();

        return true;
      };

    }

    // patterns object
    // Will presumably have a sample library to pull from with sentences and their patterns?  Implement that later (SEE sentences.txt and use a qset!!!).  Rollin' with numbers for now!
    function thePatterns(num_patterns) {
      this.num = num_patterns;

      // Pattern that was bet on
      this.curr_bet = '';

      // Pattern identified as sentence type by user
      this.curr_guess = '';

      // current sample
      this.curr_sample = '';

      // pattern type of current sample
      this.curr_pattern = '';
    }

    var patterns = new thePatterns(10);
    var game = new theGame(1000, patterns);

    start = function(instance, qset, version) {

      //Makes ball dissapear when document loads
      $("#ball").hide();
      
      // Listeners go here
      // $('#betting').submit(game.handleBet());
      $('#betting').on("submit", function() {
        
        // does not allow entire sequence to run if handleBet() is unsuccesful
        if (!(game.handleBet()))
          return ;

        //chooses random number between 0 and 216. This will be our sample
        var sample = Math.floor(Math.random() * 217);
        var sample_pattern = qset.items[0].items[sample].answers[0].text;

        patterns.curr_sample = qset.items[0].items[sample].questions[0].text;
        patterns.curr_pattern = pattern(sample_pattern);
        game.spinTo = game.patterns.curr_pattern;

        $('#sentence').html(patterns.curr_sample);

        console.log("Sample: " + patterns.curr_sample + ", Type: " + patterns.curr_pattern + " (" + sample_pattern + ")");

        $('#betting').get(0).reset();

        game.betting = true;
        $('#total').html(game.total_money);
      });
      
      $('#guessing').on("submit", function () {
        // does not allow entire sequence to run if handleBet() is unsuccesful
        if (!(game.manageGuess()))
          return ;

        game.betting = false;
        $('#total').html(game.total_money);

        // resets selection fields
        $('select').val('');

        // hides betting amounts that player does not have enough for
        $("#bet option").each(function(){
          var value = $(this).val();

          console.log(game.total_money);

          if(value > game.total_money) {
            $(this).hide();
          } else {
            $(this).show();
          }

        });

      });

      return Materia.Engine.setHeight();
    };

    //game.bet = 25;
    //console.log("Current Bet: " + game.bet);

    //game.loseMoney();
    //game.loseMoney();
    //game.loseMoney();

    //console.log("Current Money: " + game.total_money);

    /*
    console.log("Total Money: " + game.total_money);
    game.bet = 50;
    console.log("Current Bet: " + game.bet);

    game.handleBet();
    console.log("Current Money: " + game.total_money);
    */

    //This section was commented out
    // _submitAnswer = function() {

    //   Materia.Score.submitQuestionForScoring(_currentQuestion.id, answer.text);
     
    // };
   
    //_end = function() {

    //   return Materia.Engine.end(true);
    // };
    return {
       manualResize: true,
       start: start
    };

  })();
}).call(this);