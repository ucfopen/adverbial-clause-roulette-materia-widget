//testing

(function() {
  Namespace('Roulette').Engine = (function() {
    
    start = function(instance, qset, version) {
      // Listeners go here

      $('#betting').submit(handleBet(game));
      $('#guessing').submit(handleGuess(game));
      
      return Materia.Engine.setHeight();
    };
    
    // CamelCase = functions/Objects
    // underscores = variables
    // Note a lot of this was copied from old version in vanilla js.  You can abuse jQuery now, so go crazy.  :)


    // game object declaration
    // patterns = object from below
    function theGame(total_money, patterns, bet) {
      this.win_once = "You've won the round!";
      this.win_double = "You've won double this round!";
      this.lose = "You've lost the round.";
      this.total_money = total_money;
      this.bet = bet;
      this.patterns = patterns;
      this.manageGuess = manageGuess;
      this.winMoney = winMoney;
      this.loseMoney = loseMoney;
      this.handleBet = handleBet;
    }

    // patterns object
    // Will presumably have a sample library to pull from with sentences and their patterns?  Implement that later (SEE sentences.txt and use a qset!!!).  Rollin' with numbers for now!
    function thePatterns(num_patterns, curr_pattern, curr_bet, curr_guess), {
      this.num = num_patterns;
      // Current winning pattern
      this.curr_pattern = curr_pattern;
      // Pattern that was bet on
      this.curr_bet = curr_bet;
      // Pattern user identified after roulette wheel spun
      this.curr_guess = curr_guess;
      // Current sample for the selected pattern type
      this.curr_sample = curr_sample;
      this.getSample = getSample;
      this.generatePattern = generatePattern;
    }





    // initiailize patterns and the game
    var patterns = new thePatterns(10);
    var game = new theGame(1000, patterns);


  /* Handle what happens when user clicks the bet button
   * Prevent default behavior (disable actual submitting)
   * 
   */
    function handleBet()  {

      // prevent form from submitting
      event.preventDefault();

      this.patterns.generatePattern();
      this.bet = $('#bet').value();
      this.patterns.curr_bet = $('#curr_bet').value();

      this.patterns.getSample();

      // display sample sentence.
      $('#sample').html(game.patterns.curr_sample);


    }

    /*
     * Manage the guess choice and update money
     */
     function manageGuess() {

      if (isMatch(this.patterns.curr_pattern, this.patterns.curr_guess)) {
        if (isMatch(this.patterns.curr_pattern, this.patterns.curr_bet)) {
          this.total_money = this.winMoney(2);
          // tell user they won double
          // Update DOM
        }
        else {
          this.total_money = winMoney(1);
          // tell user they won 
          // Update DOM
        }
      }
      else {
        // Have to determine if they are just not going to win money, or if they will lose their bet amount
        // For now, they just don't win anything
        // Return lose code?
        // this.total_money = this.loseMoney();
      }

     }

    /*
      * Pulls a random sentence sample matching the current pattern type
      * Stores it as curr_sample within the pattern object
      */
     function getSample() {
      // ASK ABOUT QSETS AND USE THEM INSTEAD OF WHAT IS BELOW!!

      // get array of sentences from file call it... sentences[][]
      // Go random!

      // Get number of samples for the current pattern

      temp = Math.floor((Math.random()*this.num_samples)+1);
      // qsets??

      // Match the random number with the sentence and set it
      this.curr_sample = sentences[this.pattern_number][temp];

     }


    /* Generate a new sentence pattern
     * num_patterns = total number of patterns
     * Can be modified to set actual name/sample of the pattern later
     */
    function generatePattern() {

      this.curr_pattern = Math.floor((Math.random()*this.num_patterns)+1);

    }

    /* Determine if the curr_guess or the curr_bet is equal to the curr_pattern
     * @return true if a match, false if not
     */
    function isMatch(curr_pattern, guess) {
      if(curr_pattern == guess) {
        return true;
      }
      else {
        return false;
      }
    }

    /* Add up winnings (win 2x the bet if curr_guess and curr_bet were both correct)
     * total_money = total current winnings
     * @return winnings added to the total
     */
    function winMoney(multiplier) {

      return this.total_money + (this.bet * multiplier);
    }

    /* Subtract the bet from the total
     * Maybe won't need this?  Maybe you just don't win?  What point?  Who knows...
     */
     function loseMoney() {

      return this.total_money - this.bet;

     }


    // RESET FUNCTION
    // Reset game state to start

    function reset() {

      
    }



    // _submitAnswer = function() {

    //   Materia.Score.submitQuestionForScoring(_currentQuestion.id, answer.text);
     
    // };
   
    //_end = function() {

    //   return Materia.Engine.end(true);
    // };
    // return {
    //   manualResize: true,
    //   start: start
    // };
  })();

}).call(this);
