/**
 * Version of the PDPA policy members accept at sign-up (AU-08). Bump it when the policy text
 * changes, so each profile records which version the member agreed to.
 */
export const PDPA_POLICY_VERSION = "draft-1";

/**
 * Affiliations for employees (AU-05). PLACEHOLDER: the real list (การไฟฟ้าเขต / สำนักงาน)
 * comes from the training center; see spec 001, Open Questions.
 */
export const AFFILIATIONS = [
  "การไฟฟ้าเขตตัวอย่าง 1",
  "การไฟฟ้าเขตตัวอย่าง 2",
  "สำนักงานตัวอย่าง",
] as const;
