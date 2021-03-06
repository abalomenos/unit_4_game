
var characters = [
    {
        id: 0,
        name: "Obi-Wan Kenobi",
        hp: 120,
        ap: 6,
        cAP: 8,
        pic: "obi.png"
    },
    {
        id: 1,
        name: "Luke Skywalker",
        hp: 100,
        ap: 8,
        cAP: 10,
        pic: "luke.png"
    },
    {
        id: 2,
        name: "Darth Sidious",
        hp: 150,
        ap: 2,
        cAP: 16,
        pic: "sidious.png"
    },
    {
        id: 3,
        name: "Darth Maul",
        hp: 180,
        ap: 4,
        cAP: 6,
        pic: "maul.png"
    }
]

// const newArray = myArray.map(a => Object.assign({}, a));

// var test = characters.slice();
// test[0].id = 9;
// console.log(characters);
// console.log(test);

var player;
var defender;

var playerAP;
var playerHP;
var defenderHP;

var winCounter; //counter for each round

var wins = 0;
var losses = 0;
var message = ""

var gameState = "notPlaying";
var charState = "none";

var audioTheme = new Audio("./assets/audio/StarWars.mp3");
var audioAttack = new Audio("./assets/audio/Lightsaber.mp3");

function clear () {
    playTheme();
    gameState = "playing";
    winCounter = 0;
    playerAP = 0; // doing this so I dont lose original value for New Game
    playerHP = 1000; // doing this so I dont lose original value for New Game
    defenderHP = 1000; // doing this so I dont lose original value for New Game
    
    for (i = 0; i < characters.length; i++) {
        $("#" + i).remove();
    }
    $(".rpgNOBG").removeClass("rpgNOBG").addClass("rpgBG");
    $("#characterAttack").html("");
    $("#defenderAttack").html("");

    $("#rpgCenterTable").removeClass("rpgLeftTable").addClass("rpgCenterTable"); // Switch to rpgLeftTable

    // $("#player").css('display', 'none');
    $("#player").hide();
    // $("#player").show();
    $("#enemy").css('display', 'none');
    $("#characters").css('display', 'none');
    $("#defeatedEnemies").css('display', 'none');

    $("#gameStart").css('display', 'none');
    
    $("#rpgAttack").css('display', 'none');

    $("#rpgTop").css('display', 'block');
    $("#rpgMiddle").css('display', 'block');
    $("#rpgStatus").css('display', 'block');
    $("#rpgBottom").css('display', 'block');
    

    if ($("#rpgBottom").hasClass("slideInUp")){
        $("#rpgBottom").removeClass("slideInUp").addClass("bounceInDown");
    } else {
        $("#rpgBottom").addClass("animated bounceInDown");
    }
    $("#showCharacters").css('display', 'block');
    $("#cMessage").css('display', 'inline');
    $("#cMessage").html("<h3 class='box'>Select a character!<br>This will be your character.</h3>");
}

// Play Main Theme
function playTheme(){
    if (!(audioTheme.duration > 0 && !audioTheme.paused)) {
        audioTheme.currentTime = 0;
        audioTheme.play();
    }
}

// Loop Main Theme
audioTheme.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

function playAttack(){
        audioAttack.currentTime = 0;
        audioAttack.play();
}

//Avoid text selection
function noText(x){
    x.attr('unselectable', 'on');
    x.css('user-select', 'none');
    x.on('selectstart', false);
    //return c;
}

// Function to output messages
function messageBox(message){
    var div = $("<div>");
    div.html(message);
    noText(div);
    return div;
}

function showCharacters(){

    for (var i = 0; i < characters.length; i++) {
        var char = $('<td>');
        var pic = '<img src = "./assets/images/' + characters[i].pic + '" height="100" width="58">';
        var name = "<h3><font color='#70989d'>" + characters[i].name + "</font></h3>";
        var hp = "<h3 class='hp" + i + "'><font color='#48ff00'>" + characters[i].hp + "</font> HP</h3>";
        char.attr("id", i);
        char.addClass("char box animated zoomInDown"); // adding char to pull id; adding CSS animation from animate.css
        char.html(name);
        char.append(pic);
        char.append(hp);
        
        noText(char);

        $("#showCharacters").append(char);
    }
}

function characterSelect(char){
    $("#player").css('display', 'block');
    $("#enemy").css('display', 'block');

    $("#rpgCenterTable").removeClass("rpgCenterTable").addClass("rpgLeftTable"); // Switch to rpgLeftTable

    $("#characters").css('display', 'block');
    $("#defeatedEnemies").css('display', 'block');
    $("#characters").html(messageBox("<th class='charactersTitle'><h6>Remaining Enemies</h6></th>"));
    $("#defeatedEnemies").html(messageBox("<th class='defeatedEnemiesTitle'><h6>Defeated Enemies</h6></th>"));
    $("#player").html(messageBox("<th class='playerTitle'><h5>Player</h5></th>"));
    $("#enemy").html(messageBox("<th class='enemyTitle'><h6>Enemy</h6></th>"));
    if (charState == "characterSelected"){
        player = char.id;
        $("#" + char.id).remove();
        $("#selectedCharacter").append(char);
        $("#" + char.id).removeClass("char zoomInDown").addClass("bounceInLeft"); // removing class "char" to avoid clicking Player's character; adding CSS animation from animate.css
        $("#cMessage").html(messageBox("<h3 class='box'>Select an enemy to attack!<br>Choose wisely " + characters[player].name + ".</h3>"));
    } else if (charState == "defenderSelected"){
        defender = char.id;
        $("#" + char.id).remove();
        $("#selectedDefender").append(char);
        $("#" + char.id).removeClass("zoomInDown").addClass("bounceInRight"); // adding CSS animation from animate.css
    }
}

function won() {
    winCounter ++;
    $("#rpgAttack").css('display', 'none');
    $("#defeatedDefender").append($("#" + defender));
    $("#" + defender).removeClass("shake wobble").addClass("fadeInUp"); // adding CSS animation from animate.css
    charState = "characterSelected";
    defenderHP = 1000; // to reset and get next selected defender HP

    if (winCounter == 3) {
        charState = "none";
        gameState = "notPlaying";
        wins++;
        $("#wins").html(wins);
        //$("#gameWon").css('display', 'block');
        $("#rpgTop").css('display', 'none');
        $("#rpgMiddle").css('display', 'none');
        $("#defenderAttack").css('display', 'none');
        $("#characterAttack").css('display', 'none');
        
        $("#cMessage").css('display', 'block');
        $(rpgBottom).addClass("slideInUp"); // adding CSS animation from animate.css
        $("#cMessage").html(messageBox("<h3 class='centerMessageBox animated bounceInUp'>" + characters[player].name + " you Won!<br>Press the Enter key to play again.</h3>"));
    } else {
        $("#cMessage").css('display', 'inline');

        $("#cMessage").html(messageBox("<h3 class='box'>Enemy Defeated! Select another enemy.<br>Choose wisely " + characters[player].name + ".</h3>"));
    }
}

function attack(){

    playAttack();

    if (playerAP == 0) {
        playerAP = characters[player].ap;  // doing this so I dont lose original value for New Game
    }
    if (playerHP == 1000) {
        playerHP = characters[player].hp; // doing this so I dont lose original value for New Game
    }
    if (defenderHP == 1000) {
        defenderHP = characters[defender].hp; // doing this so I dont lose original value for New Game
    }

    playerHP -= characters[defender].cAP;
    defenderHP -= playerAP;

    $(".hp" + player).html("<font color='#48ff00'>" + playerHP + "</font> HP");
    $(".hp" + defender).html("<font color='#48ff00'>" + defenderHP + "</font> HP");

    $("#defenderAttack").css('display', 'block');
    $("#characterAttack").css('display', 'block');
    $("#characterAttack").html(messageBox("You attacked " + characters[defender].name + " for <font color='red'>" + playerAP + "</font> damage!"));
    $("#defenderAttack").html(messageBox(characters[defender].name + " attacked you for <font color='red'>" + characters[defender].cAP + "</font> damage!"));

    if (playerHP <= 0) {
        $("#rpgAttack").css('display', 'none');
        $("#rpgTop").css('display', 'none');
        $("#rpgMiddle").css('display', 'none');
        $("#defenderAttack").css('display', 'none');
        $("#characterAttack").css('display', 'none');

        $("#cMessage").css('display', 'block');
        $(rpgBottom).addClass("bounceInUp"); // adding CSS animation from animate.css
        $("#cMessage").html(messageBox("<h3 class='centerMessageBox animated bounceInUp'>" + characters[player].name + " You Lost. Better luck next time!<br>Press the Enter key to play again.</h3>"));
                
        charState = "none";
        gameState = "notPlaying";
        losses++;
        $("#losses").html(losses);
    }
    else if (defenderHP <= 0){
        won();
    }

    // Purely for CSS animation
    if ($("#" + player).hasClass("bounceInLeft")) {
        $("#" + player).removeClass("bounceInLeft").addClass("wobble");
    } else if ($("#" + player).hasClass("wobble")){
        $("#" + player).removeClass("wobble").addClass("shake");
    } else {
        $("#" + player).removeClass("shake").addClass("wobble");
    }

    // Purely for CSS animation
    if ($("#" + defender).hasClass("bounceInRight")) {
        $("#" + defender).removeClass("bounceInRight").addClass("shake");
    } else if ($("#" + defender).hasClass("shake")){
        $("#" + defender).removeClass("shake").addClass("wobble");
    } else {
        $("#" + defender).removeClass("wobble").addClass("shake");
    }

    playerAP += characters[player].ap;
    
}


document.onkeyup = function(event) {
    // Start Game By Pressing Enter
    var x = event.charCode || event.keyCode; // depending on browser - for compatibility
    if (x === 13) {
        if (gameState == "notPlaying") { // If Enter is pressed while playing game, avoid reset
            clear();
            showCharacters();
        }
    }
}

$(document).on('click','.char',function() {
    if (gameState == "playing" && charState != "defenderSelected") {
        if (charState == "characterSelected") {
            charState = "defenderSelected";
            $("#cMessage").css('display', 'none');
            $("#rpgAttack").css('display', 'inline');
        } else if (charState == "none") {
            charState = "characterSelected";
        }         
        characterSelect(this);
    }
});

$(document).on('click','#attack',function() {
    attack();
});

window.onload = function() {
    $("#rpgTop").css('display', 'none');
    $("#rpgMiddle").css('display', 'none');
    $("#rpgBottom").css('display', 'none');
    $("#rpgStatus").css('display', 'none');
    $("#rpgAttack").css('display', 'none');
    $("#cMessage").css('display', 'none');
    $("#defenderAttack").css('display', 'none');
    $("#characterAttack").css('display', 'none');
    $("#player").css('display', 'none');
    $("#enemy").css('display', 'none');
}
