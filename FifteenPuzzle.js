let priorTileDiv;
let currentTileDiv;
let rows = 4;
let cols = 4;
let gameStarted = false;
let gameEnded = false;
let readyToStart = false;
let tiles = [];
let pieces = [];
let moves = 0;
let timer = false;
let hour = 0;
let minute = 0;
let second = 0;
let count = 0;
let gridId;
let colorScheme;
let colorPalette = [
    "#ffb399",
    "#ffe699",
    "#99ffe6",
    "#4dffff",
    "#99ccff",
    "#b399ff",
    "#ff99ff",
    "#ff99b3",
    "#ff9999",
    "#ffe6e6"
];
var startTime, endTime;

function debugGame(){
    console.log("readyToStart: " + readyToStart);
    console.log("gameStarted: " + gameStarted);
    console.log("gameEnded: " + gameEnded);
}

function startTimer() {
    startTime = performance.now();
    timer = true;
    //displayCurrentTimer();
};

function displayCurrentTimer(){
    if(timer){
        currentEndTime = performance.now();
        var timeDiff = currentEndTime - startTime; //in ms
        // strip the ms
        timeDiff /= 1000;
        document.getElementById("timerDisplay").innerHTML = "timer: " + timeDiff;
        setTimeout(displayCurrentTimer, 300);
    }
    
}

function endTimer() {
    timer = false;
    endTime = performance.now();
    var timeDiff = endTime - startTime; //in ms
    // strip the ms
    timeDiff /= 1000;
    document.getElementById("timerDisplay").innerHTML = "timer: " + timeDiff;
    

    // get seconds 
    //var seconds = Math.round(timeDiff);
    //console.log(seconds + " seconds");
}

function createGridContainer(){
    let gameDiv = document.getElementById("gameDiv")
    let newGrid = document.createElement("div");
    let gridStyle = "grid-template-rows : ";
    gridId = "gridContainer" + rows + "_" + cols;
    for(let i = 1; i <= rows; i++){
        gridStyle = gridStyle + "70px ";
    }
    gridStyle = gridStyle + "; grid-template-columns : "
    for(let i = 1; i <= cols; i++){
        gridStyle = gridStyle + "70px ";
    }
    gridStyle = gridStyle + "; width : ";
    gridStyle = gridStyle + ((cols * 73) - 3) + "px";
    gridStyle = gridStyle + "; height : ";
    gridStyle = gridStyle + ((rows * 73) - 3) + "px";
    gridStyle = gridStyle + ";";
    newGrid.id = gridId;
    newGrid.setAttribute("class", "grid-container");
    newGrid.setAttribute("style", gridStyle);
    gameDiv.appendChild(newGrid);
}

function recolorPieces(){
    for(let i = 0; i < pieces.length; i++){
        document.getElementById(pieces[i].id).setAttribute("style", `background-color : ${pieces[i].color}`);
    }
}

function colorPieces(colorScheme){
    console.log(colorScheme);
    switch(colorScheme){
        case "Rows":
            for(let row = 1; row <= rows; row++){
                for(let p = 0; p < pieces.length; p++){
                    let thisPiece = pieces.find(piece => piece.id == pieces[p].id);
                    if(thisPiece.tileRow == row){
                        pieces[p].color = colorPalette[row - 1]; //correct for index
                    }
                }
            }
            break;
        case "Solid":
            for(let i = 0; i < pieces.length; i++){
                pieces[i].color = "#81e7d6";
            }
            break;
        case "Fringe":
            for(let row = 1; row <= rows; row++){
                for(let i = 0; i < pieces.length; i++){
                    if(pieces[i].tileRow >= row && pieces[i].tileCol >= row){
                        pieces[i].color = colorPalette[row - 1];
                    }
                }
            }
    }
    pieces.find(piece => piece.value == "").color = "#eef4f7";
    recolorPieces();
}

function createTiles() {
    createGridContainer();
    let gridContainerDiv = document.getElementById(gridId);
    for(let row = 1; row <= rows; row++){
        for(let col = 1; col <= cols; col++){
            let thisPiece = document.createElement("div");
            let thisPieceText = col + (cols * (row - 1));
            if(col == cols && row == rows){
                thisPieceText = "";
            }
            thisPiece.id = row + "_" + col;
            thisPiece.setAttribute("onmouseenter", "onTileHover(this)");
            thisPiece.setAttribute("class", "tile");
            thisPiece.innerHTML = thisPieceText;
            gridContainerDiv.appendChild(thisPiece);
            let piece = { 
                value : thisPieceText,
                id : thisPiece.id,
                finalValue : thisPieceText,
                tileRow : row,
                tileCol : col,
                upId : (row - 1) + "_" + col,
                downId : (row + 1) + "_" + col,
                rightId : row + "_" + (col + 1),
                leftId : row + "_" + (col - 1)
            };
            pieces.push(piece);
        }
    }
    console.log(pieces);
    colorPieces(colorScheme);
}

function checkIfSolved(){
    let solved = true;
    pieces.forEach((piece) => {
        if(piece.finalValue != piece.value){
            solved = false;
        }
    })

    if(solved == true){
        document.getElementById("solvedMessage").innerHTML = "solved: YES!";
        gameEnded = true;
        endTimer();
    } else {
        document.getElementById("solvedMessage").innerHTML = "solved: no...";
    }
    setMessage();
}

function switchTiles(prior, current, isScramble) {
    if(gameStarted == false && isScramble != true){
        gameStarted = true;
        startTimer();
        console.log('game started');
        setMessage();
    }
    //capture current values
    let currentPiece = pieces.find(piece => piece.id == current.id);
    let priorPiece = pieces.find(piece => piece.id == prior.id);
    let currentVal = currentPiece.value;
    let priorVal = priorPiece.value;
    let currentColor = currentPiece.color;
    let priorColor = priorPiece.color;
    //switcheroo
    prior.innerHTML = currentVal;
    priorPiece.color = currentColor;
    priorPiece.tile = current.tile;
    priorPiece.value = currentVal;
    currentPiece.color = priorColor;
    current.innerHTML = priorVal;
    currentPiece.tile = prior.tile;
    currentPiece.value = priorVal;
    
    recolorPieces();
    if(gameStarted == true){
        moves++;
        document.getElementById("moveCounter").innerHTML = 'moves: ' + moves;
    }
    if(isScramble == false){
        checkIfSolved();
    }
}

function setMessage(){
    messageDiv = document.getElementById("solvedMessage");
    if(readyToStart == false){
        messageDiv.innerHTML = "Ready...";
        messageDiv.setAttribute("style","background-color : gray");
    }
    if(readyToStart == true && gameStarted == false){
        messageDiv.innerHTML = "Ready!";
        messageDiv.setAttribute("style","background-color : yellow");
    }
    if(readyToStart == true && gameStarted == true && gameEnded == false){
        messageDiv.innerHTML = "Go!";
        messageDiv.setAttribute("style","background-color : lightgreen");
    }
    if(readyToStart == true && gameStarted == true && gameEnded == true){
        messageDiv.innerHTML = "Done!";
        messageDiv.setAttribute("style","background-color : lightblue");
    }
}

function onTileHover(e){
    if(gameEnded == true){return;}
    let current = document.getElementById(e.id);
    let currentPiece = pieces.find(piece => piece.id == e.id);
    if(readyToStart == false){
        if(priorTileDiv.innerHTML == "" && current.innerHTML == ""){
            document.getElementById("currentTileDivText").innerHTML = "current tile: " + e.id;
            readyToStart = true;
            setMessage();
        }
    } else {
        if(current.innerHTML == ""){
            setMessage();
        }
        trackTileMove(current, false);
    }
}

function trackTileMove(current, isScramble){
    priorTileDiv = currentTileDiv;
    document.getElementById("priorTileDivText").innerHTML = "prior tile: " + priorTileDiv.id;
    currentTileDiv = current;
    document.getElementById("currentTileDivText").innerHTML = "current tile: " + current.id;
    let currentPiece = pieces.find(piece => piece.id == current.id);
    let priorPiece = pieces.find(piece => piece.id == priorTileDiv.id);
    let legalMove = false;
    if(priorPiece.upId == currentPiece.id){
        legalMove = true;
    } else if(priorPiece.downId == currentPiece.id){
        legalMove = true;
    } else if(priorPiece.rightId == currentPiece.id){
        legalMove = true;
    } else if(priorPiece.leftId == currentPiece.id){
        legalMove = true;
    }
    if(priorTileDiv.innerHTML == "" && legalMove == true){
        switchTiles(priorTileDiv, currentTileDiv, isScramble);
    }
}

function loadPuzzle() {
    rows = document.getElementById("rows").value;
    cols = document.getElementById("cols").value;
    colorScheme = document.getElementById("colorScheme").value;
    createTiles();
    currentTileDiv = document.getElementById(rows + "_" + cols);
    priorTileDiv = document.getElementById(rows + "_" + cols);
    console.log(currentTileDiv);
    console.log(priorTileDiv);
    scramble();
    setMessage();
}

function getRow(t){
    return t.substr(0,t.indexOf("_"));
}
function getCol(t){
    return t.substr(t.indexOf("_") + 1);
}
function checkLegalMove(thisPiece){
    let legalDivs = [];
    if(getRow(thisPiece.upId) * 1 != 0){
        legalDivs.push(document.getElementById(thisPiece.upId));
    }
    //check if down move row is not greater than row count
    if(getRow(thisPiece.downId) * 1 <= rows){
        legalDivs.push(document.getElementById(thisPiece.downId));
    }
    //check if right move col is not greater than col count
    if(getCol(thisPiece.rightId) * 1 <= cols){
        legalDivs.push(document.getElementById(thisPiece.rightId));
    }
    //check if left move col is not zero
    if(getCol(thisPiece.leftId) * 1 != 0){
        legalDivs.push(document.getElementById(thisPiece.leftId));
    }
    return legalDivs;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max) + 1;
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function scramble(){
    for(let i = 1; i < 5000; i++){
        let currentPiece = pieces.find(piece => piece.id == currentTileDiv.id);
        let legalDivs = checkLegalMove(currentPiece);
        let randomNum = getRandomInt(0, legalDivs.length - 1);
        nextTile = legalDivs[randomNum];
        trackTileMove(nextTile, true);
    }

    priorTileDiv = currentTileDiv;
}

function resetBoard(){
    gameEnded = false;
    gameStarted = false;
    readyToStart = false;
    timer = false;
    moves = 0;
    tiles = [];
    pieces = [];
    document.getElementById("gameDiv").innerHTML = null;
    document.getElementById("timerDisplay").innerHTML = "timer: 00:00:00:00"
    loadPuzzle();
}