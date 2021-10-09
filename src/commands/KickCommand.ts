import PonjoUtil from "../utils/PonjoUtil";
import * as Discord from "discord.js";
import {Client} from "discord.js";
import {PonjoCommand} from "../interfaces/PonjoCommand";
import {SlashCommandOptions} from "../interfaces/CommandOptions";

export default class KickCommand implements PonjoCommand {

    public name: string = "kick";
    public once: boolean = false;
    public enabled = true;
    public description: string = "Kick a user from the server.";
    public aliases: string[] = [];
    protected client: Discord.Client;

    constructor(client: Client) {
        this.enabled = true;
        this.client = client;
    }

    public async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            const permissions = interaction.member.permissions;
            const user = interaction.options.getUser("member");
            const reason = interaction.options.getString("reason") || undefined;
            if (!permissions.has("ADMINISTRATOR") || !permissions.has("KICK_MEMBERS")) {
                return await interaction.reply({embeds: [PonjoUtil.getErrorMessageEmbed(this.client, "You don't have the correct permissions.")]});
            }
            const member = interaction.guild.members.cache.get(user.id);
            if (!member.kickable) return interaction.reply({embeds: [PonjoUtil.getErrorMessageEmbed(this.client, "I cannot kick that member.")]});
            if (!reason) {
                const embed = new Discord.MessageEmbed()
                    .setTitle("Uh-oh!")
                    .setColor("#00e1ff")
                    .setDescription("You were kicked from " + interaction.member.guild.name + "." + "\n" + "Reason: none provided.")
                    .setFooter("Ponjo Team", this.client.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                try {
                    await this.client.users.cache.get(user.id).send({embeds: [embed]});
                    const reply = user.username + " just got bent by " + interaction.user.username + "!" + "\n" + "Reason: **none specified.**";
                    await interaction.reply({content: reply});
                    return await member.kick({days: 7});
                } catch (error) {
                    const reply = user.username + " just got bent by " + interaction.user.username + "!" + "\n" + "Reason: **none specified.**";
                    await interaction.reply({content: reply});
                    return await member.kick({days: 7});
                }
            } else {
                const embed = new Discord.MessageEmbed()
                    .setTitle("Uh-oh!")
                    .setColor("#00e1ff")
                    .setDescription("You were kicked from " + interaction.member.guild.name + "." + "\n" + "Reason: **" + reason + "**")
                    .setFooter("Ponjo Team", this.client.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                try {
                    await this.client.users.cache.get(user.id).send({embeds: [embed]});
                    const reply = user.username + " just got bent by " + interaction.user.username + "!" + "\n" + "Reason: **" + reason + "**";
                    await interaction.reply({content: reply});
                    return await member.kick({days: 7, reason: reason});
                } catch (error) {
                    const reply = user.username + " just got bent by " + interaction.user.username + "!" + "\n" + "Reason: **" + reason + "**";
                    await interaction.reply({content: reply});
                    return await member.kick({days: 7, reason: reason});
                }
            }
        }
    }

    public slashData: object = <object> {
        name: this.name,
        description: this.description,
        options: [
            {
                name: "member",
                description: "The guild member to kick.",
                type: SlashCommandOptions.USER,
                required: true
            },
            {
                name: "reason",
                description: "The reason for kicking the user.",
                type: SlashCommandOptions.STRING,
                required: false
            }
        ]
    };

}