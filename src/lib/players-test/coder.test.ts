import { unzip, zip } from "../..";
import { ZipOptions } from "../../interfaces";
import { PlayerDataV3, TeamV3 } from "./interfaces";
import { TournamentTestDataV3 } from "./test-data";

// https://stackoverflow.com/a/46322186/721704
// abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_.~
describe("Coder", () => {
  describe("encode/decode", () => {
    it("simple", () => {
      const teams = TournamentTestDataV3.get4Teams().map<TeamV3>(({ id, name, captain, players }) => {
        return { id, name, captain, players };
      });

      // random flow
      const vectorTeamIds = teams.map(x => x.id);

      const data: PlayerDataV3 = {
        date: "",
        time: "19:30",
        duration: "120",
        brake: "0",
        naming: "number",
        useColor: false,
        showLevel: true,
        teams,
        togetherGroups: [
          ["zak", "vadym", "oleg old"],
          ["alan", "rezo"],
        ],
        vectorTeamIds,
        matchResults: [
          [1, 2, 0, 1],
          [1, 3, 3, 2],
          [3, 1, 4, 0],
        ],
      };

      const zipped = zip(data);
      const response = unzip(zipped);

      expect(data).toEqual(response);
    });

    it("show level - false", () => {
      const teams = TournamentTestDataV3.get4Teams().map<TeamV3>(({ id, name, captain, players }) => {
        return { id, name, captain, players };
      });

      // random flow
      const vectorTeamIds = teams.map(x => x.id);

      const param: PlayerDataV3 = {
        date: "",
        time: "19:30",
        duration: "120",
        brake: "0",
        naming: "number",
        useColor: false,
        showLevel: false,
        teams,
        togetherGroups: [],
        vectorTeamIds,
        matchResults: [],
      };

      const metaString = zip(param);
      const response = unzip(metaString);

      for (const team of param.teams) {
        team.players = team.players.map(x => {
          return { ...x, level: undefined };
        });
      }

      const { teams: _p1, ...expectObject } = param;
      const { teams: _p2, ...matchObject } = response;

      expect(expectObject).toEqual(matchObject);
    });
    it("naming: captain", () => {
      const teams = TournamentTestDataV3.get4Teams().map<TeamV3>(({ id, name, captain, players }) => {
        return { id, name, captain, players };
      });

      // random flow
      const vectorTeamIds = teams.map(x => x.id);

      const param: PlayerDataV3 = {
        date: "",
        time: "19:30",
        duration: "120",
        brake: "0",
        naming: "captain",
        useColor: false,
        showLevel: false,
        teams,
        togetherGroups: [],
        vectorTeamIds,
        matchResults: [],
      };

      const metaString = zip(param);
      const response = unzip(metaString);

      // for (const team of param.teams) {
      //   team.name = team.captain;
      //   team.players = team.players.map(x => {
      //     return { ...x, level: undefined };
      //   });
      // }

      expect(param).toEqual(response);
    });

    it("includeUndefinedProperty: level: undefined", () => {
      const teams = TournamentTestDataV3.get4Teams().map<TeamV3>(({ id, name, captain, players }) => {
        return { id, name, captain, players };
      });

      // random flow
      const vectorTeamIds = teams.map(x => x.id);

      const param: PlayerDataV3 = {
        date: "",
        time: "19:30",
        duration: "120",
        brake: "0",
        naming: "captain",
        useColor: false,
        showLevel: false,
        teams,
        togetherGroups: [],
        vectorTeamIds,
        matchResults: [],
      };
      for (const team of param.teams) {
        team.name = team.captain;
        team.players = team.players.map(x => {
          return { ...x, level: undefined };
        });
      }

      const options: ZipOptions = {
        includeUndefinedProperty: true,
      };

      const metaString = zip(param, options);
      const response = unzip(metaString, options);

      expect(param).toEqual(response);
    });
  });

  describe("convertor", () => {
    it("simple", () => {
      const teams = TournamentTestDataV3.get4Teams().map<TeamV3>(({ id, name, captain, players }) => {
        return { id, name, captain, players };
      });

      // random flow
      const vectorTeamIds = teams.map(x => x.id);

      const data: PlayerDataV3 = {
        date: "",
        time: "19:30",
        duration: "120",
        brake: "0",
        naming: "number",
        useColor: false,
        showLevel: true,
        teams,
        togetherGroups: [
          ["zak", "vadym", "oleg old"],
          ["alan", "rezo"],
        ],
        vectorTeamIds,
        matchResults: [
          [1, 2, 0, 1],
          [1, 3, 3, 2],
          [3, 1, 4, 0],
        ],
      };

      const options: ZipOptions = {
        values: {
          naming: {
            captain: "c",
            number: "n",
            animal: "a",
            europeClub: "e",
          },
          teams: {
            players: {
              level: {
                unknown: 1,
                notbad: 2,
                normal: 3,
                good: 4,
                star: 5,
              },
            },
          },
        },
        fields: {
          date: 1,
          time: 2,
          duration: 3,
          brake: 4,
          naming: 5,
          userColor: 6,
          showLevel: 7,
          teams: [
            8,
            {
              id: 1,
              name: 2,
              captain: 3,
              players: [
                4,
                {
                  name: 1,
                  level: 2,
                },
              ],
            },
          ],
          togetherGroups: 9,
          vectorTeamIds: 10,
          matchResults: 11,
        },
      };

      const zipped = zip(data, options);
      const response = unzip(zipped, options);

      expect(data).toEqual(response);
    });
  });
});