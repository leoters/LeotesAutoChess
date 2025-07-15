import { GameObjects } from "phaser";
import { Team } from "../../../../types/enum/Game";
export default class LifeBar extends GameObjects.Graphics {
    maxLife: number;
    life: number;
    shield: number;
    PP?: number;
    maxPP?: number;
    team: Team;
    flip: boolean;
    constructor(scene: Phaser.Scene, x: number, y: number, maxLife: number, life: number, shield: number, team: Team, flip: boolean);
    draw(): void;
    setLife(value: number): void;
    setShield(value: number): void;
    setMaxLife(value: number): void;
    setPP(value: number): void;
    setMaxPP(value: number): void;
    setTeam(team: number, flip: boolean): void;
}
