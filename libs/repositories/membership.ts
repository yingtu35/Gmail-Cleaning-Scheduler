import { eq } from "drizzle-orm";
import { db } from "@/models/db";
import { MembershipTiersTable } from "@/models/schema";
import { MembershipTier, TierDetails } from "@/types/membershipTier";

export async function findMembershipTierByPriceId(priceId: string): Promise<MembershipTier | null> {
    const membershipTier = await db.query.MembershipTiersTable.findFirst({
      where: eq(MembershipTiersTable.priceId, priceId),
    });
    return membershipTier ?? null;
}

export async function findMembershipTierDetailsById(id: number): Promise<TierDetails | null> {
    const membershipTier = await db.query.MembershipTiersTable.findFirst({
      where: eq(MembershipTiersTable.id, id),
      columns: {
        name: true,
        maxActiveJobs: true,
        maxTotalJobs: true,
        maxEmailsPerExec: true,
        maxWindowInMinutes: true,
        allowedScheduleFrequencies: true,
      },
    });
    return membershipTier ?? null;
}