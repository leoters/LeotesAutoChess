"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = require("phaser");
const depths_1 = require("../depths");
class LifeBar extends phaser_1.GameObjects.Graphics {
    constructor(scene, x, y, maxLife, life, shield, team, flip) {
        super(scene, { x: x, y: y });
        this.maxLife = maxLife;
        this.life = life;
        this.shield = shield;
        this.team = team;
        this.flip = flip;
        this.setDepth(depths_1.DEPTH.POKEMON_HP_BAR);
    }
    draw() {
        const barWidth = 70;
        const innerBarWidth = barWidth - 2;
        const lifeBarBgColor = 0x303030;
        const ppBarBgColor = 0x282828;
        const allyLifeColor = 0x76c442;
        const enemyLifeColor = 0xe76e55;
        const shieldColor = 0xe0e0e0;
        const ppColor = 0x209cee;
        const hpPerSegment = 25;
        this.clear();
        this.clearMask();
        this.translateCanvas(-barWidth / 2, 0);
        this.fillStyle(0x000000);
        this.fillRoundedRect(0, 0, barWidth, this.maxPP === undefined ? 8 : 14, 2);
        if (this.life > 0) {
            const totalLife = Math.max(this.maxLife, this.life + this.shield);
            const lifePercentage = this.life / totalLife;
            const shieldPercentage = this.shield / totalLife;
            this.save();
            this.translateCanvas(1, 1);
            this.fillStyle(lifeBarBgColor, 1);
            this.fillRect(0, 0, innerBarWidth, 6);
            const color = this.team === (this.flip ? 1 : 0) ? allyLifeColor : enemyLifeColor;
            this.fillStyle(color, 1);
            this.fillRect(0, 0, lifePercentage * innerBarWidth, 6);
            if (this.shield > 0) {
                this.fillStyle(shieldColor);
                this.fillRect(lifePercentage * innerBarWidth, 0, shieldPercentage * 68, 6);
            }
            const segmentSize = (hpPerSegment / totalLife) * innerBarWidth;
            const numberOfSegments = ((totalLife - 0.1) / hpPerSegment) >> 0;
            this.lineStyle(1, lifeBarBgColor);
            this.beginPath();
            for (let i = 1; i <= numberOfSegments; i++) {
                this.moveTo(i * segmentSize, 0);
                this.lineTo(i * segmentSize, 4);
            }
            this.closePath();
            this.strokePath();
            this.restore();
        }
        if (this.PP !== undefined && this.maxPP !== undefined) {
            const ppPercentage = this.PP / this.maxPP;
            this.fillStyle(ppBarBgColor, 1);
            this.fillRect(1, 9, innerBarWidth, 3);
            this.fillStyle(ppColor);
            this.fillRect(1, 9, ppPercentage * innerBarWidth, 3);
        }
    }
    setLife(value) {
        this.scene.tweens.add({
            targets: this,
            life: value,
            duration: 150,
            onUpdate: this.draw.bind(this),
            ease: "Sine.easeOut"
        });
    }
    setShield(value) {
        this.scene.tweens.add({
            targets: this,
            shield: value,
            duration: 150,
            onUpdate: this.draw.bind(this),
            ease: "Sine.easeOut"
        });
    }
    setMaxLife(value) {
        this.maxLife = value;
    }
    setPP(value) {
        this.scene.tweens.add({
            targets: this,
            PP: value,
            duration: 150,
            onUpdate: this.draw.bind(this),
            ease: "Sine.easeOut"
        });
    }
    setMaxPP(value) {
        this.maxPP = value;
        if (this.PP === undefined)
            this.PP = 0;
    }
    setTeam(team, flip) {
        this.team = team;
        this.flip = flip;
    }
}
exports.default = LifeBar;
//# sourceMappingURL=life-bar.js.map