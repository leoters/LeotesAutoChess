"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discordService = void 0;
const discord_js_1 = require("discord.js");
const avatar_1 = require("../utils/avatar");
const logger_1 = require("../utils/logger");
let discordWebhook;
let discordBanWebhook;
if (process.env.DISCORD_WEBHOOK_URL) {
    discordWebhook = new discord_js_1.WebhookClient({
        url: process.env.DISCORD_WEBHOOK_URL
    });
}
if (process.env.DISCORD_BAN_WEBHOOK_URL) {
    discordBanWebhook = new discord_js_1.WebhookClient({
        url: process.env.DISCORD_BAN_WEBHOOK_URL
    });
}
exports.discordService = {
    announceBan(user, bannedUser, reason) {
        const dsEmbed = new discord_js_1.EmbedBuilder()
            .setTitle(`${user.displayName} banned the user ${bannedUser.displayName}`)
            .setAuthor({
            name: user.displayName,
            iconURL: (0, avatar_1.getAvatarSrc)(user.avatar)
        })
            .setDescription(`${user.displayName} banned the user ${bannedUser.displayName}. Reason: ${reason}`)
            .setThumbnail((0, avatar_1.getAvatarSrc)(bannedUser.avatar));
        try {
            discordBanWebhook === null || discordBanWebhook === void 0 ? void 0 : discordBanWebhook.send({
                embeds: [dsEmbed]
            });
        }
        catch (error) {
            logger_1.logger.error(error);
        }
    },
    announceUnban(user, name) {
        const dsEmbed = new discord_js_1.EmbedBuilder()
            .setTitle(`${user.displayName} unbanned the user ${name}`)
            .setAuthor({
            name: user.displayName,
            iconURL: (0, avatar_1.getAvatarSrc)(user.avatar)
        })
            .setDescription(`${user.displayName} unbanned the user ${name}`)
            .setThumbnail((0, avatar_1.getAvatarSrc)(user.avatar));
        try {
            discordBanWebhook === null || discordBanWebhook === void 0 ? void 0 : discordBanWebhook.send({
                embeds: [dsEmbed]
            });
        }
        catch (error) {
            logger_1.logger.error(error);
        }
    },
    announceBotCreation(bot) {
        const dsEmbed = new discord_js_1.EmbedBuilder()
            .setTitle(`BOT ${bot.name} created by ${bot.author}`)
            .setAuthor({
            name: bot.author,
            iconURL: (0, avatar_1.getAvatarSrc)(bot.avatar)
        })
            .setDescription(`A new bot has been created by ${bot.author}, pending approval by a Bot Manager.`)
            .setThumbnail((0, avatar_1.getAvatarSrc)(bot.avatar));
        try {
            discordWebhook === null || discordWebhook === void 0 ? void 0 : discordWebhook.send({
                embeds: [dsEmbed]
            });
        }
        catch (error) {
            logger_1.logger.error(error);
        }
    },
    announceBotApproval(botData, approver) {
        const dsEmbed = new discord_js_1.EmbedBuilder()
            .setTitle(`BOT ${botData.name} by @${botData.author} approved by ${approver.displayName}`)
            .setAuthor({
            name: approver.displayName,
            iconURL: (0, avatar_1.getAvatarSrc)(approver.avatar)
        })
            .setDescription(`BOT ${botData.name} by @${botData.author} approved by ${approver.displayName}`)
            .setThumbnail((0, avatar_1.getAvatarSrc)(botData.avatar));
        try {
            discordWebhook === null || discordWebhook === void 0 ? void 0 : discordWebhook.send({
                embeds: [dsEmbed]
            });
        }
        catch (error) {
            logger_1.logger.error(error);
        }
    }
};
//# sourceMappingURL=discord.js.map