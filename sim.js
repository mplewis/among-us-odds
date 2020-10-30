Vue.use(BootstrapVue);

function times(count, behavior) {
  return Array(count).fill().map(behavior);
}

function randInt(min, maxe) {
  return Math.ceil(Math.random() * maxe) + min - 1;
}

function allArraysContainItem(item, arrs) {
  for (let arr of arrs) {
    if (!arr.includes(item)) return false;
  }
  return true;
}

function allArraysShareCommonItem(arrs) {
  first = arrs[0];
  rest = arrs.slice(1);
  for (let item of first) {
    if (allArraysContainItem(item, rest)) return true;
  }
  return false;
}

function windows(size, items) {
  ws = [];
  for (let i = 0; i < items.length - size + 1; i++) {
    ws.push(items.slice(i, size + i));
  }
  return ws;
}

function hasStreak(minLength) {
  return function (sets) {
    possibleStreaks = windows(minLength, sets);
    for (let possibleStreak of possibleStreaks) {
      if (allArraysShareCommonItem(possibleStreak)) return true;
    }
    return false;
  };
}

function simulateSession({
  playerCount,
  gamesPerSession,
  impostersPerGame,
  streakMinLength,
}) {
  const games = times(gamesPerSession, () =>
    times(impostersPerGame, () => randInt(1, playerCount))
  );
  return {
    session: games,
    streak: hasStreak(streakMinLength)(games),
  };
}

function simulateSessions({
  playerCount,
  sessionCount,
  gamesPerSession,
  impostersPerGame,
  streakMinLength,
}) {
  return times(sessionCount, () =>
    simulateSession({
      playerCount,
      gamesPerSession,
      impostersPerGame,
      streakMinLength,
    })
  );
}

new Vue({
  el: "#app",
  data: () => ({
    sessionCount: 1_000,
    gamesPerSession: 12,
    playerCount: 10,
    impostersPerGame: 2,
    streakMinLength: 3,
  }),
  computed: {
    sessions() {
      return simulateSessions({
        sessionCount: parseInt(this.sessionCount, 10),
        gamesPerSession: parseInt(this.gamesPerSession, 10),
        playerCount: parseInt(this.playerCount, 10),
        impostersPerGame: parseInt(this.impostersPerGame, 10),
        streakMinLength: parseInt(this.streakMinLength, 10),
      });
    },
    streaks() {
      return this.sessions.filter((s) => s.streak).length;
    },
  },
});
