import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(name + " is required for the one-time bootstrap.");
  return value;
}

async function main() {
  const organizationName = required("BOOTSTRAP_ORG_NAME");
  const locationCode = required("BOOTSTRAP_LOCATION_CODE").toUpperCase();
  const locationName = required("BOOTSTRAP_LOCATION_NAME");
  const adminName = required("BOOTSTRAP_ADMIN_NAME");
  const adminEmail = required("BOOTSTRAP_ADMIN_EMAIL").toLowerCase();
  const adminPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD ?? "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail)) {
    throw new Error("BOOTSTRAP_ADMIN_EMAIL must be a valid email address.");
  }
  if (adminPassword.length < 12) {
    throw new Error("BOOTSTRAP_ADMIN_PASSWORD must contain at least 12 characters.");
  }

  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    throw new Error("Bootstrap refused: users already exist. Use the normal admin workflow instead.");
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  const created = await prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({ data: { name: organizationName } });
    const location = await tx.garageLocation.create({
      data: { organizationId: organization.id, code: locationCode, name: locationName }
    });
    const user = await tx.user.create({
      data: {
        organizationId: organization.id,
        primaryLocationId: location.id,
        fullName: adminName,
        email: adminEmail,
        passwordHash,
        role: "SUPER_ADMIN"
      },
      select: { id: true, email: true, role: true, organizationId: true, primaryLocationId: true }
    });
    return { organizationId: organization.id, locationId: location.id, admin: user };
  });

  console.log("Bootstrap completed. Keep this output private:");
  console.log(JSON.stringify(created, null, 2));
  console.log("Remove bootstrap environment variables after this one-time setup.");
}

main()
  .catch((error) => {
    console.error("Bootstrap failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
