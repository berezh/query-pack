import { TeamV3 } from "./interfaces";

export class TournamentTestDataV3 {
  public static get4Teams() {
    const testTeams: TeamV3[] = [
      {
        id: 1,
        name: "Team 1",
        captain: "zak",
        players: [
          {
            name: "zak",
            level: "star",
          },
          {
            name: "vadym",
            level: "good",
          },
          {
            name: "andrei ian",
            level: "normal",
          },
          {
            name: "oleg old",
            level: "notbad",
          },
          {
            name: "david",
            level: "unknown",
          },
        ],
      },
      {
        id: 2,
        name: "Team 2",
        captain: "alan",
        players: [
          {
            name: "alan",
            level: "star",
          },
          {
            name: "rezo",
            level: "good",
          },
          {
            name: "anton ta",
            level: "normal",
          },
          {
            name: "alexis",
            level: "notbad",
          },
          {
            name: "viktor",
            level: "notbad",
          },
        ],
      },
      {
        id: 3,
        name: "Team 3",
        captain: "mikhail",
        players: [
          {
            name: "mikhail",
            level: "star",
          },
          {
            name: "oleg p",
            level: "good",
          },
          {
            name: "beso",
            level: "normal",
          },
          {
            name: "vasily",
            level: "normal",
          },
          {
            name: "timur s",
            level: "notbad",
          },
        ],
      },
      {
        id: 4,
        name: "Team 4",
        captain: "sokol",
        players: [
          {
            name: "sokol",
            level: "star",
          },
          {
            name: "andrei",
            level: "good",
          },
          {
            name: "sergio",
            level: "normal",
          },
          {
            name: "sania",
            level: "notbad",
          },
          {
            name: "serg",
            level: "notbad",
          },
        ],
      },
    ];

    return testTeams;
  }
}
