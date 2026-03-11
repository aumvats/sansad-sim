import type { BillObject } from "@/src/types/bill";
import type { PresidentialAction } from "@/src/types/simulation";

/**
 * Compute the President's action on a bill.
 * In India, the President is largely ceremonial — almost always signs.
 */
export function computePresidentialAction(
  bill: BillObject
): PresidentialAction {
  // Money bills: President CANNOT return
  if (bill.bill_type === "money") {
    return "ASSENT";
  }

  // Constitutional amendments: President MUST sign
  if (bill.bill_type === "constitutional_amendment") {
    return "ASSENT";
  }

  // Government bills that passed both houses: ~98% assent
  if (bill.introduced_by === "government") {
    // Very rare return — only if extremely controversial
    if (bill.controversy_level > 0.9 && Math.random() < 0.02) {
      return "RETURN";
    }
    return "ASSENT";
  }

  // Private member bills: slightly higher chance of return
  if (bill.introduced_by === "private_member") {
    if (bill.controversy_level > 0.8 && Math.random() < 0.15) {
      return "RETURN";
    }
    return "ASSENT";
  }

  // Pocket veto: extremely rare (only 1 confirmed case in 75 years)
  if (bill.controversy_level > 0.95 && Math.random() < 0.01) {
    return "POCKET_VETO";
  }

  return "ASSENT";
}

/** Get a human-readable explanation of the presidential action */
export function getPresidentialReasoning(
  action: PresidentialAction,
  bill: BillObject
): string {
  switch (action) {
    case "ASSENT":
      if (bill.bill_type === "money") {
        return "The President must give assent to Money Bills under Article 109.";
      }
      if (bill.bill_type === "constitutional_amendment") {
        return "The President must give assent to Constitutional Amendment Bills under Article 368.";
      }
      return "The President gives assent on the advice of the Council of Ministers.";
    case "RETURN":
      return "The President exercises suspensive veto, returning the bill to Parliament for reconsideration. If Parliament passes it again, the President must sign.";
    case "POCKET_VETO":
      return "The President withholds assent indefinitely — an extremely rare constitutional manoeuvre with no time limit prescribed.";
  }
}
