import { unzip, zip } from "../..";
import { PlayerDataV3, TeamV3 } from "./interfaces";
import { TournamentTestDataV3 } from "./test-data";

// https://stackoverflow.com/a/46322186/721704
// abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_.~
describe.skip("Coder", () => {
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
        teams: [],
        togetherGroups: [],
        vectorTeamIds: [],
        matchResults: [],
        // teams,
        // togetherGroups: [
        //   ["zak", "vadym", "oleg old"],
        //   ["alan", "rezo"],
        // ],
        // vectorTeamIds,
        // matchResults: [
        //   [1, 2, 0, 1],
        //   [1, 3, 3, 2],
        //   [3, 1, 4, 0],
        // ],
      };

      const zipped = zip(data);
      const response = unzip(zipped);

      expect(data).toMatchObject(response);
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

      expect(expectObject).toMatchObject(matchObject);
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

      for (const team of param.teams) {
        team.name = team.captain;
        team.players = team.players.map(x => {
          return { ...x, level: undefined };
        });
      }

      expect(param).toMatchObject(response);
    });
  });
});
