import { z } from "zod";
import { QUERY_TO_Z_MAPPING } from "./queries.js";

export function validateQuery(query, args, result) {
  const argsSchema = z.tuple(QUERY_TO_Z_MAPPING[query].args);
  argsSchema.parse(args);

  if (Object.keys(QUERY_TO_Z_MAPPING[query].rows).length > 0) {
    const resultSchema = z.object(QUERY_TO_Z_MAPPING[query].rows);
    return resultSchema.parse(result);
  }

  return result;
}
