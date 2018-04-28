/*
  indices for each series:
  okc 0
  celts 1
  cavs 2

  values:
  0 - fave in 4
  1 - fave in 5
  2 - fave in 6
  3 - fave in 7
  4 - dog in 7
  5 - dog in 6
  6 - dog in 5
  7 - dog in 4
*/
const leftPad = require('left-pad');
const picks = {
  jerry: {
    startPoints: 3,
    0: 2,
    1: 5,
    2: 1,
    lockitin: -1, // index
  },
  fray: {
    startPoints: 6,
    0: 3,
    1: 4,
    2: 0,
    lockitin: 2,
  },
  andrew: {
    startPoints: 7,
    0: 3,
    1: 2,
    2: 2,
    lockitin: -1,
  },
  gret: {
    startPoints: 3,
    0: 4,
    1: 2,
    2: 0,
    lockitin: -1,
  },
  flex: {
    startPoints: 3,
    0: 3,
    1: 3,
    2: 2,
    lockitin: -1,
  },
  mark: {
    startPoints: 4,
    0: 3,
    1: 5,
    2: 0,
    lockitin: -1,
  },
  kaf: {
    startPoints: 4,
    0: 2,
    1: 2,
    2: 1,
    lockitin: 2,
  },
  ian: {
    startPoints: 2,
    0: 1,
    1: 2,
    2: 0,
    lockitin: -1,
  },
  scott: {
    startPoints: 4,
    0: 5,
    1: 3,
    2: 1,
    lockitin: -1,
  },
  can: {
    startPoints: 8,
    0: 2,
    1: 2,
    2: 2,
    lockitin: -1,
  },
  ryan: {
    startPoints: 2,
    0: 2,
    1: 5,
    2: 0,
    lockitin: -1,
  }
}
const teams = ['OKC', 'UTA', 'BOS', 'MIL', 'CLE', 'IND'];
const possibleOutcomes = [
  [3, 5],
  [3, 4],
  [2, 4]
];
const NUM_SERIES = possibleOutcomes.length;
const POSSIBILITIES = Math.pow(8, NUM_SERIES);
const lastPlaceStats = {};
const oneVoneRecord = {};
Object.keys(picks).forEach(name => lastPlaceStats[name] = 0);
resetCurrentRoundScores();

// iterate through every possible timeline
let numPossibleTimelines = 0;
let num2wayTies = 0;
let num3wayTies = 0;
for(let i = 0; i < POSSIBILITIES; i++) {
  let oct = (i).toString(8);
  let padded = leftPad(oct, NUM_SERIES, '0');
  if(!timelinePossible(padded)) {
    continue;
  }
  numPossibleTimelines++;
  let outcomes = padded.split('').map(x => Number(x));
  updateScoresForTimeline(outcomes);
  let lastPlaceFinishers = getLastPlace();
  lastPlaceFinishers.forEach(name => lastPlaceStats[name]++);
  if(lastPlaceFinishers.length > 1) {
    console.log(getResultsStrings(outcomes));
  }

  if(lastPlaceFinishers.length == 2) num2wayTies++;
  if(lastPlaceFinishers.length == 3) num3wayTies++;
  oneVone('fray', 'gret', oneVoneRecord);

  resetCurrentRoundScores();
}
console.log(`Num timelines left: ${numPossibleTimelines}`);
// console.log(oneVoneRecord);
console.log(lastPlaceStats);
console.log(`Num 2 way ties: ${num2wayTies}`);
console.log(`Num 3 way ties: ${num3wayTies}`);

function getSeriesResultsString(seriesNumber, outcome) {
  faveTeamIndex = seriesNumber * 2;
  dogTeamIndex = seriesNumber * 2 + 1;
  if(outcome < 4) {
    return (`${teams[faveTeamIndex]} ${outcome + 4}`);
  } else {
    return (`${teams[dogTeamIndex]} ${11 - outcome}`);
  }
}

function getResultsStrings(outcome) {
  return outcome.map((_outcome, index) => getSeriesResultsString(index, _outcome)).join(' ');
}

function oneVone(player1, player2, record) {
  if(!oneVoneRecord[player1] && !oneVoneRecord[player2]) {
    oneVoneRecord[player1] = 0;
    oneVoneRecord[player2] = 0;
    oneVoneRecord.tied = 0;
  }

  if(picks[player1].currentPoints > picks[player2].currentPoints)
    record[player1] += 1
  else if(picks[player1].currentPoints < picks[player2].currentPoints)
    record[player2] += 1
  else {
    record.tied += 1
  }
}

function getLastPlace() {
  // returns array
  let minScore = picks.jerry.currentPoints;
  Object.keys(picks).forEach(name => {
    if(picks[name].currentPoints < minScore) {
      minScore = picks[name].currentPoints;
    }
  });
  return Object.keys(picks).filter(name => picks[name].currentPoints === minScore);
}

function updateScoresForTimeline(outcomes) {
  let playerNames = Object.keys(picks);
  // for each series:
  outcomes.forEach((outcomeNum, index) =>
    playerNames.forEach(name => {
      // first check if lockitin used on series, if so calculate then dip
      let pick4series = picks[name][index];
      if(picks[name].lockitin === index) {
        if(pick4series === outcomeNum) {
          picks[name].currentPoints += 4;
        } else {
          if((pick4series < 4 && outcomeNum > 3) || (pick4series > 3 && outcomeNum < 4)) {
            picks[name].currentPoints -= 4;
          }
        }
      } else {
        // else add 1 for right winner
        // add 1 for right number of games
        if((pick4series < 4 && outcomeNum < 4) || (pick4series > 3 && outcomeNum > 3)) {
          picks[name].currentPoints += 1;
          if(pick4series === outcomeNum) {
            picks[name].currentPoints += 1;
          }
        }
      }
    })
  );
}

function timelinePossible(timelineOctStr) {
  for(let i = 0; i < timelineOctStr.length; i++) {
    let seriesOutcome = timelineOctStr[i];
    let possibleOutcomesRange = possibleOutcomes[i];
    let minPoss = possibleOutcomesRange[0];
    let maxPoss = possibleOutcomesRange[1];
    if(seriesOutcome < minPoss || seriesOutcome > maxPoss) {
      return false;
    }
  }
  return true;
}

function resetCurrentRoundScores() {
  let players = Object.keys(picks);
  players.forEach(playerName => picks[playerName].currentPoints = picks[playerName].startPoints);
}
