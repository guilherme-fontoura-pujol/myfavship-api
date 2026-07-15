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

  const gameCategory = await prisma.category.upsert({
  where: { name: "Jogo" },
  update: {},
  create: { name: "Jogo" },
});

const movieCategory = await prisma.category.upsert({
  where: { name: "Filme" },
  update: {},
  create: { name: "Filme" },
});

const seriesCategory = await prisma.category.upsert({
  where: { name: "Série" },
  update: {},
  create: { name: "Série" },
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

  const onePieceWork = await prisma.work.upsert({
  where: { slug: "one-piece" },
  update: {},
  create: {
    title: "One Piece",
    slug: "one-piece",
    description: "A aventura de Monkey D. Luffy em busca do One Piece.",
    coverImageUrl: "one-piece.jpg",
    releaseYear: 1999,
    categoryId: animeCategory.id,
  },
});

const bleachWork = await prisma.work.upsert({
  where: { slug: "bleach" },
  update: {},
  create: {
    title: "Bleach",
    slug: "bleach",
    description: "Ichigo Kurosaki torna-se um Shinigami.",
    coverImageUrl: "bleach.jpg",
    releaseYear: 2004,
    categoryId: animeCategory.id,
  },
});

const pokemonWork = await prisma.work.upsert({
  where: { slug: "pokemon" },
  update: {},
  create: {
    title: "Pokémon",
    slug: "pokemon",
    description: "Treinadores e batalhas Pokémon.",
    coverImageUrl: "pokemon.jpg",
    releaseYear: 1997,
    categoryId: animeCategory.id,
  },
});

const attackOnTitanWork = await prisma.work.upsert({
  where: { slug: "attack-on-titan" },
  update: {},
  create: {
    title: "Attack on Titan",
    slug: "attack-on-titan",
    description: "A humanidade enfrenta os Titãs.",
    coverImageUrl: "attack-on-titan.jpg",
    releaseYear: 2013,
    categoryId: animeCategory.id,
  },
});

const fmabWork = await prisma.work.upsert({
  where: { slug: "fullmetal-alchemist-brotherhood" },
  update: {},
  create: {
    title: "Fullmetal Alchemist: Brotherhood",
    slug: "fullmetal-alchemist-brotherhood",
    description: "Os irmãos Elric em busca da Pedra Filosofal.",
    coverImageUrl: "fmab.jpg",
    releaseYear: 2009,
    categoryId: animeCategory.id,
  },
});

const arcaneWork = await prisma.work.upsert({
  where: { slug: "arcane" },
  update: {},
  create: {
    title: "Arcane",
    slug: "arcane",
    description: "A história de Vi e Jinx em Piltover e Zaun.",
    coverImageUrl: "arcane.jpg",
    releaseYear: 2021,
    categoryId: seriesCategory.id,
  },
});

const harryPotterWork = await prisma.work.upsert({
  where: { slug: "harry-potter" },
  update: {},
  create: {
    title: "Harry Potter",
    slug: "harry-potter",
    description: "O mundo mágico de Hogwarts.",
    coverImageUrl: "harry-potter.jpg",
    releaseYear: 2001,
    categoryId: movieCategory.id,
  },
});

const theLastOfUsWork = await prisma.work.upsert({
  where: { slug: "the-last-of-us" },
  update: {},
  create: {
    title: "The Last of Us",
    slug: "the-last-of-us",
    description: "Joel e Ellie atravessam um mundo pós-apocalíptico.",
    coverImageUrl: "the-last-of-us.jpg",
    releaseYear: 2013,
    categoryId: gameCategory.id,
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

  const luffy = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "monkey-d-luffy",
      workId: onePieceWork.id,
    },
  },
  update: {},
  create: {
    name: "Monkey D. Luffy",
    slug: "monkey-d-luffy",
    description: "Capitão dos Piratas do Chapéu de Palha.",
    imageUrl: null,
    gender: Gender.MALE,
    workId: onePieceWork.id,
  },
});

const nami = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "nami",
      workId: onePieceWork.id,
    },
  },
  update: {},
  create: {
    name: "Nami",
    slug: "nami",
    description: "Navegadora dos Piratas do Chapéu de Palha.",
    imageUrl: null,
    gender: Gender.FEMALE,
    workId: onePieceWork.id,
  },
});

const zoro = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "roronoa-zoro",
      workId: onePieceWork.id,
    },
  },
  update: {},
  create: {
    name: "Roronoa Zoro",
    slug: "roronoa-zoro",
    description: "Espadachim dos Piratas do Chapéu de Palha.",
    imageUrl: null,
    gender: Gender.MALE,
    workId: onePieceWork.id,
  },
});

const sanji = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "sanji",
      workId: onePieceWork.id,
    },
  },
  update: {},
  create: {
    name: "Sanji",
    slug: "sanji",
    description: "Cozinheiro dos Piratas do Chapéu de Palha.",
    imageUrl: null,
    gender: Gender.MALE,
    workId: onePieceWork.id,
  },
});

const robin = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "nico-robin",
      workId: onePieceWork.id,
    },
  },
  update: {},
  create: {
    name: "Nico Robin",
    slug: "nico-robin",
    description: "Arqueóloga dos Piratas do Chapéu de Palha.",
    imageUrl: null,
    gender: Gender.FEMALE,
    workId: onePieceWork.id,
  },
});

const boa = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "boa-hancock",
      workId: onePieceWork.id,
    },
  },
  update: {},
  create: {
    name: "Boa Hancock",
    slug: "boa-hancock",
    description: "Imperatriz Pirata e capitã das Piratas Kuja.",
    imageUrl: null,
    gender: Gender.FEMALE,
    workId: onePieceWork.id,
  },
});

const usopp = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "usopp",
      workId: onePieceWork.id,
    },
  },
  update: {},
  create: {
    name: "Usopp",
    slug: "usopp",
    description: "Atirador dos Piratas do Chapéu de Palha.",
    imageUrl: null,
    gender: Gender.MALE,
    workId: onePieceWork.id,
  },
});

const chopper = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "tony-tony-chopper",
      workId: onePieceWork.id,
    },
  },
  update: {},
  create: {
    name: "Tony Tony Chopper",
    slug: "tony-tony-chopper",
    description: "Médico dos Piratas do Chapéu de Palha.",
    imageUrl: null,
    gender: Gender.MALE,
    workId: onePieceWork.id,
  },
});

const ichigo = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "ichigo-kurosaki",
      workId: bleachWork.id,
    },
  },
  update: {},
  create: {
    name: "Ichigo Kurosaki",
    slug: "ichigo-kurosaki",
    description: "Shinigami substituto e protagonista de Bleach.",
    imageUrl: null,
    gender: Gender.MALE,
    workId: bleachWork.id,
  },
});

const rukia = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "rukia-kuchiki",
      workId: bleachWork.id,
    },
  },
  update: {},
  create: {
    name: "Rukia Kuchiki",
    slug: "rukia-kuchiki",
    description: "Shinigami do clã Kuchiki.",
    imageUrl: null,
    gender: Gender.FEMALE,
    workId: bleachWork.id,
  },
});

const orihime = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "orihime-inoue",
      workId: bleachWork.id,
    },
  },
  update: {},
  create: {
    name: "Orihime Inoue",
    slug: "orihime-inoue",
    description: "Amiga de Ichigo com poderes espirituais.",
    imageUrl: null,
    gender: Gender.FEMALE,
    workId: bleachWork.id,
  },
});

const uryu = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "uryu-ishida",
      workId: bleachWork.id,
    },
  },
  update: {},
  create: {
    name: "Uryu Ishida",
    slug: "uryu-ishida",
    description: "Quincy e aliado de Ichigo.",
    imageUrl: null,
    gender: Gender.MALE,
    workId: bleachWork.id,
  },
});

const renji = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "renji-abarai",
      workId: bleachWork.id,
    },
  },
  update: {},
  create: {
    name: "Renji Abarai",
    slug: "renji-abarai",
    description: "Tenente da Sexta Divisão.",
    imageUrl: null,
    gender: Gender.MALE,
    workId: bleachWork.id,
  },
});

const byakuya = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "byakuya-kuchiki",
      workId: bleachWork.id,
    },
  },
  update: {},
  create: {
    name: "Byakuya Kuchiki",
    slug: "byakuya-kuchiki",
    description: "Capitão da Sexta Divisão.",
    imageUrl: null,
    gender: Gender.MALE,
    workId: bleachWork.id,
  },
});

const rangiku = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "rangiku-matsumoto",
      workId: bleachWork.id,
    },
  },
  update: {},
  create: {
    name: "Rangiku Matsumoto",
    slug: "rangiku-matsumoto",
    description: "Tenente da Décima Divisão.",
    imageUrl: null,
    gender: Gender.FEMALE,
    workId: bleachWork.id,
  },
});

const toshiro = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "toshiro-hitsugaya",
      workId: bleachWork.id,
    },
  },
  update: {},
  create: {
    name: "Toshiro Hitsugaya",
    slug: "toshiro-hitsugaya",
    description: "Capitão da Décima Divisão.",
    imageUrl: null,
    gender: Gender.MALE,
    workId: bleachWork.id,
  },
});

const ash = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "ash-ketchum",
      workId: pokemonWork.id,
    },
  },
  update: {},
  create: {
    name: "Ash Ketchum",
    slug: "ash-ketchum",
    description: "Treinador Pokémon da cidade de Pallet.",
    imageUrl: null,
    gender: Gender.MALE,
    workId: pokemonWork.id,
  },
});

const misty = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "misty",
      workId: pokemonWork.id,
    },
  },
  update: {},
  create: {
    name: "Misty",
    slug: "misty",
    description: "Líder de ginásio especializada em Pokémon de água.",
    imageUrl: null,
    gender: Gender.FEMALE,
    workId: pokemonWork.id,
  },
});

const brock = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "brock",
      workId: pokemonWork.id,
    },
  },
  update: {},
  create: {
    name: "Brock",
    slug: "brock",
    description: "Criador Pokémon e antigo líder de ginásio.",
    imageUrl: null,
    gender: Gender.MALE,
    workId: pokemonWork.id,
  },
});

const may = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "may",
      workId: pokemonWork.id,
    },
  },
  update: {},
  create: {
    name: "May",
    slug: "may",
    description: "Coordenadora Pokémon da região de Hoenn.",
    imageUrl: null,
    gender: Gender.FEMALE,
    workId: pokemonWork.id,
  },
});

const dawn = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "dawn",
      workId: pokemonWork.id,
    },
  },
  update: {},
  create: {
    name: "Dawn",
    slug: "dawn",
    description: "Coordenadora Pokémon da região de Sinnoh.",
    imageUrl: null,
    gender: Gender.FEMALE,
    workId: pokemonWork.id,
  },
});

const serena = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "serena",
      workId: pokemonWork.id,
    },
  },
  update: {},
  create: {
    name: "Serena",
    slug: "serena",
    description: "Artista Pokémon da região de Kalos.",
    imageUrl: null,
    gender: Gender.FEMALE,
    workId: pokemonWork.id,
  },
});

const jessie = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "jessie",
      workId: pokemonWork.id,
    },
  },
  update: {},
  create: {
    name: "Jessie",
    slug: "jessie",
    description: "Integrante da Equipe Rocket.",
    imageUrl: null,
    gender: Gender.FEMALE,
    workId: pokemonWork.id,
  },
});

const james = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "james",
      workId: pokemonWork.id,
    },
  },
  update: {},
  create: {
    name: "James",
    slug: "james",
    description: "Integrante da Equipe Rocket.",
    imageUrl: null,
    gender: Gender.MALE,
    workId: pokemonWork.id,
  },
});

const eren = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "eren-yeager",
      workId: attackOnTitanWork.id,
    },
  },
  update: {},
  create: {
    name: "Eren Yeager",
    slug: "eren-yeager",
    description: "Soldado da Tropa de Exploração.",
    imageUrl: null,
    gender: Gender.MALE,
    workId: attackOnTitanWork.id,
  },
});

const mikasa = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "mikasa-ackerman",
      workId: attackOnTitanWork.id,
    },
  },
  update: {},
  create: {
    name: "Mikasa Ackerman",
    slug: "mikasa-ackerman",
    description: "Soldado de elite e amiga de infância de Eren.",
    imageUrl: null,
    gender: Gender.FEMALE,
    workId: attackOnTitanWork.id,
  },
});

const armin = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "armin-arlert",
      workId: attackOnTitanWork.id,
    },
  },
  update: {},
  create: {
    name: "Armin Arlert",
    slug: "armin-arlert",
    description: "Estrategista da Tropa de Exploração.",
    imageUrl: null,
    gender: Gender.MALE,
    workId: attackOnTitanWork.id,
  },
});

const levi = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "levi-ackerman",
      workId: attackOnTitanWork.id,
    },
  },
  update: {},
  create: {
    name: "Levi Ackerman",
    slug: "levi-ackerman",
    description: "Capitão da Tropa de Exploração.",
    imageUrl: null,
    gender: Gender.MALE,
    workId: attackOnTitanWork.id,
  },
});

const hange = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "hange-zoe",
      workId: attackOnTitanWork.id,
    },
  },
  update: {},
  create: {
    name: "Hange Zoe",
    slug: "hange-zoe",
    description: "Pesquisadora e comandante da Tropa de Exploração.",
    imageUrl: null,
    gender: Gender.OTHER,
    workId: attackOnTitanWork.id,
  },
});

const historia = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "historia-reiss",
      workId: attackOnTitanWork.id,
    },
  },
  update: {},
  create: {
    name: "Historia Reiss",
    slug: "historia-reiss",
    description: "Integrante da Tropa de Exploração e herdeira real.",
    imageUrl: null,
    gender: Gender.FEMALE,
    workId: attackOnTitanWork.id,
  },
});

const ymir = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "ymir",
      workId: attackOnTitanWork.id,
    },
  },
  update: {},
  create: {
    name: "Ymir",
    slug: "ymir",
    description: "Soldado próxima de Historia Reiss.",
    imageUrl: null,
    gender: Gender.FEMALE,
    workId: attackOnTitanWork.id,
  },
});

const jean = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "jean-kirstein",
      workId: attackOnTitanWork.id,
    },
  },
  update: {},
  create: {
    name: "Jean Kirstein",
    slug: "jean-kirstein",
    description: "Soldado da Tropa de Exploração.",
    imageUrl: null,
    gender: Gender.MALE,
    workId: attackOnTitanWork.id,
  },
});

const annie = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "annie-leonhart",
      workId: attackOnTitanWork.id,
    },
  },
  update: {},
  create: {
    name: "Annie Leonhart",
    slug: "annie-leonhart",
    description: "Integrante da 104ª Divisão de Recrutas.",
    imageUrl: null,
    gender: Gender.FEMALE,
    workId: attackOnTitanWork.id,
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

  const luffyNami = await ensureShip({
  workId: onePieceWork.id,
  characterIds: [luffy.id, nami.id],
  name: "LuNa",
  isKnown: true,
  aliases: [
    "Luffy x Nami",
    "Monkey D. Luffy x Nami",
  ],
});

const zoroRobin = await ensureShip({
  workId: onePieceWork.id,
  characterIds: [zoro.id, robin.id],
  name: "ZoRobin",
  isKnown: true,
  aliases: [
    "Zoro x Robin",
    "Roronoa Zoro x Nico Robin",
  ],
});

const sanjiNami = await ensureShip({
  workId: onePieceWork.id,
  characterIds: [sanji.id, nami.id],
  name: "SaNami",
  isKnown: true,
  aliases: [
    "Sanji x Nami",
  ],
});

const luffyBoa = await ensureShip({
  workId: onePieceWork.id,
  characterIds: [luffy.id, boa.id],
  name: "LuBoa",
  isKnown: true,
  aliases: [
    "Luffy x Boa Hancock",
  ],
});

const ichigoOrihime = await ensureShip({
  workId: bleachWork.id,
  characterIds: [ichigo.id, orihime.id],
  name: "IchiHime",
  isKnown: true,
  aliases: ["Ichigo x Orihime"],
});

const ichigoRukia = await ensureShip({
  workId: bleachWork.id,
  characterIds: [ichigo.id, rukia.id],
  name: "IchiRuki",
  isKnown: true,
  aliases: ["Ichigo x Rukia"],
});

const renjiRukia = await ensureShip({
  workId: bleachWork.id,
  characterIds: [renji.id, rukia.id],
  name: "RenRuki",
  isKnown: true,
  aliases: ["Renji x Rukia"],
});

const toshiroRangiku = await ensureShip({
  workId: bleachWork.id,
  characterIds: [toshiro.id, rangiku.id],
  name: "HitsuMatsu",
  isKnown: true,
  aliases: ["Toshiro x Rangiku"],
});

const ashMisty = await ensureShip({
  workId: pokemonWork.id,
  characterIds: [ash.id, misty.id],
  name: "PokéShipping",
  isKnown: true,
  aliases: ["Ash x Misty"],
});

const ashSerena = await ensureShip({
  workId: pokemonWork.id,
  characterIds: [ash.id, serena.id],
  name: "AmourShipping",
  isKnown: true,
  aliases: ["Ash x Serena"],
});

const ashDawn = await ensureShip({
  workId: pokemonWork.id,
  characterIds: [ash.id, dawn.id],
  name: "PearlShipping",
  isKnown: true,
  aliases: ["Ash x Dawn"],
});

const jessieJames = await ensureShip({
  workId: pokemonWork.id,
  characterIds: [jessie.id, james.id],
  name: "RocketShipping",
  isKnown: true,
  aliases: ["Jessie x James"],
});

const erenMikasa = await ensureShip({
  workId: attackOnTitanWork.id,
  characterIds: [eren.id, mikasa.id],
  name: "EreMika",
  isKnown: true,
  aliases: ["Eren x Mikasa"],
});

const arminAnnie = await ensureShip({
  workId: attackOnTitanWork.id,
  characterIds: [armin.id, annie.id],
  name: "AruAni",
  isKnown: true,
  aliases: ["Armin x Annie"],
});

const historiaYmir = await ensureShip({
  workId: attackOnTitanWork.id,
  characterIds: [historia.id, ymir.id],
  name: "YumiHisu",
  isKnown: true,
  aliases: ["Ymir x Historia"],
});

const leviHange = await ensureShip({
  workId: attackOnTitanWork.id,
  characterIds: [levi.id, hange.id],
  name: "Levihan",
  isKnown: true,
  aliases: ["Levi x Hange"],
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

  await prisma.vote.upsert({
  where: {
    userId_workId: {
      userId: testUser.id,
      workId: onePieceWork.id,
    },
  },
  update: {
    shipId: luffyNami.id,
  },
  create: {
    userId: testUser.id,
    workId: onePieceWork.id,
    shipId: luffyNami.id,
  },
});

await prisma.vote.upsert({
  where: {
    userId_workId: {
      userId: testUser.id,
      workId: bleachWork.id,
    },
  },
  update: {
    shipId: ichigoRukia.id,
  },
  create: {
    userId: testUser.id,
    workId: bleachWork.id,
    shipId: ichigoRukia.id,
  },
});

await prisma.vote.upsert({
  where: {
    userId_workId: {
      userId: testUser.id,
      workId: pokemonWork.id,
    },
  },
  update: {
    shipId: ashMisty.id,
  },
  create: {
    userId: testUser.id,
    workId: pokemonWork.id,
    shipId: ashMisty.id,
  },
});

await prisma.vote.upsert({
  where: {
    userId_workId: {
      userId: testUser.id,
      workId: attackOnTitanWork.id,
    },
  },
  update: {
    shipId: erenMikasa.id,
  },
  create: {
    userId: testUser.id,
    workId: attackOnTitanWork.id,
    shipId: erenMikasa.id,
  },
});

const edward = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "edward-elric",
      workId: fmabWork.id,
    },
  },
  update: {},
  create: {
    name: "Edward Elric",
    slug: "edward-elric",
    description: "Alquimista Federal conhecido como Alquimista de Aço.",
    imageUrl: null,
    gender: Gender.MALE,
    workId: fmabWork.id,
  },
});

const winry = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "winry-rockbell",
      workId: fmabWork.id,
    },
  },
  update: {},
  create: {
    name: "Winry Rockbell",
    slug: "winry-rockbell",
    description: "Mecânica de automails e amiga de infância dos irmãos Elric.",
    imageUrl: null,
    gender: Gender.FEMALE,
    workId: fmabWork.id,
  },
});

const alphonse = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "alphonse-elric",
      workId: fmabWork.id,
    },
  },
  update: {},
  create: {
    name: "Alphonse Elric",
    slug: "alphonse-elric",
    description: "Irmão mais novo de Edward Elric.",
    imageUrl: null,
    gender: Gender.MALE,
    workId: fmabWork.id,
  },
});

const mayChang = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "may-chang",
      workId: fmabWork.id,
    },
  },
  update: {},
  create: {
    name: "May Chang",
    slug: "may-chang",
    description: "Princesa de Xing e praticante de alkahestria.",
    imageUrl: null,
    gender: Gender.FEMALE,
    workId: fmabWork.id,
  },
});

const royMustang = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "roy-mustang",
      workId: fmabWork.id,
    },
  },
  update: {},
  create: {
    name: "Roy Mustang",
    slug: "roy-mustang",
    description: "Alquimista Federal especializado em alquimia das chamas.",
    imageUrl: null,
    gender: Gender.MALE,
    workId: fmabWork.id,
  },
});

const rizaHawkeye = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "riza-hawkeye",
      workId: fmabWork.id,
    },
  },
  update: {},
  create: {
    name: "Riza Hawkeye",
    slug: "riza-hawkeye",
    description: "Oficial do exército e principal aliada de Roy Mustang.",
    imageUrl: null,
    gender: Gender.FEMALE,
    workId: fmabWork.id,
  },
});

const lingYao = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "ling-yao",
      workId: fmabWork.id,
    },
  },
  update: {},
  create: {
    name: "Ling Yao",
    slug: "ling-yao",
    description: "Príncipe de Xing em busca da imortalidade.",
    imageUrl: null,
    gender: Gender.MALE,
    workId: fmabWork.id,
  },
});

const lanFan = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "lan-fan",
      workId: fmabWork.id,
    },
  },
  update: {},
  create: {
    name: "Lan Fan",
    slug: "lan-fan",
    description: "Guarda-costas leal de Ling Yao.",
    imageUrl: null,
    gender: Gender.FEMALE,
    workId: fmabWork.id,
  },
});

const edwardWinry = await ensureShip({
  workId: fmabWork.id,
  characterIds: [edward.id, winry.id],
  name: "EdWin",
  isKnown: true,
  aliases: [
    "Edward x Winry",
    "Edward Elric x Winry Rockbell",
  ],
});

const royRiza = await ensureShip({
  workId: fmabWork.id,
  characterIds: [royMustang.id, rizaHawkeye.id],
  name: "Royai",
  isKnown: true,
  aliases: [
    "Roy x Riza",
    "Roy Mustang x Riza Hawkeye",
  ],
});

const alphonseMay = await ensureShip({
  workId: fmabWork.id,
  characterIds: [alphonse.id, mayChang.id],
  name: "AlMei",
  isKnown: true,
  aliases: [
    "Alphonse x May",
    "Alphonse Elric x May Chang",
  ],
});

const lingLanFan = await ensureShip({
  workId: fmabWork.id,
  characterIds: [lingYao.id, lanFan.id],
  name: "LingFan",
  isKnown: true,
  aliases: ["Ling x Lan Fan"],
});

await prisma.vote.upsert({
  where: {
    userId_workId: {
      userId: testUser.id,
      workId: fmabWork.id,
    },
  },
  update: {
    shipId: edwardWinry.id,
  },
  create: {
    userId: testUser.id,
    workId: fmabWork.id,
    shipId: edwardWinry.id,
  },
});

const vi = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "vi",
      workId: arcaneWork.id,
    },
  },
  update: {},
  create: {
    name: "Vi",
    slug: "vi",
    description: "Lutadora originária de Zaun e irmã mais velha de Jinx.",
    imageUrl: null,
    gender: Gender.FEMALE,
    workId: arcaneWork.id,
  },
});

const caitlyn = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "caitlyn-kiramman",
      workId: arcaneWork.id,
    },
  },
  update: {},
  create: {
    name: "Caitlyn Kiramman",
    slug: "caitlyn-kiramman",
    description: "Investigadora de Piltover e parceira de Vi.",
    imageUrl: null,
    gender: Gender.FEMALE,
    workId: arcaneWork.id,
  },
});

const jinx = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "jinx",
      workId: arcaneWork.id,
    },
  },
  update: {},
  create: {
    name: "Jinx",
    slug: "jinx",
    description: "Inventora e combatente impulsiva de Zaun.",
    imageUrl: null,
    gender: Gender.FEMALE,
    workId: arcaneWork.id,
  },
});

const ekko = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "ekko",
      workId: arcaneWork.id,
    },
  },
  update: {},
  create: {
    name: "Ekko",
    slug: "ekko",
    description: "Inventor de Zaun e líder dos Fogolumes.",
    imageUrl: null,
    gender: Gender.MALE,
    workId: arcaneWork.id,
  },
});

const jayce = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "jayce-talis",
      workId: arcaneWork.id,
    },
  },
  update: {},
  create: {
    name: "Jayce Talis",
    slug: "jayce-talis",
    description: "Inventor de Piltover e cocriador da tecnologia Hextech.",
    imageUrl: null,
    gender: Gender.MALE,
    workId: arcaneWork.id,
  },
});

const viktor = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "viktor",
      workId: arcaneWork.id,
    },
  },
  update: {},
  create: {
    name: "Viktor",
    slug: "viktor",
    description: "Cientista de Zaun e parceiro de pesquisa de Jayce.",
    imageUrl: null,
    gender: Gender.MALE,
    workId: arcaneWork.id,
  },
});

const mel = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "mel-medarda",
      workId: arcaneWork.id,
    },
  },
  update: {},
  create: {
    name: "Mel Medarda",
    slug: "mel-medarda",
    description: "Conselheira influente de Piltover.",
    imageUrl: null,
    gender: Gender.FEMALE,
    workId: arcaneWork.id,
  },
});

const sevika = await prisma.character.upsert({
  where: {
    slug_workId: {
      slug: "sevika",
      workId: arcaneWork.id,
    },
  },
  update: {},
  create: {
    name: "Sevika",
    slug: "sevika",
    description: "Combatente de Zaun e aliada de Silco.",
    imageUrl: null,
    gender: Gender.FEMALE,
    workId: arcaneWork.id,
  },
});

const viCaitlyn = await ensureShip({
  workId: arcaneWork.id,
  characterIds: [vi.id, caitlyn.id],
  name: "CaitVi",
  isKnown: true,
  aliases: [
    "Vi x Caitlyn",
    "Piltover's Finest",
  ],
});

const jinxEkko = await ensureShip({
  workId: arcaneWork.id,
  characterIds: [jinx.id, ekko.id],
  name: "Timebomb",
  isKnown: true,
  aliases: ["Jinx x Ekko"],
});

const jayceViktor = await ensureShip({
  workId: arcaneWork.id,
  characterIds: [jayce.id, viktor.id],
  name: "JayVik",
  isKnown: true,
  aliases: [
    "Jayce x Viktor",
    "Jayvik",
  ],
});

const jayceMel = await ensureShip({
  workId: arcaneWork.id,
  characterIds: [jayce.id, mel.id],
  name: "JayMel",
  isKnown: true,
  aliases: ["Jayce x Mel"],
});

await prisma.vote.upsert({
  where: {
    userId_workId: {
      userId: testUser.id,
      workId: arcaneWork.id,
    },
  },
  update: {
    shipId: viCaitlyn.id,
  },
  create: {
    userId: testUser.id,
    workId: arcaneWork.id,
    shipId: viCaitlyn.id,
  },
});

const frontendUrl =
  process.env.FRONTEND_URL_PUBLIC ??
  "https://myfavship-web.vercel.app/";

const workCoverImages = [
  {
    slug: "naruto",
    filename: "naruto.jpg",
  },
  {
    slug: "dragon-ball",
    filename: "dragon-ball.jpg",
  },
  {
    slug: "one-piece",
    filename: "one-piece.jpg",
  },
  {
    slug: "bleach",
    filename: "bleach.jpg",
  },
  {
    slug: "pokemon",
    filename: "pokemon.jpg",
  },
  {
    slug: "attack-on-titan",
    filename: "attack-on-titan.jpg",
  },
  {
    slug: "fullmetal-alchemist-brotherhood",
    filename: "fullmetal-alchemist-brotherhood.jpg",
  },
  {
    slug: "arcane",
    filename: "arcane.jpg",
  },
  {
    slug: "harry-potter",
    filename: "harry-potter.jpg",
  },
  {
    slug: "the-last-of-us",
    filename: "the-last-of-us.jpg",
  },
];

for (const cover of workCoverImages) {
  await prisma.work.update({
    where: {
      slug: cover.slug,
    },
    data: {
      coverImageUrl:
        `${frontendUrl}/images/works/${cover.filename}`,
    },
  });
}

const characterImages = [
  // Naruto
  ["naruto", "naruto-uzumaki", "naruto-uzumaki.jpg"],
  ["naruto", "hinata-hyuga", "hinata-hyuga.jpg"],

  // Dragon Ball
  ["dragon-ball", "son-goku", "son-goku.jpg"],
  ["dragon-ball", "vegeta", "vegeta.jpg"],

  // One Piece
  ["one-piece", "monkey-d-luffy", "monkey-d-luffy.jpg"],
  ["one-piece", "nami", "nami.jpg"],
  ["one-piece", "roronoa-zoro", "roronoa-zoro.jpg"],
  ["one-piece", "sanji", "sanji.jpg"],
  ["one-piece", "nico-robin", "nico-robin.jpg"],
  ["one-piece", "boa-hancock", "boa-hancock.jpg"],
  ["one-piece", "usopp", "usopp.jpg"],
  ["one-piece", "tony-tony-chopper", "tony-tony-chopper.jpg"],

  // Bleach
  ["bleach", "ichigo-kurosaki", "ichigo-kurosaki.jpg"],
  ["bleach", "rukia-kuchiki", "rukia-kuchiki.jpg"],
  ["bleach", "orihime-inoue", "orihime-inoue.jpg"],
  ["bleach", "uryu-ishida", "uryu-ishida.jpg"],
  ["bleach", "renji-abarai", "renji-abarai.jpg"],
  ["bleach", "byakuya-kuchiki", "byakuya-kuchiki.jpg"],
  ["bleach", "rangiku-matsumoto", "rangiku-matsumoto.jpg"],
  ["bleach", "toshiro-hitsugaya", "toshiro-hitsugaya.jpg"],

  // Pokémon
  ["pokemon", "ash-ketchum", "ash-ketchum.jpg"],
  ["pokemon", "misty", "misty.jpg"],
  ["pokemon", "brock", "brock.jpg"],
  ["pokemon", "may", "may.jpg"],
  ["pokemon", "dawn", "dawn.jpg"],
  ["pokemon", "serena", "serena.jpg"],
  ["pokemon", "jessie", "jessie.jpg"],
  ["pokemon", "james", "james.jpg"],

  // Attack on Titan
  ["attack-on-titan", "eren-yeager", "eren-yeager.jpg"],
  ["attack-on-titan", "mikasa-ackerman", "mikasa-ackerman.jpg"],
  ["attack-on-titan", "armin-arlert", "armin-arlert.jpg"],
  ["attack-on-titan", "levi-ackerman", "levi-ackerman.jpg"],
  ["attack-on-titan", "hange-zoe", "hange-zoe.jpg"],
  ["attack-on-titan", "historia-reiss", "historia-reiss.jpg"],
  ["attack-on-titan", "ymir", "ymir.jpg"],
  ["attack-on-titan", "jean-kirstein", "jean-kirstein.jpg"],
  ["attack-on-titan", "annie-leonhart", "annie-leonhart.jpg"],

  // Fullmetal Alchemist: Brotherhood
  [
    "fullmetal-alchemist-brotherhood",
    "edward-elric",
    "edward-elric.jpg",
  ],
  [
    "fullmetal-alchemist-brotherhood",
    "winry-rockbell",
    "winry-rockbell.jpg",
  ],
  [
    "fullmetal-alchemist-brotherhood",
    "alphonse-elric",
    "alphonse-elric.jpg",
  ],
  [
    "fullmetal-alchemist-brotherhood",
    "may-chang",
    "may-chang.jpg",
  ],
  [
    "fullmetal-alchemist-brotherhood",
    "roy-mustang",
    "roy-mustang.jpg",
  ],
  [
    "fullmetal-alchemist-brotherhood",
    "riza-hawkeye",
    "riza-hawkeye.jpg",
  ],
  [
    "fullmetal-alchemist-brotherhood",
    "ling-yao",
    "ling-yao.jpg",
  ],
  [
    "fullmetal-alchemist-brotherhood",
    "lan-fan",
    "lan-fan.jpg",
  ],

  // Arcane
  ["arcane", "vi", "vi.jpg"],
  ["arcane", "caitlyn-kiramman", "caitlyn-kiramman.jpg"],
  ["arcane", "jinx", "jinx.jpg"],
  ["arcane", "ekko", "ekko.jpg"],
  ["arcane", "jayce-talis", "jayce-talis.jpg"],
  ["arcane", "viktor", "viktor.jpg"],
  ["arcane", "mel-medarda", "mel-medarda.jpg"],
  ["arcane", "sevika", "sevika.jpg"],
] as const;

for (const [workSlug, characterSlug, filename] of characterImages) {
  const work = await prisma.work.findUnique({
    where: {
      slug: workSlug,
    },
    select: {
      id: true,
    },
  });

  if (!work) {
    throw new Error(`Obra não encontrada: ${workSlug}`);
  }

  await prisma.character.update({
    where: {
      slug_workId: {
        slug: characterSlug,
        workId: work.id,
      },
    },
    data: {
      imageUrl:
        `${frontendUrl}/images/characters/${workSlug}/${filename}`,
    },
  });
}

const fakeUserNames = [
  "Ana Souza",
  "Bruno Lima",
  "Camila Rocha",
  "Daniel Martins",
  "Eduarda Alves",
  "Felipe Costa",
  "Gabriela Mendes",
  "Henrique Silva",
  "Isabela Freitas",
  "João Ribeiro",
  "Karina Oliveira",
  "Lucas Ferreira",
  "Mariana Gomes",
  "Nicolas Santos",
  "Olívia Cardoso",
  "Pedro Carvalho",
  "Rafaela Moreira",
  "Samuel Nunes",
  "Tatiane Barros",
  "Vinícius Teixeira",
];

const fakeUsers = [];

for (let index = 0; index < fakeUserNames.length; index += 1) {
  const number = String(index + 1).padStart(2, "0");

  const user = await prisma.user.upsert({
    where: {
      email: `user${number}@myfavship.com`,
    },
    update: {
      name: fakeUserNames[index],
      password: passwordHash,
      role: Role.USER,
    },
    create: {
      name: fakeUserNames[index],
      email: `user${number}@myfavship.com`,
      password: passwordHash,
      role: Role.USER,
    },
  });

  fakeUsers.push(user);
}

const voteOptions = [
  {
    workId: narutoWork.id,
    ships: [naruhina],
  },
  {
    workId: dragonBallWork.id,
    ships: [gokuvegeta],
  },
  {
    workId: onePieceWork.id,
    ships: [
      luffyNami,
      zoroRobin,
      sanjiNami,
      luffyBoa,
    ],
  },
  {
    workId: bleachWork.id,
    ships: [
      ichigoOrihime,
      ichigoRukia,
      renjiRukia,
      toshiroRangiku,
    ],
  },
  {
    workId: pokemonWork.id,
    ships: [
      ashMisty,
      ashSerena,
      ashDawn,
      jessieJames,
    ],
  },
  {
    workId: attackOnTitanWork.id,
    ships: [
      erenMikasa,
      arminAnnie,
      historiaYmir,
      leviHange,
    ],
  },
  {
    workId: fmabWork.id,
    ships: [
      edwardWinry,
      royRiza,
      alphonseMay,
      lingLanFan,
    ],
  },
  {
    workId: arcaneWork.id,
    ships: [
      viCaitlyn,
      jinxEkko,
      jayceViktor,
      jayceMel,
    ],
  },
];

let generatedVotes = 0;

for (
  let userIndex = 0;
  userIndex < fakeUsers.length;
  userIndex += 1
) {
  const user = fakeUsers[userIndex];

  for (
    let workIndex = 0;
    workIndex < voteOptions.length;
    workIndex += 1
  ) {
    const option = voteOptions[workIndex];

    const shipIndex =
      (userIndex + workIndex * 2) % option.ships.length;

    const selectedShip = option.ships[shipIndex];

    await prisma.vote.upsert({
      where: {
        userId_workId: {
          userId: user.id,
          workId: option.workId,
        },
      },
      update: {
        shipId: selectedShip.id,
      },
      create: {
        userId: user.id,
        workId: option.workId,
        shipId: selectedShip.id,
      },
    });

    generatedVotes += 1;
  }
}

console.log(`Votos fictícios processados: ${generatedVotes}`);

console.log(`Usuários fictícios processados: ${fakeUsers.length}`);

console.log(
  `Imagens de personagens atualizadas: ${characterImages.length}`
);

console.log(
  `Capas das obras atualizadas: ${workCoverImages.length}`
);

  console.log("Seed concluído.");
console.log(`Admin: ${admin.email} / 123456`);
console.log(`Usuário: ${testUser.email} / 123456`);
console.log("Obras, personagens, ships e votos processados.");
}

main()
  .catch((error) => {
    console.error("Erro ao executar o seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });