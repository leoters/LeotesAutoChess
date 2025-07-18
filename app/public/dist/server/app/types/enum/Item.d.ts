import { Ability } from "./Ability";
import { Synergy } from "./Synergy";
import { Weather } from "./Weather";
export declare enum Item {
    FOSSIL_STONE = "FOSSIL_STONE",
    TWISTED_SPOON = "TWISTED_SPOON",
    MYSTIC_WATER = "MYSTIC_WATER",
    MAGNET = "MAGNET",
    BLACK_GLASSES = "BLACK_GLASSES",
    MIRACLE_SEED = "MIRACLE_SEED",
    NEVER_MELT_ICE = "NEVER_MELT_ICE",
    CHARCOAL = "CHARCOAL",
    HEART_SCALE = "HEART_SCALE",
    OLD_AMBER = "OLD_AMBER",
    DAWN_STONE = "DAWN_STONE",
    WATER_STONE = "WATER_STONE",
    THUNDER_STONE = "THUNDER_STONE",
    FIRE_STONE = "FIRE_STONE",
    MOON_STONE = "MOON_STONE",
    DUSK_STONE = "DUSK_STONE",
    LEAF_STONE = "LEAF_STONE",
    ICE_STONE = "ICE_STONE",
    CHOICE_SPECS = "CHOICE_SPECS",
    SOUL_DEW = "SOUL_DEW",
    UPGRADE = "UPGRADE",
    REAPER_CLOTH = "REAPER_CLOTH",
    POKEMONOMICON = "POKEMONOMICON",
    POWER_LENS = "POWER_LENS",
    SHELL_BELL = "SHELL_BELL",
    LUCKY_EGG = "LUCKY_EGG",
    AQUA_EGG = "AQUA_EGG",
    BLUE_ORB = "BLUE_ORB",
    SCOPE_LENS = "SCOPE_LENS",
    STAR_DUST = "STAR_DUST",
    GREEN_ORB = "GREEN_ORB",
    MANA_SCARF = "MANA_SCARF",
    SMOKE_BALL = "SMOKE_BALL",
    XRAY_VISION = "XRAY_VISION",
    RAZOR_FANG = "RAZOR_FANG",
    PROTECTIVE_PADS = "PROTECTIVE_PADS",
    CHOICE_SCARF = "CHOICE_SCARF",
    PUNCHING_GLOVE = "PUNCHING_GLOVE",
    MUSCLE_BAND = "MUSCLE_BAND",
    WONDER_BOX = "WONDER_BOX",
    CLEANSE_TAG = "CLEANSE_TAG",
    WIDE_LENS = "WIDE_LENS",
    RAZOR_CLAW = "RAZOR_CLAW",
    FLUFFY_TAIL = "FLUFFY_TAIL",
    KINGS_ROCK = "KINGS_ROCK",
    SHINY_CHARM = "SHINY_CHARM",
    GRACIDEA_FLOWER = "GRACIDEA_FLOWER",
    FLAME_ORB = "FLAME_ORB",
    ASSAULT_VEST = "ASSAULT_VEST",
    AMULET_COIN = "AMULET_COIN",
    POKE_DOLL = "POKE_DOLL",
    RED_ORB = "RED_ORB",
    MAX_REVIVE = "MAX_REVIVE",
    ROCKY_HELMET = "ROCKY_HELMET",
    AGUAV_BERRY = "AGUAV_BERRY",
    APICOT_BERRY = "APICOT_BERRY",
    ASPEAR_BERRY = "ASPEAR_BERRY",
    BABIRI_BERRY = "BABIRI_BERRY",
    CHERI_BERRY = "CHERI_BERRY",
    CHESTO_BERRY = "CHESTO_BERRY",
    GANLON_BERRY = "GANLON_BERRY",
    JABOCA_BERRY = "JABOCA_BERRY",
    LANSAT_BERRY = "LANSAT_BERRY",
    LEPPA_BERRY = "LEPPA_BERRY",
    LIECHI_BERRY = "LIECHI_BERRY",
    LUM_BERRY = "LUM_BERRY",
    ORAN_BERRY = "ORAN_BERRY",
    PECHA_BERRY = "PECHA_BERRY",
    PERSIM_BERRY = "PERSIM_BERRY",
    PETAYA_BERRY = "PETAYA_BERRY",
    RAWST_BERRY = "RAWST_BERRY",
    ROWAP_BERRY = "ROWAP_BERRY",
    SALAC_BERRY = "SALAC_BERRY",
    SITRUS_BERRY = "SITRUS_BERRY",
    COMFEY = "COMFEY",
    ELECTIRIZER = "ELECTIRIZER",
    MAGMARIZER = "MAGMARIZER",
    MACHO_BRACE = "MACHO_BRACE",
    LIGHT_BALL = "LIGHT_BALL",
    TOXIC_ORB = "TOXIC_ORB",
    METRONOME = "METRONOME",
    METAL_COAT = "METAL_COAT",
    AIR_BALLOON = "AIR_BALLOON",
    HARD_STONE = "HARD_STONE",
    BIG_NUGGET = "BIG_NUGGET",
    INCENSE = "INCENSE",
    EXP_SHARE = "EXP_SHARE",
    POKERUS_VIAL = "POKERUS_VIAL",
    ROTOM_PHONE = "ROTOM_PHONE",
    SILK_SCARF = "SILK_SCARF",
    TINY_MUSHROOM = "TINY_MUSHROOM",
    BERSERK_GENE = "BERSERK_GENE",
    SURFBOARD = "SURFBOARD",
    COOKING_POT = "COOKING_POT",
    METEORITE = "METEORITE",
    TRASH = "TRASH",
    DYNAMAX_BAND = "DYNAMAX_BAND",
    SHINY_STONE = "SHINY_STONE",
    OLD_ROD = "OLD_ROD",
    GOOD_ROD = "GOOD_ROD",
    SUPER_ROD = "SUPER_ROD",
    RARE_CANDY = "RARE_CANDY",
    EVIOLITE = "EVIOLITE",
    WHITE_FLUTE = "WHITE_FLUTE",
    GOLD_BOTTLE_CAP = "GOLD_BOTTLE_CAP",
    ABSORB_BULB = "ABSORB_BULB",
    SACRED_ASH = "SACRED_ASH",
    COMET_SHARD = "COMET_SHARD",
    REPEAT_BALL = "REPEAT_BALL",
    GOLD_BOW = "GOLD_BOW",
    MAX_ELIXIR = "MAX_ELIXIR",
    DAMP_ROCK = "DAMP_ROCK",
    ICY_ROCK = "ICY_ROCK",
    HEAT_ROCK = "HEAT_ROCK",
    SMOOTH_ROCK = "SMOOTH_ROCK",
    BLACK_AUGURITE = "BLACK_AUGURITE",
    FLOAT_STONE = "FLOAT_STONE",
    MIST_STONE = "MIST_STONE",
    ELECTRIC_QUARTZ = "ELECTRIC_QUARTZ",
    BLOOD_STONE = "BLOOD_STONE",
    SMELLY_CLAY = "SMELLY_CLAY",
    FIRE_SHARD = "FIRE_SHARD",
    TEAL_MASK = "TEAL_MASK",
    WELLSPRING_MASK = "WELLSPRING_MASK",
    CORNERSTONE_MASK = "CORNERSTONE_MASK",
    HEARTHFLAME_MASK = "HEARTHFLAME_MASK",
    ZYGARDE_CUBE = "ZYGARDE_CUBE",
    TM_RAGE = "TM_RAGE",
    TM_BRICK_BREAK = "TM_BRICK_BREAK",
    TM_TAUNT = "TM_TAUNT",
    TM_BULK_UP = "TM_BULK_UP",
    TM_BIDE = "TM_BIDE",
    TM_PSYCH_UP = "TM_PSYCH_UP",
    TM_RETALIATE = "TM_RETALIATE",
    TM_PAYDAY = "TM_PAYDAY",
    HM_CUT = "HM_CUT",
    HM_FLY = "HM_FLY",
    HM_SURF = "HM_SURF",
    HM_STRENGTH = "HM_STRENGTH",
    HM_FLASH = "HM_FLASH",
    HM_ROCK_SMASH = "HM_ROCK_SMASH",
    HM_WHIRLPOOL = "HM_WHIRLPOOL",
    HM_WATERFALL = "HM_WATERFALL",
    CHEF_HAT = "CHEF_HAT",
    PICNIC_SET = "PICNIC_SET",
    SANDWICH = "SANDWICH",
    HEARTY_STEW = "HEARTY_STEW",
    RAGE_CANDY_BAR = "RAGE_CANDY_BAR",
    TEA = "TEA",
    CURRY = "CURRY",
    CASTELIACONE = "CASTELIACONE",
    WHIPPED_DREAM = "WHIPPED_DREAM",
    BERRY_JUICE = "BERRY_JUICE",
    TART_APPLE = "TART_APPLE",
    SWEET_APPLE = "SWEET_APPLE",
    SIRUPY_APPLE = "SIRUPY_APPLE",
    SWEET_HERB = "SWEET_HERB",
    MOOMOO_MILK = "MOOMOO_MILK",
    BERRIES = "BERRIES",
    HONEY = "HONEY",
    POFFIN = "POFFIN",
    ROCK_SALT = "ROCK_SALT",
    NUTRITIOUS_EGG = "NUTRITIOUS_EGG",
    LEFTOVERS = "LEFTOVERS",
    BLACK_SLUDGE = "BLACK_SLUDGE",
    FRUIT_JUICE = "FRUIT_JUICE",
    LEEK = "LEEK",
    LARGE_LEEK = "LARGE_LEEK",
    SMOKED_FILET = "SMOKED_FILET",
    SPINDA_COCKTAIL = "SPINDA_COCKTAIL",
    BINDING_MOCHI = "BINDING_MOCHI",
    STRAWBERRY_SWEET = "STRAWBERRY_SWEET",
    LOVE_SWEET = "LOVE_SWEET",
    BERRY_SWEET = "BERRY_SWEET",
    CLOVER_SWEET = "CLOVER_SWEET",
    FLOWER_SWEET = "FLOWER_SWEET",
    STAR_SWEET = "STAR_SWEET",
    RIBBON_SWEET = "RIBBON_SWEET",
    SWEETS = "SWEETS",
    VANILLA_FLAVOR = "VANILLA_FLAVOR",
    RUBY_FLAVOR = "RUBY_FLAVOR",
    MATCHA_FLAVOR = "MATCHA_FLAVOR",
    MINT_FLAVOR = "MINT_FLAVOR",
    LEMON_FLAVOR = "LEMON_FLAVOR",
    SALTED_FLAVOR = "SALTED_FLAVOR",
    RUBY_SWIRL_FLAVOR = "RUBY_SWIRL_FLAVOR",
    CARAMEL_SWIRL_FLAVOR = "CARAMEL_SWIRL_FLAVOR",
    RAINBOW_SWIRL_FLAVOR = "RAINBOW_SWIRL_FLAVOR",
    EGG_FOR_SELL = "EGG_FOR_SELL",
    GIMMIGHOUL_COIN = "GIMMIGHOUL_COIN",
    EXCHANGE_TICKET = "EXCHANGE_TICKET",
    TREASURE_BOX = "TREASURE_BOX",
    AUSPICIOUS_ARMOR = "AUSPICIOUS_ARMOR",
    MALICIOUS_ARMOR = "MALICIOUS_ARMOR",
    RUSTED_SWORD = "RUSTED_SWORD",
    SCROLL_OF_WATERS = "SCROLL_OF_WATERS",
    SCROLL_OF_DARKNESS = "SCROLL_OF_DARKNESS",
    MYSTERY_BOX = "MYSTERY_BOX"
}
export declare const AllItems: Item[];
export declare const SpecialItems: Item[];
export declare const FishingRods: readonly [Item.SUPER_ROD, Item.GOOD_ROD, Item.OLD_ROD];
export type FishingRod = (typeof FishingRods)[number];
export declare const ItemComponents: Item[];
export declare const ItemRecipe: {
    [key in Item]?: Item[];
};
export declare const Berries: Item[];
export declare const ArtificialItems: Item[];
export declare const ShinyItems: Item[];
export declare const WeatherRocks: Item[];
export declare const WeatherRocksByWeather: Map<Weather, (typeof WeatherRocks)[number] | null>;
export declare const WeatherByWeatherRocks: Map<Item | null, Weather>;
export declare const CraftableItems: Item[];
export declare const SynergyStones: Item[];
export declare const SynergyItems: readonly [Item.OLD_AMBER, Item.DAWN_STONE, Item.WATER_STONE, Item.THUNDER_STONE, Item.FIRE_STONE, Item.MOON_STONE, Item.DUSK_STONE, Item.LEAF_STONE, Item.ICE_STONE, Item.MACHO_BRACE, Item.LIGHT_BALL, Item.TOXIC_ORB, Item.METRONOME, Item.METAL_COAT, Item.AIR_BALLOON, Item.HARD_STONE, Item.BIG_NUGGET, Item.ROTOM_PHONE, Item.SHINY_STONE, Item.SILK_SCARF, Item.TINY_MUSHROOM, Item.COOKING_POT, Item.BERSERK_GENE, Item.SURFBOARD];
export declare const SynergyGivenByItem: Record<(typeof SynergyItems)[number], Synergy>;
export declare const NonSpecialItemComponents: Item[];
export declare const CraftableNonSynergyItems: Item[];
export declare const LateGameItems: Item[];
export declare const OgerponMasks: Item[];
export declare const TMs: Item[];
export declare const HMs: Item[];
export declare const AbilityPerTM: {
    [item in Item]?: Ability;
};
export declare const Dishes: readonly [Item.RAGE_CANDY_BAR, Item.ROCK_SALT, Item.TEA, Item.CURRY, Item.POFFIN, Item.CASTELIACONE, Item.WHIPPED_DREAM, Item.TART_APPLE, Item.SWEET_APPLE, Item.SIRUPY_APPLE, Item.LEFTOVERS, Item.SWEET_HERB, Item.HONEY, Item.BLACK_SLUDGE, Item.FRUIT_JUICE, Item.NUTRITIOUS_EGG, Item.LEEK, Item.LARGE_LEEK, Item.MOOMOO_MILK, Item.SMOKED_FILET, Item.SPINDA_COCKTAIL, Item.BERRY_JUICE, Item.BERRIES, Item.BINDING_MOCHI, Item.STRAWBERRY_SWEET, Item.LOVE_SWEET, Item.BERRY_SWEET, Item.CLOVER_SWEET, Item.FLOWER_SWEET, Item.STAR_SWEET, Item.RIBBON_SWEET, Item.SWEETS, Item.SANDWICH, Item.HEARTY_STEW];
export type Dish = (typeof Dishes)[number];
export declare const Flavors: readonly [Item.VANILLA_FLAVOR, Item.RUBY_FLAVOR, Item.MATCHA_FLAVOR, Item.MINT_FLAVOR, Item.LEMON_FLAVOR, Item.SALTED_FLAVOR, Item.RUBY_SWIRL_FLAVOR, Item.CARAMEL_SWIRL_FLAVOR, Item.RAINBOW_SWIRL_FLAVOR];
export declare const SynergyFlavors: {
    [key in Synergy]: Item.VANILLA_FLAVOR | Item.RUBY_FLAVOR | Item.MATCHA_FLAVOR | Item.MINT_FLAVOR | Item.LEMON_FLAVOR | Item.SALTED_FLAVOR | Item.RUBY_SWIRL_FLAVOR | Item.CARAMEL_SWIRL_FLAVOR | Item.RAINBOW_SWIRL_FLAVOR;
};
export declare const Sweets: Item[];
export declare const NonHoldableItems: Item[];
