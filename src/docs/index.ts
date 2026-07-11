import { authPaths } from "./auth.docs";
import { charactersPaths } from "./characters.docs";
import { rankingsPaths } from "./rankings.docs";
import { searchPaths } from "./search.docs";
import { shipsPaths } from "./ships.docs";
import { votesPaths } from "./votes.docs";
import { worksPaths } from "./works.docs";

export const paths = {
  ...authPaths,
  ...searchPaths,
  ...rankingsPaths,
  ...worksPaths,
  ...charactersPaths,
  ...shipsPaths,
  ...votesPaths,
} as const;