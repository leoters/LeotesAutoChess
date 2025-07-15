import { EffectEnum } from "./Effect";
import { Passive } from "./Passive";
import { Synergy } from "./Synergy";
export declare enum Weather {
    SUN = "SUN",
    NIGHT = "NIGHT",
    WINDY = "WINDY",
    MISTY = "MISTY",
    RAIN = "RAIN",
    SNOW = "SNOW",
    STORM = "STORM",
    SANDSTORM = "SANDSTORM",
    BLOODMOON = "BLOODMOON",
    SMOG = "SMOG",
    NEUTRAL = "NEUTRAL"
}
export declare const WeatherEffects: ReadonlyMap<Weather, EffectEnum>;
export declare const PassivesAssociatedToWeather: Map<Weather, Passive[]>;
export declare const WeatherAssociatedToSynergy: Map<Synergy, Weather>;
export declare const SynergyAssociatedToWeather: Map<Weather, Synergy>;
