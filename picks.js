/*
  indices for each series:
  0 Milwaukee vs Miami
  1 Celtics vs Hawks
  2 6ers vs Nets
  3 Cavs vs Knicks
  4 Nuggets vs Wolves
  5 Grizz vs Lakers
  6 Kings vs Warriors
  7 Suns vs Clippers

  Outcome values:
  0 - fave in 4
  1 - fave in 5
  2 - fave in 6
  3 - fave in 7
  4 - dog in 7
  5 - dog in 6
  6 - dog in 5
  7 - dog in 4
*/
const leftPad = (str, numSeries, padChar) => str.padStart(numSeries, padChar);
const picks = {
  jerry: {
    startPoints: 0,
    // picks
    0: 1,
    1: 0,
    2: 1,
    3: 3,
    4: 2,
    5: 2,
    6: 4,
    7: 2,
    lockitin: 1, // index
  },
  fray: {
    startPoints: 0,
    0: 0,
    1: 1,
    2: 1,
    3: 2,
    4: 1,
    5: 2,
    6: 5,
    7: 1,
    lockitin: 0,
  },
  gret: {
    startPoints: 0,
    0: 1,
    1: 0,
    2: 1,
    3: 2,
    4: 1,
    5: 5,
    6: 4,
    7: 2,
    lockitin: 0,
  },
  flex: {
    startPoints: 0,
    0: 1,
    1: 0,
    2: 1,
    3: 4,
    4: 1,
    5: 5,
    6: 4,
    7: 2,
    lockitin: 1,
  },
  mark: {
    startPoints: 0,
    0: 2,
    1: 1,
    2: 0,
    3: 2,
    4: 1,
    5: 3,
    6: 3,
    7: 2,
    lockitin: 2,
  },
  kaf: {
    startPoints: 0,
    0: 1,
    1: 2,
    2: 1,
    3: 2,
    4: 0,
    5: 3,
    6: 5,
    7: 2,
    lockitin: 3,
  },
  ian: {
    startPoints: 0,
    0: 1,
    1: 0,
    2: 1,
    3: 2,
    4: 0,
    5: 1,
    6: 3,
    7: 2,
    lockitin: 1,
  },
  scott: {
    startPoints: 0,
    0: 1,
    1: 1,
    2: 2,
    3: 3,
    4: 1,
    5: 3,
    6: 5,
    7: 1,
    lockitin: 1,
  },
  can: {
    startPoints: 0,
    0: 0,
    1: 1,
    2: 3,
    3: 4,
    4: 1,
    5: 3,
    6: 5,
    7: 2,
    lockitin: 4,
  },
  ryan: {
    startPoints: 0,
    0: 1,
    1: 0,
    2: 1,
    3: 5,
    4: 0,
    5: 2,
    6: 4,
    7: 1,
    lockitin: 0,
  },
  will: {
    startPoints: 0,
    0: 0,
    1: 1,
    2: 2,
    3: 2,
    4: 1,
    5: 2,
    6: 4,
    7: 2,
    lockitin: 0
  },
  gratz: {
    startPoints: 0,
    0: 1,
    1: 1,
    2: 1,
    3: 2,
    4: 1,
    5: 2,
    6: 3,
    7: 2,
    lockitin: 0
  },
  mikemorris: {
    startPoints: 0,
    0: 1,
    1: 2,
    2: 1,
    3: 4,
    4: 3,
    5: 4,
    6: 5,
    7: 1,
    lockitin: 0
  },
  johndefalco: {
    startPoints: 0,
    0: 1,
    1: 2,
    2: 1,
    3: 2,
    4: 0,
    5: 4,
    6: 5,
    7: 2,
    lockitin: 0
  },
}
const teams = [
  'MIL', 'MIA',
  'BOS', 'ATL',
  'PHI', 'BKN',
  'CLE', 'NYK',
  'DEN', 'MIN',
  'MEM', 'LAL',
  'SAC', 'GS ',
  'PHX', 'LAC'
];
// Outcome Ranges values (again):
// 0 - fave in 4
// 1 - fave in 5
// 2 - fave in 6
// 3 - fave in 7
// 4 - dog in 7
// 5 - dog in 6
// 6 - dog in 5
// 7 - dog in 4
const outcomesRanges = [
  [6, 6], // mil vs mia
  [2, 2], // bos vs atl
  [0, 0], // phi vs bkn
  [6, 6], // cle vs nyk
  [1, 1], // den vs min
  [3, 5], // mem vs lal
  [3, 4], // sac vs gs
  [1, 1], // phx vs lac
];
const NUM_SERIES = outcomesRanges.length;
const POSSIBILITIES = Math.pow(8, NUM_SERIES);
const lastPlaceStats = {};
const oneVoneRecord = {};
const fourAndFiveLosers = [];
Object.keys(picks).forEach(name => lastPlaceStats[name] = 0);
resetCurrentRoundScores();

// iterate through every possible timeline
let numPossibleTimelines = 0;
let tiesArray = [];
for(let i = 0; i < 15; i++) {
  tiesArray.push(0);
}

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
  tiesArray[lastPlaceFinishers.length]++;
  if (lastPlaceFinishers.length >= 4) {
    fourAndFiveLosers.push(getResultsStrings(outcomes));
  }

  console.log(getResultsStrings(outcomes));
  console.log(lastPlaceFinishers);

  resetCurrentRoundScores();
}
console.log(`Num timelines left: ${numPossibleTimelines}`);
console.log('Number of timelines each person finishes last in:');
console.log(lastPlaceStats);
for(let i = 1; i < 16; i++) {
  console.log(`Num ${i} way ties left: ${tiesArray[i]}`);
}
console.log(fourAndFiveLosers);

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
  let minScore = picks.fray.currentPoints;
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
    let outcomesRangesRange = outcomesRanges[i];
    let minPoss = outcomesRangesRange[0];
    let maxPoss = outcomesRangesRange[1];
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
