import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient, Gender, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não configurada.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

interface EnsureShipData {
  workId: string;
  characterIds: [string, string];
  name?: string;
  imageUrl?: string;
  isKnown?: boolean;
  aliases?: string[];
}

async function ensureShip({
  workId,
  characterIds,
  name,
  imageUrl,
  isKnown = false,
  aliases = [],
}: EnsureShipData) {
  const normalizedIds = [...characterIds].sort();

  const possibleShips = await prisma.ship.findMany({
    where: {
      workId,
      characters: {
        every: {
          characterId: {
            in: normalizedIds,
          },
        },
      },
    },
    include: {
      characters: true,
    },
  });

  let ship = possibleShips.find(
    (item) =>
      item.characters.length === 2 &&
      item.characters.every((relation) =>
        normalizedIds.includes(relation.characterId)
      )
  );

  if (!ship) {
    ship = await prisma.ship.create({
      data: {
        workId,
        name,
        imageUrl,
        isKnown,
        characters: {
          create: normalizedIds.map((characterId) => ({
            characterId,
          })),
        },
      },
      include: {
        characters: true,
      },
    });
  } else {
    ship = await prisma.ship.update({
      where: {
        id: ship.id,
      },
      data: {
        name,
        imageUrl,
        isKnown,
      },
      include: {
        characters: true,
      },
    });
  }

  if (aliases.length > 0) {
    await prisma.shipAlias.createMany({
      data: aliases.map((alias) => ({
        name: alias,
        shipId: ship.id,
      })),
      skipDuplicates: true,
    });
  }

  return ship;
}

async function main() {
  const passwordHash = await bcrypt.hash("123456", 10);

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@myfavship.com",
    },
    update: {
      name: "Administrador",
      password: passwordHash,
      role: Role.ADMIN,
    },
    create: {
      name: "Administrador",
      email: "admin@myfavship.com",
      password: passwordHash,
      role: Role.ADMIN,
    },
  });

  const testUser = await prisma.user.upsert({
    where: {
      email: "user@myfavship.com",
    },
    update: {
      name: "Usuário de Teste",
      password: passwordHash,
      role: Role.USER,
    },
    create: {
      name: "Usuário de Teste",
      email: "user@myfavship.com",
      password: passwordHash,
      role: Role.USER,
    },
  });

  const animeCategory = await prisma.category.upsert({
    where: {
      name: "Anime",
    },
    update: {},
    create: {
      name: "Anime",
    },
  });

  const narutoWork = await prisma.work.upsert({
    where: {
      slug: "naruto",
    },
    update: {},
    create: {
      title: "Naruto",
      slug: "naruto",
      description: "Anime sobre ninjas e suas jornadas.",
      coverImageUrl: "naruto.jpg",
      releaseYear: 2002,
      categoryId: animeCategory.id,
    },
  });

  const dragonBallWork = await prisma.work.upsert({
    where: {
      slug: "dragon-ball",
    },
    update: {},
    create: {
      title: "Dragon Ball",
      slug: "dragon-ball",
      description: "Anime de artes marciais, aventuras e alienígenas.",
      coverImageUrl: "dragonball.jpg",
      releaseYear: 1986,
      categoryId: animeCategory.id,
    },
  });

  const naruto = await prisma.character.upsert({
    where: {
      slug_workId: {
        slug: "naruto-uzumaki",
        workId: narutoWork.id,
      },
    },
    update: {},
    create: {
      name: "Naruto Uzumaki",
      slug: "naruto-uzumaki",
      description: "Protagonista da obra Naruto.",
      imageUrl: "naruto-uzumaki.jpg",
      gender: Gender.MALE,
      workId: narutoWork.id,
    },
  });

  const hinata = await prisma.character.upsert({
    where: {
      slug_workId: {
        slug: "hinata-hyuga",
        workId: narutoWork.id,
      },
    },
    update: {},
    create: {
      name: "Hinata Hyuga",
      slug: "hinata-hyuga",
      description: "Ninja do clã Hyuga.",
      imageUrl: "hinata-hyuga.jpg",
      gender: Gender.FEMALE,
      workId: narutoWork.id,
    },
  });

  const goku = await prisma.character.upsert({
    where: {
      slug_workId: {
        slug: "son-goku",
        workId: dragonBallWork.id,
      },
    },
    update: {},
    create: {
      name: "Son Goku",
      slug: "son-goku",
      description: "Protagonista de Dragon Ball.",
      imageUrl: "son-goku.jpg",
      gender: Gender.MALE,
      workId: dragonBallWork.id,
    },
  });

  const vegeta = await prisma.character.upsert({
    where: {
      slug_workId: {
        slug: "vegeta",
        workId: dragonBallWork.id,
      },
    },
    update: {},
    create: {
      name: "Vegeta",
      slug: "vegeta",
      description: "Príncipe dos Saiyajins.",
      imageUrl: "vegeta.jpg",
      gender: Gender.MALE,
      workId: dragonBallWork.id,
    },
  });

  const naruhina = await ensureShip({
    workId: narutoWork.id,
    characterIds: [naruto.id, hinata.id],
    name: "NaruHina",
    imageUrl: "naruhina.jpg",
    isKnown: true,
    aliases: ["Naruto x Hinata", "Naruto e Hinata"],
  });

  const gokuvegeta = await ensureShip({
    workId: dragonBallWork.id,
    characterIds: [goku.id, vegeta.id],
    name: "GokuVegeta",
    imageUrl: "goku-vegeta.jpg",
    isKnown: true,
    aliases: ["Goku x Vegeta", "KakaVege"],
  });

  await prisma.vote.upsert({
    where: {
      userId_workId: {
        userId: testUser.id,
        workId: narutoWork.id,
      },
    },
    update: {
      shipId: naruhina.id,
    },
    create: {
      userId: testUser.id,
      workId: narutoWork.id,
      shipId: naruhina.id,
    },
  });

  await prisma.vote.upsert({
    where: {
      userId_workId: {
        userId: testUser.id,
        workId: dragonBallWork.id,
      },
    },
    update: {
      shipId: gokuvegeta.id,
    },
    create: {
      userId: testUser.id,
      workId: dragonBallWork.id,
      shipId: gokuvegeta.id,
    },
  });

  console.log("Seed concluído.");
  console.log(`Admin: ${admin.email} / 123456`);
  console.log(`Usuário: ${testUser.email} / 123456`);
  console.log(`Ships criados: ${naruhina.name}, ${gokuvegeta.name}`);
}

main()
  .catch((error) => {
    console.error("Erro ao executar o seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });