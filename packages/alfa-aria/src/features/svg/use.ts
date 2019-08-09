import * as Roles from "../../roles";
import { Any, Feature } from "../../types";

/**
 * @see https://www.w3.org/TR/svg-aam/#mapping_role_table
 */
export const Use: Feature = {
  element: "use",
  /**
   * @todo In certain rare circumstances the role will in this case be graphics-object. Investigate.
   */
  allowedRoles: () => Any(Roles)
};