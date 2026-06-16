// mockData.mjs — realistic fallback so the app is fully usable
// without an API key while still demonstrating every feature.
// ---------------------------------------------------------------

export const LEAGUES = [
  { id: 47, name: "Premier League", country: "England", short: "EPL" },
  { id: 87, name: "La Liga", country: "Spain", short: "LIG" },
  { id: 55, name: "Serie A", country: "Italy", short: "SEA" },
  { id: 54, name: "Bundesliga", country: "Germany", short: "BUN" },
  { id: 53, name: "Ligue 1", country: "France", short: "LIG1" },
  { id: 12310, name: "CAF Champions League", country: "Africa", short: "CAF" }
];

// ---------- Fixtures ----------
export const MOCK_FIXTURES = {
  47: [
    {
      id: "m1",
      home: { id: 8650, name: "Liverpool", logoId: 8650 },
      away: { id: 9825, name: "Arsenal", logoId: 9825 },
      score: { home: 2, away: 1 },
      status: "FT",
      minute: null,
      kickoff: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      venue: "Anfield"
    },
    {
      id: "m2",
      home: { id: 8456, name: "Man City", logoId: 8456 },
      away: { id: 10260, name: "Man United", logoId: 10260 },
      score: { home: 1, away: 1 },
      status: "LIVE",
      minute: 67,
      kickoff: new Date(Date.now() - 1000 * 60 * 67).toISOString(),
      venue: "Etihad"
    },
    {
      id: "m3",
      home: { id: 8455, name: "Chelsea", logoId: 8455 },
      away: { id: 8586, name: "Tottenham", logoId: 8586 },
      score: { home: 0, away: 0 },
      status: "UPCOMING",
      minute: null,
      kickoff: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(),
      venue: "Stamford Bridge"
    },
    {
      id: "m4",
      home: { id: 9879, name: "Aston Villa", logoId: 9879 },
      away: { id: 10261, name: "Newcastle", logoId: 10261 },
      score: { home: 0, away: 0 },
      status: "UPCOMING",
      minute: null,
      kickoff: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
      venue: "Villa Park"
    },
    {
      id: "m5",
      home: { id: 8602, name: "Brighton", logoId: 8602 },
      away: { id: 9817, name: "Brentford", logoId: 9817 },
      score: { home: 3, away: 2 },
      status: "FT",
      minute: null,
      kickoff: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      venue: "Amex"
    }
  ],
  87: [
    {
      id: "m6",
      home: { id: 8634, name: "Real Madrid", logoId: 8634 },
      away: { id: 8633, name: "Barcelona", logoId: 8633 },
      score: { home: 2, away: 2 },
      status: "LIVE",
      minute: 81,
      kickoff: new Date(Date.now() - 1000 * 60 * 81).toISOString(),
      venue: "Bernabéu"
    },
    {
      id: "m7",
      home: { id: 9906, name: "Atlético Madrid", logoId: 9906 },
      away: { id: 8696, name: "Sevilla", logoId: 8696 },
      score: { home: 1, away: 0 },
      status: "FT",
      minute: null,
      kickoff: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      venue: "Metropolitano"
    }
  ],
  55: [
    {
      id: "m8",
      home: { id: 9885, name: "Inter", logoId: 9885 },
      away: { id: 9823, name: "AC Milan", logoId: 9823 },
      score: { home: 1, away: 1 },
      status: "FT",
      minute: null,
      kickoff: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
      venue: "San Siro"
    },
    {
      id: "m9",
      home: { id: 9882, name: "Juventus", logoId: 9882 },
      away: { id: 9876, name: "Napoli", logoId: 9876 },
      score: { home: 0, away: 0 },
      status: "UPCOMING",
      minute: null,
      kickoff: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(),
      venue: "Allianz Stadium"
    }
  ],
  54: [
    {
      id: "m10",
      home: { id: 9823, name: "Bayern Munich", logoId: 9823 },
      away: { id: 9789, name: "Dortmund", logoId: 9789 },
      score: { home: 3, away: 2 },
      status: "FT",
      minute: null,
      kickoff: new Date(Date.now() - 1000 * 60 * 60 * 27).toISOString(),
      venue: "Allianz Arena"
    }
  ],
  53: [
    {
      id: "m11",
      home: { id: 9847, name: "PSG", logoId: 9847 },
      away: { id: 9748, name: "Marseille", logoId: 9748 },
      score: { home: 2, away: 0 },
      status: "FT",
      minute: null,
      kickoff: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
      venue: "Parc des Princes"
    }
  ],
  12310: [
    {
      id: "m12",
      home: { id: 9999, name: "Al Ahly", logoId: 9999 },
      away: { id: 9998, name: "Mamelodi Sundowns", logoId: 9998 },
      score: { home: 1, away: 1 },
      status: "FT",
      minute: null,
      kickoff: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
      venue: "Cairo International"
    }
  ]
};

// ---------- Standings ----------
const buildStandings = (teams) =>
  teams.map((t, i) => ({
    rank: i + 1,
    teamId: t[0],
    teamName: t[1],
    played: t[2],
    won: t[3],
    drawn: t[4],
    lost: t[5],
    gf: t[6],
    ga: t[7],
    gd: t[6] - t[7],
    pts: t[3] * 3 + t[4]
  }));

export const MOCK_STANDINGS = {
  47: buildStandings([
    [8456, "Man City", 16, 12, 3, 1, 38, 14],
    [8650, "Liverpool", 16, 11, 3, 2, 35, 15],
    [9825, "Arsenal", 16, 10, 4, 2, 30, 16],
    [9879, "Aston Villa", 16, 10, 2, 4, 28, 18],
    [10261, "Newcastle", 16, 8, 4, 4, 26, 19],
    [8586, "Tottenham", 16, 8, 3, 5, 30, 22],
    [8455, "Chelsea", 16, 7, 4, 5, 24, 20],
    [10260, "Man United", 16, 7, 3, 6, 22, 21],
    [8602, "Brighton", 16, 6, 4, 6, 25, 25],
    [8197, "West Ham", 16, 6, 4, 6, 22, 24],
    [9817, "Brentford", 16, 5, 5, 6, 21, 22],
    [9879, "Crystal Palace", 16, 5, 4, 7, 18, 23],
    [8678, "Fulham", 16, 4, 5, 7, 17, 24],
    [9892, "Wolves", 16, 4, 4, 8, 16, 25],
    [9879, "Everton", 16, 4, 4, 8, 15, 24],
    [8197, "Bournemouth", 16, 3, 5, 8, 17, 28],
    [10204, "Nottingham", 16, 3, 4, 9, 14, 27],
    [9879, "Luton", 16, 2, 4, 10, 13, 31],
    [9892, "Burnley", 16, 2, 3, 11, 12, 32],
    [9879, "Sheffield Utd", 16, 1, 3, 12, 10, 38]
  ]),
  87: buildStandings([
    [8634, "Real Madrid", 16, 13, 2, 1, 36, 12],
    [9906, "Atlético", 16, 11, 3, 2, 32, 15],
    [8633, "Barcelona", 16, 10, 3, 3, 30, 16],
    [8696, "Sevilla", 16, 8, 4, 4, 24, 18],
    [8633, "Athletic Bilbao", 16, 8, 3, 5, 22, 17],
    [9783, "Real Sociedad", 16, 7, 4, 5, 21, 18],
    [10205, "Villarreal", 16, 6, 5, 5, 20, 20],
    [8559, "Real Betis", 16, 6, 4, 6, 19, 21],
    [9866, "Valencia", 16, 5, 5, 6, 17, 20],
    [8593, "Girona", 16, 5, 4, 7, 18, 23],
    [9782, "Mallorca", 16, 4, 6, 6, 14, 18],
    [9941, "Getafe", 16, 4, 5, 7, 15, 19],
    [9783, "Osasuna", 16, 4, 4, 8, 13, 22],
    [8538, "Las Palmas", 16, 4, 3, 9, 12, 23],
    [8696, "Celta Vigo", 16, 3, 5, 8, 14, 24],
    [9558, "Rayo Vallecano", 16, 3, 5, 8, 11, 22],
    [8696, "Cádiz", 16, 2, 6, 8, 10, 23],
    [9560, "Alavés", 16, 3, 3, 10, 11, 28],
    [9786, "Granada", 16, 1, 5, 10, 12, 31],
    [9786, "Almería", 16, 1, 3, 12, 10, 34]
  ])
};

// fill the smaller leagues with proper mock tables
const LEAGUE_MOCK_TEAMS = {
  55: [ // Serie A
    [9885, "Inter Milan"], [9882, "Juventus"], [9823, "AC Milan"],
    [9876, "Napoli"], [9887, "Roma"], [9880, "Lazio"],
    [9884, "Atalanta"], [9881, "Fiorentina"], [9878, "Torino"], [9886, "Bologna"]
  ],
  54: [ // Bundesliga
    [9823, "Bayern Munich"], [9789, "Dortmund"], [9787, "RB Leipzig"],
    [9788, "Leverkusen"], [9790, "Frankfurt"], [9792, "Wolfsburg"],
    [9791, "Freiburg"], [9793, "Hoffenheim"], [9794, "Mainz"], [9795, "Augsburg"]
  ],
  53: [ // Ligue 1
    [9847, "PSG"], [9748, "Marseille"], [9750, "Lyon"],
    [9749, "Monaco"], [9751, "Lille"], [9752, "Nice"],
    [9753, "Rennes"], [9754, "Lens"], [9755, "Strasbourg"], [9756, "Nantes"]
  ],
  12310: [ // CAF Champions League
    [9999, "Al Ahly"], [9998, "Mamelodi Sundowns"], [10001, "Wydad"], [10002, "ES Tunis"],
    [10003, "TP Mazembe"], [10004, "Zamalek"], [10005, "Raja Casablanca"],
    [10006, "Simba SC"], [10007, "Hearts of Oak"], [10008, "Kaizer Chiefs"]
  ]
};

[55, 54, 53, 12310].forEach((id) => {
  if (!MOCK_STANDINGS[id]) {
    const teams = LEAGUE_MOCK_TEAMS[id] || [];
    MOCK_STANDINGS[id] = teams.map(([teamId, teamName], i) => ({
      rank: i + 1,
      teamId,
      teamName,
      played: 16 - i,
      won: Math.max(0, 12 - i * 1.1 | 0),
      drawn: 2,
      lost: Math.max(0, i * 1.1 | 0),
      gf: Math.max(8, 32 - i * 2),
      ga: Math.max(8, 12 + i * 2),
      gd: Math.max(-10, 20 - i * 3),
      pts: Math.max(2, 38 - i * 3)
    }));
  }
});

// ---------- Match detail ----------
export const MOCK_MATCH_DETAIL = {
  m1: {
    id: "m1",
    home: { id: 8650, name: "Liverpool", logoId: 8650 },
    away: { id: 9825, name: "Arsenal", logoId: 9825 },
    score: { home: 2, away: 1 },
    status: "FT",
    venue: "Anfield",
    kickoff: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    events: [
      { minute: 14, type: "goal", team: "home", player: "Salah", detail: "Assist: Robertson" },
      { minute: 32, type: "yellow", team: "away", player: "Saka" },
      { minute: 41, type: "goal", team: "away", player: "Saka", detail: "Penalty" },
      { minute: 58, type: "sub", team: "home", player: "Diaz on for Jota" },
      { minute: 71, type: "goal", team: "home", player: "Núñez", detail: "Header" },
      { minute: 85, type: "yellow", team: "home", player: "Van Dijk" }
    ],
    stats: {
      possession: { home: 58, away: 42 },
      shots: { home: 16, away: 9 },
      shotsOnTarget: { home: 7, away: 3 },
      corners: { home: 8, away: 4 },
      fouls: { home: 9, away: 14 },
      xG: { home: 2.4, away: 1.1 }
    },
    lineups: {
      home: {
        formation: "4-3-3",
        starters: [
          { num: 1, name: "Alisson" },
          { num: 66, name: "Alexander-Arnold" },
          { num: 4, name: "Van Dijk" },
          { num: 32, name: "Matip" },
          { num: 26, name: "Robertson" },
          { num: 3, name: "Fabinho" },
          { num: 6, name: "Thiago" },
          { num: 8, name: "Henderson" },
          { num: 11, name: "Salah" },
          { num: 9, name: "Núñez" },
          { num: 20, name: "Jota" }
        ]
      },
      away: {
        formation: "4-3-3",
        starters: [
          { num: 22, name: "Ramsdale" },
          { num: 18, name: "Tomiyasu" },
          { num: 6, name: "Gabriel" },
          { num: 4, name: "Saliba" },
          { num: 3, name: "Tierney" },
          { num: 5, name: "Partey" },
          { num: 8, name: "Ødegaard" },
          { num: 34, name: "Xhaka" },
          { num: 7, name: "Saka" },
          { num: 9, name: "Jesus" },
          { num: 35, name: "Martinelli" }
        ]
      }
    }
  }
};

// fill detail for the other fixtures with a templated default
Object.values(MOCK_FIXTURES)
  .flat()
  .forEach((f) => {
    if (!MOCK_MATCH_DETAIL[f.id]) {
      MOCK_MATCH_DETAIL[f.id] = {
        ...f,
        events:
          f.status === "UPCOMING"
            ? []
            : [
                { minute: 22, type: "goal", team: "home", player: "Striker A" },
                { minute: 54, type: "yellow", team: "away", player: "Defender X" },
                { minute: 76, type: "goal", team: "away", player: "Striker B" }
              ],
        stats:
          f.status === "UPCOMING"
            ? null
            : {
                possession: { home: 52, away: 48 },
                shots: { home: 12, away: 10 },
                shotsOnTarget: { home: 5, away: 4 },
                corners: { home: 6, away: 5 },
                fouls: { home: 10, away: 12 },
                xG: { home: 1.6, away: 1.3 }
              },
        lineups: {
          home: { formation: "4-3-3", starters: defaultStarters(f.home.name) },
          away: { formation: "4-2-3-1", starters: defaultStarters(f.away.name) }
        }
      };
    }
  });

function defaultStarters(teamName) {
  return Array.from({ length: 11 }, (_, i) => ({
    num: i + 1,
    name: `${teamName} P${i + 1}`
  }));
}

// ---------- Players ----------
export const MOCK_PLAYERS = {
  p1: {
    id: "p1",
    name: "Mohamed Salah",
    photoId: 209399,
    position: "Forward",
    nationality: "Egypt",
    age: 32,
    club: { id: 8650, name: "Liverpool" },
    stats: { goals: 14, assists: 6, appearances: 16, yellow: 1, red: 0 },
    form: [7.8, 8.2, 7.4, 9.1, 6.9, 8.0, 7.6, 8.5, 7.2, 8.9],
    news: [
      { title: "Salah extends scoring streak to six matches", source: "BBC", time: "2h ago" },
      { title: "Klopp praises forward's leadership", source: "Sky Sports", time: "1d ago" }
    ]
  },
  p2: {
    id: "p2",
    name: "Erling Haaland",
    photoId: 1187498,
    position: "Striker",
    nationality: "Norway",
    age: 24,
    club: { id: 8456, name: "Man City" },
    stats: { goals: 18, assists: 3, appearances: 15, yellow: 2, red: 0 },
    form: [9.2, 7.5, 8.8, 8.1, 9.5, 7.9, 8.3, 9.0, 8.4, 8.7],
    news: [
      { title: "Haaland nets brace in derby draw", source: "ESPN", time: "1h ago" },
      { title: "Pep: 'He's only getting better'", source: "The Athletic", time: "3d ago" }
    ]
  },
  p3: {
    id: "p3",
    name: "Bukayo Saka",
    photoId: 961995,
    position: "Winger",
    nationality: "England",
    age: 23,
    club: { id: 9825, name: "Arsenal" },
    stats: { goals: 8, assists: 9, appearances: 16, yellow: 3, red: 0 },
    form: [7.4, 8.0, 7.8, 8.3, 7.1, 8.5, 7.9, 8.2, 7.6, 8.4],
    news: [{ title: "Saka in talks over new long-term deal", source: "Guardian", time: "5h ago" }]
  },
  p4: {
    id: "p4",
    name: "Jude Bellingham",
    photoId: 1100319,
    position: "Midfielder",
    nationality: "England",
    age: 21,
    club: { id: 8634, name: "Real Madrid" },
    stats: { goals: 13, assists: 4, appearances: 15, yellow: 4, red: 0 },
    form: [8.8, 8.1, 9.0, 7.9, 8.6, 8.3, 9.2, 8.0, 8.7, 8.4],
    news: [{ title: "Bellingham named La Liga player of the month", source: "Marca", time: "1d ago" }]
  },
  p5: {
    id: "p5",
    name: "Lionel Messi",
    photoId: 158023,
    position: "Forward",
    nationality: "Argentina",
    age: 37,
    club: { id: 9999, name: "Inter Miami" },
    stats: { goals: 11, assists: 10, appearances: 14, yellow: 1, red: 0 },
    form: [8.5, 9.0, 7.8, 8.7, 9.2, 8.1, 8.9, 7.6, 9.0, 8.4],
    news: [{ title: "Messi masterclass sends Miami through", source: "ESPN", time: "3h ago" }]
  },
  p6: {
    id: "p6",
    name: "Cristiano Ronaldo",
    photoId: 17981,
    position: "Forward",
    nationality: "Portugal",
    age: 39,
    club: { id: 8888, name: "Al Nassr" },
    stats: { goals: 20, assists: 5, appearances: 18, yellow: 2, red: 0 },
    form: [8.0, 8.4, 7.9, 8.6, 9.0, 7.5, 8.3, 8.8, 8.1, 8.5],
    news: [{ title: "Ronaldo breaks another all-time record", source: "Sky Sports", time: "1d ago" }]
  },
  p7: {
    id: "p7",
    name: "Kylian Mbappé",
    photoId: 342229,
    position: "Forward",
    nationality: "France",
    age: 25,
    club: { id: 8634, name: "Real Madrid" },
    stats: { goals: 22, assists: 7, appearances: 17, yellow: 1, red: 0 },
    form: [9.0, 8.7, 9.3, 8.5, 9.1, 8.8, 9.4, 8.2, 9.0, 8.6],
    news: [{ title: "Mbappé fires Real Madrid to top of La Liga", source: "Marca", time: "5h ago" }]
  },
  p8: {
    id: "p8",
    name: "Vinicius Junior",
    photoId: 371998,
    position: "Winger",
    nationality: "Brazil",
    age: 24,
    club: { id: 8634, name: "Real Madrid" },
    stats: { goals: 12, assists: 11, appearances: 16, yellow: 3, red: 0 },
    form: [8.2, 8.9, 7.7, 9.0, 8.4, 8.6, 9.1, 7.8, 8.5, 8.8],
    news: [{ title: "Vinicius shortlisted for Ballon d'Or", source: "L'Equipe", time: "2d ago" }]
  },
  p9: {
    id: "p9",
    name: "Harry Kane",
    photoId: 202126,
    position: "Striker",
    nationality: "England",
    age: 31,
    club: { id: 9823, name: "Bayern Munich" },
    stats: { goals: 25, assists: 6, appearances: 18, yellow: 1, red: 0 },
    form: [8.8, 9.0, 8.5, 9.2, 8.7, 9.1, 8.4, 8.9, 9.3, 8.6],
    news: [{ title: "Kane breaks Bundesliga scoring record", source: "Kicker", time: "6h ago" }]
  },
  p10: {
    id: "p10",
    name: "Phil Foden",
    photoId: 303473,
    position: "Midfielder",
    nationality: "England",
    age: 24,
    club: { id: 8456, name: "Man City" },
    stats: { goals: 9, assists: 12, appearances: 16, yellow: 2, red: 0 },
    form: [8.1, 8.4, 7.9, 8.7, 8.2, 8.6, 8.0, 8.8, 7.6, 8.5],
    news: [{ title: "Foden earns England Player of the Year", source: "BBC Sport", time: "1d ago" }]
  },
  p11: {
    id: "p11",
    name: "Lamine Yamal",
    photoId: 1110176,
    position: "Winger",
    nationality: "Spain",
    age: 17,
    club: { id: 8633, name: "Barcelona" },
    stats: { goals: 10, assists: 13, appearances: 17, yellow: 1, red: 0 },
    form: [8.5, 8.9, 8.2, 9.1, 8.7, 8.4, 9.0, 8.6, 8.3, 8.8],
    news: [{ title: "Yamal becomes youngest La Liga top scorer", source: "Marca", time: "4h ago" }]
  },
  p12: {
    id: "p12",
    name: "Marcus Rashford",
    photoId: 258923,
    position: "Forward",
    nationality: "England",
    age: 27,
    club: { id: 10260, name: "Man United" },
    stats: { goals: 7, assists: 4, appearances: 15, yellow: 2, red: 0 },
    form: [7.2, 7.8, 6.9, 7.5, 8.0, 7.1, 7.6, 7.4, 7.9, 7.3],
    news: [{ title: "Rashford back in form after difficult spell", source: "The Athletic", time: "2h ago" }]
  }
};

// ---------- Teams ----------
export const MOCK_TEAMS = {
  8650: {
    id: 8650,
    name: "Liverpool",
    logoId: 8650,
    league: "Premier League",
    formation: "4-3-3",
    stats: { goalsFor: 35, goalsAgainst: 15, cleanSheets: 6, wins: 11 },
    form: ["W", "W", "D", "W", "L", "W", "W", "D", "W", "W"],
    topScorers: [
      { name: "Salah", goals: 14, id: "p1" },
      { name: "Núñez", goals: 8, id: "p10" },
      { name: "Diaz", goals: 5, id: "p11" },
      { name: "Jota", goals: 4, id: "p12" }
    ],
    recent: [
      { opp: "Arsenal", home: true, result: "W", score: "2-1" },
      { opp: "Brighton", home: false, result: "W", score: "3-1" },
      { opp: "Tottenham", home: true, result: "D", score: "1-1" },
      { opp: "Chelsea", home: false, result: "W", score: "2-0" },
      { opp: "Man Utd", home: true, result: "L", score: "0-1" }
    ]
  },
  8456: {
    id: 8456,
    name: "Man City",
    logoId: 8456,
    league: "Premier League",
    formation: "4-3-3",
    stats: { goalsFor: 38, goalsAgainst: 14, cleanSheets: 7, wins: 12 },
    form: ["W", "W", "W", "D", "W", "W", "W", "L", "W", "D"],
    topScorers: [
      { name: "Haaland", goals: 18, id: "p2" },
      { name: "Foden", goals: 7, id: "p20" },
      { name: "Álvarez", goals: 6, id: "p21" }
    ],
    recent: [
      { opp: "Man Utd", home: true, result: "D", score: "1-1" },
      { opp: "Tottenham", home: false, result: "W", score: "3-2" },
      { opp: "Liverpool", home: true, result: "W", score: "2-0" },
      { opp: "Arsenal", home: false, result: "W", score: "2-1" },
      { opp: "Newcastle", home: true, result: "W", score: "3-0" }
    ]
  }
};

// ---------- Head-to-head ----------
export const MOCK_H2H = {
  "8650-9825": {
    homeWins: 12,
    draws: 5,
    awayWins: 8,
    homeGoals: 38,
    awayGoals: 29,
    matches: [
      { date: "2025-09-12", home: "Liverpool", away: "Arsenal", score: "2-1" },
      { date: "2025-02-04", home: "Arsenal", away: "Liverpool", score: "3-1" },
      { date: "2024-12-23", home: "Liverpool", away: "Arsenal", score: "1-1" },
      { date: "2024-04-23", home: "Arsenal", away: "Liverpool", score: "0-0" },
      { date: "2023-10-08", home: "Liverpool", away: "Arsenal", score: "2-2" }
    ]
  }
};

// ---------- News ----------
export const MOCK_NEWS = [
  {
    title: "Late winner sees Liverpool top the table",
    source: "BBC Sport",
    time: "1h ago",
    image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=70"
  },
  {
    title: "Pep names new captain ahead of derby weekend",
    source: "The Athletic",
    time: "3h ago",
    image: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800&q=70"
  },
  {
    title: "Real Madrid edge El Clásico thriller in stoppage time",
    source: "Marca",
    time: "5h ago",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=70"
  },
  {
    title: "Bayern set transfer record with surprise winter signing",
    source: "Kicker",
    time: "8h ago",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=70"
  },
  {
    title: "Champions League draw produces blockbuster ties",
    source: "UEFA.com",
    time: "12h ago",
    image: "https://images.unsplash.com/photo-1577471488278-16eec37ffcc2?w=800&q=70"
  },
  {
    title: "Inside the rise of Africa's next big talent factory",
    source: "ESPN",
    time: "1d ago",
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=70"
  }
];

// ---------- Betting ----------
export const MOCK_BETTING = {
  m3: { home: 2.1, draw: 3.4, away: 3.6, homeForm: ["W","D","W","L","W"], awayForm: ["W","W","D","L","W"] },
  m4: { home: 2.4, draw: 3.2, away: 2.9, homeForm: ["L","W","D","W","W"], awayForm: ["W","W","W","D","L"] },
  m9: { home: 1.9, draw: 3.6, away: 4.1, homeForm: ["W","W","D","W","W"], awayForm: ["L","D","W","W","D"] }
};
