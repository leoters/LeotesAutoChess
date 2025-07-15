"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = __importDefault(require("phaser"));
const depths_1 = require("../depths");
class WeatherManager {
    constructor(scene) {
        this.scene = scene;
        this.screen = new phaser_1.default.Geom.Rectangle(0, 0, 3000, 2000);
        this.particlesEmitters = [];
        if (scene.renderer.type === phaser_1.default.WEBGL) {
            this.scene.cameras.main.initPostPipeline();
        }
    }
    addRain() {
        const offscreenSource = {
            x: { min: 0, max: 2000 },
            y: { min: 0, max: 100 }
        };
        this.colorFilter = this.scene.add.existing(new phaser_1.default.GameObjects.Rectangle(this.scene, 1500, 1000, 3000, 2000, 0x296383, 0.3).setDepth(depths_1.DEPTH.WEATHER_FX));
        this.particlesEmitters.push(this.scene.add.particles(0, 0, "rain", Object.assign(Object.assign({}, offscreenSource), { deathZone: { source: this.screen, type: "onLeave" }, frequency: 50, speedY: { min: 260, max: 280 }, lifespan: 5000, scale: 0.5 })));
        this.particlesEmitters.push(this.scene.add.particles(0, 0, "rain", Object.assign(Object.assign({}, offscreenSource), { deathZone: { source: this.screen, type: "onLeave" }, frequency: 100, speedY: { min: 360, max: 380 }, lifespan: 5000, scale: 0.8 })));
        this.particlesEmitters.push(this.scene.add.particles(0, 0, "rain", Object.assign(Object.assign({}, offscreenSource), { deathZone: { source: this.screen, type: "onLeave" }, frequency: 200, quantity: 4, speedY: { min: 460, max: 480 }, lifespan: 5000 })));
    }
    addSnow() {
        const offscreenSource = {
            x: { min: 0, max: 2000 },
            y: { min: 0, max: 100 }
        };
        this.colorFilter = this.scene.add.existing(new phaser_1.default.GameObjects.Rectangle(this.scene, 1500, 1000, 3000, 2000, 0xa7cade, 0.3).setDepth(depths_1.DEPTH.WEATHER_FX));
        this.particlesEmitters.push(this.scene.add.particles(0, 0, "snowflakes", Object.assign(Object.assign({}, offscreenSource), { deathZone: { source: this.screen, type: "onLeave" }, frequency: 10, speedY: { min: 70, max: 80 }, lifespan: 5000, scale: 0.5 })));
        this.particlesEmitters.push(this.scene.add.particles(0, 0, "snowflakes", Object.assign(Object.assign({}, offscreenSource), { deathZone: { source: this.screen, type: "onLeave" }, frequency: 20, speedY: { min: 100, max: 110 }, lifespan: 5000, scale: 0.8 })));
        this.particlesEmitters.push(this.scene.add.particles(0, 0, "snowflakes", Object.assign(Object.assign({}, offscreenSource), { deathZone: { source: this.screen, type: "onLeave" }, frequency: 40, speedY: { min: 200, max: 210 }, lifespan: 5000 })));
    }
    addSun() {
        this.image = this.scene.add.existing(new phaser_1.default.GameObjects.Image(this.scene, 550, 250, "sun")
            .setScale(4, 4)
            .setDepth(depths_1.DEPTH.WEATHER_FX));
        this.colorFilter = this.scene.add.existing(new phaser_1.default.GameObjects.Rectangle(this.scene, 1500, 1000, 3000, 2000, 0xffe800, 0.15).setDepth(depths_1.DEPTH.WEATHER_FX));
    }
    addSandstorm() {
        const leftScreenSource = {
            x: { min: 0, max: 100 },
            y: { min: 500, max: 1500 }
        };
        const deathZoneSource = new phaser_1.default.Geom.Rectangle(0, 0, 2000, 4000);
        this.particlesEmitters.push(this.scene.add.particles(0, 0, "sand", Object.assign(Object.assign({}, leftScreenSource), { deathZone: { source: deathZoneSource, type: "onLeave" }, frequency: 50, speedX: { min: 260, max: 280 }, speedY: { min: -260, max: -280 }, lifespan: 5000, scale: 0.8 })), this.scene.add.particles(0, 0, "sand", Object.assign(Object.assign({}, leftScreenSource), { deathZone: { source: deathZoneSource, type: "onLeave" }, frequency: 100, speedX: { min: 360, max: 380 }, speedY: { min: -260, max: -280 }, lifespan: 5000, scale: 1.2 })), this.scene.add.particles(0, 0, "sand", Object.assign(Object.assign({}, leftScreenSource), { deathZone: { source: deathZoneSource, type: "onLeave" }, frequency: 200, quantity: 4, scale: 1.5, speedX: { min: 460, max: 480 }, speedY: { min: -260, max: -280 }, lifespan: 5000 })));
        this.colorFilter = this.scene.add.existing(new phaser_1.default.GameObjects.Rectangle(this.scene, 1500, 1000, 3000, 2000, 0x9a791a, 0.2).setDepth(depths_1.DEPTH.WEATHER_FX));
    }
    addNight() {
        this.colorFilter = this.scene.add.existing(new phaser_1.default.GameObjects.Rectangle(this.scene, 1500, 1000, 3000, 2000, 0x141346, 0.6).setDepth(depths_1.DEPTH.WEATHER_FX));
    }
    addBloodMoon() {
        this.colorFilter = this.scene.add.existing(new phaser_1.default.GameObjects.Rectangle(this.scene, 1500, 1000, 3000, 2000, 0x460818, 0.6).setDepth(depths_1.DEPTH.WEATHER_FX));
        const offscreenSource = {
            x: { min: 0, max: 2000 },
            y: { min: 0, max: 100 }
        };
        this.particlesEmitters.push(this.scene.add.particles(0, 0, "rain", Object.assign(Object.assign({}, offscreenSource), { deathZone: { source: this.screen, type: "onLeave" }, frequency: 400, speedY: { min: 260, max: 280 }, tint: 0xff0000, lifespan: 5000, scale: 0.7 })));
        this.particlesEmitters.push(this.scene.add.particles(0, 0, "rain", Object.assign(Object.assign({}, offscreenSource), { deathZone: { source: this.screen, type: "onLeave" }, frequency: 500, speedY: { min: 360, max: 380 }, tint: 0xff0000, lifespan: 5000, scale: 0.8 })));
        this.particlesEmitters.push(this.scene.add.particles(0, 0, "rain", Object.assign(Object.assign({}, offscreenSource), { deathZone: { source: this.screen, type: "onLeave" }, frequency: 800, quantity: 4, speedY: { min: 460, max: 480 }, tint: 0xff0000, lifespan: 5000 })));
    }
    addWind() {
        const leftScreenSource = {
            x: { min: 0, max: 100 },
            y: { min: 0, max: 1000 }
        };
        const deathZoneSource = new phaser_1.default.Geom.Rectangle(0, 0, 2000, 4000);
        this.particlesEmitters.push(this.scene.add.particles(0, 0, "wind", Object.assign(Object.assign({}, leftScreenSource), { deathZone: { source: deathZoneSource, type: "onLeave" }, frequency: 100, speedX: { min: 500, max: 800 }, speedY: { min: -100, max: 100 }, lifespan: 2000, scale: 1 })), this.scene.add.particles(0, 0, "wind", Object.assign(Object.assign({}, leftScreenSource), { deathZone: { source: deathZoneSource, type: "onLeave" }, frequency: 100, speedX: { min: 1000, max: 1400 }, speedY: { min: -100, max: 100 }, lifespan: 2000, scale: 0.5 })));
    }
    addSmog() {
        this.image = this.scene.add.existing(new phaser_1.default.GameObjects.Image(this.scene, 1000, 500, "clouds")
            .setTint(0x508050)
            .setScale(3, 2)
            .setOrigin(0.5)
            .setDepth(depths_1.DEPTH.WEATHER_FX)
            .setAlpha(0.5));
        this.colorFilter = this.scene.add.existing(new phaser_1.default.GameObjects.Rectangle(this.scene, 1500, 1000, 3000, 2000, 0x6e994c, 0.15).setDepth(depths_1.DEPTH.WEATHER_FX));
        const leftScreenSource = {
            x: { min: -200, max: -100 },
            y: { min: 0, max: 1000 }
        };
        const rightScreenSource = {
            x: { min: 2100, max: 2200 },
            y: { min: 0, max: 1000 }
        };
        const deathZoneSource = new phaser_1.default.Geom.Rectangle(-250, 0, 2500, 4000);
        this.particlesEmitters.push(this.scene.add.particles(0, 0, "smog", Object.assign(Object.assign({}, leftScreenSource), { deathZone: { source: deathZoneSource, type: "onLeave" }, frequency: 400, speedX: { min: 100, max: 160 }, speedY: { min: 0, max: 0 }, lifespan: 14000, scale: 1 })));
        this.particlesEmitters.push(this.scene.add.particles(0, 0, "smog", Object.assign(Object.assign({}, leftScreenSource), { deathZone: { source: deathZoneSource, type: "onLeave" }, frequency: 600, speedX: { min: 80, max: 140 }, speedY: { min: 0, max: 0 }, lifespan: 14000, scale: 2 })));
        this.particlesEmitters.push(this.scene.add.particles(0, 0, "smog", Object.assign(Object.assign({}, rightScreenSource), { deathZone: { source: deathZoneSource, type: "onLeave" }, frequency: 400, speedX: { min: -160, max: -100 }, speedY: { min: 0, max: 0 }, lifespan: 15000, scale: 1 })));
        this.particlesEmitters.push(this.scene.add.particles(0, 0, "smog", Object.assign(Object.assign({}, rightScreenSource), { deathZone: { source: deathZoneSource, type: "onLeave" }, frequency: 600, speedX: { min: -140, max: -80 }, speedY: { min: 0, max: 0 }, lifespan: 15000, scale: 2 })));
    }
    addMist() {
        const offscreenSource = {
            x: { min: 0, max: 2000 },
            y: { min: 900, max: 1000 }
        };
        this.image = this.scene.add.existing(new phaser_1.default.GameObjects.Image(this.scene, 1000, 500, "clouds")
            .setScale(3, 2)
            .setOrigin(0.5)
            .setDepth(depths_1.DEPTH.WEATHER_FX)
            .setAlpha(0.4));
        this.colorFilter = this.scene.add.existing(new phaser_1.default.GameObjects.Rectangle(this.scene, 1500, 1000, 3000, 2000, 0x994c6e, 0.15).setDepth(depths_1.DEPTH.WEATHER_FX));
        this.particlesEmitters.push(this.scene.add.particles(0, 0, "snowflakes", Object.assign(Object.assign({}, offscreenSource), { deathZone: { source: this.screen, type: "onLeave" }, frequency: 20, speedY: { min: -60, max: -40 }, lifespan: 5000, scale: 1, tint: 0xff80ae, alpha: { start: 1, end: 0 } })), this.scene.add.particles(0, 0, "snowflakes", Object.assign(Object.assign({}, offscreenSource), { deathZone: { source: this.screen, type: "onLeave" }, frequency: 40, speedY: { min: -60, max: -40 }, lifespan: 5000, scale: 2, tint: 0xff80be, alpha: { start: 1, end: 0 } })));
    }
    addStorm() {
        const offscreenSource = {
            x: { min: 0, max: 2000 },
            y: { min: 0, max: 100 }
        };
        this.colorFilter = this.scene.add.existing(new phaser_1.default.GameObjects.Rectangle(this.scene, 1500, 1000, 3000, 2000, 0x2b3838, 0.4).setDepth(depths_1.DEPTH.WEATHER_FX));
        this.particlesEmitters.push(this.scene.add.particles(0, 0, "rain", Object.assign(Object.assign({}, offscreenSource), { deathZone: { source: this.screen, type: "onLeave" }, frequency: 200, quantity: 12, speedY: { min: 700, max: 800 }, speedX: { min: 900, max: 1000 }, lifespan: 5000, scale: 0.8, tint: 0xa0a0a0 })), this.scene.add.particles(0, 0, "rain", Object.assign(Object.assign({}, offscreenSource), { deathZone: { source: this.screen, type: "onLeave" }, frequency: 200, quantity: 8, speedY: { min: 800, max: 1000 }, speedX: { min: 1000, max: 1200 }, lifespan: 5000, scale: 1, tint: 0xa0a0a0 })));
    }
    setTownDaytime(stageLevel) {
        let red = 255, green = 255, blue = 255, alpha = 0;
        if (stageLevel === 0) {
            red = 255;
            green = 160;
            blue = 50;
            alpha = 0.15;
        }
        else if (stageLevel === 20) {
            red = 150;
            green = 0;
            blue = 50;
            alpha = 0.15;
        }
        else if (stageLevel > 20) {
            red = 0;
            green = 20;
            blue = 255;
            alpha = 0.15;
        }
        this.colorFilter = this.scene.add.existing(new phaser_1.default.GameObjects.Rectangle(this.scene, 1500, 1000, 3000, 2000, new phaser_1.default.Display.Color(red, green, blue).color, alpha).setDepth(depths_1.DEPTH.WEATHER_FX));
    }
    clearWeather() {
        this.particlesEmitters.forEach((emitter) => emitter.destroy());
        this.particlesEmitters = [];
        if (this.colorFilter) {
            this.colorFilter.destroy();
        }
        if (this.image) {
            this.image.destroy();
        }
    }
}
exports.default = WeatherManager;
//# sourceMappingURL=weather-manager.js.map