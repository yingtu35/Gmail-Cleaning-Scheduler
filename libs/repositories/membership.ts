import { eq } from "drizzle-orm";
import { db } from "@/models/db";
import { MembershipTiersTable } from "@/models/schema";
import { MembershipTier } from "@/types/membershipTier";

export async function findMembershipTierByPriceId(priceId: string): Promise<MembershipTier | null> {
    const membershipTier = await db.query.MembershipTiersTable.findFirst({
      where: eq(MembershipTiersTable.priceId, priceId),
    });
    return membershipTier ?? null;
} 