/*
 * Copyright © 2022 Ben Petrillo. All rights reserved.
 *
 * Project licensed under the MIT License: https://www.mit.edu/~amini/LICENSE.md
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * All portions of this software are available for public use, provided that
 * credit is given to the original author(s).
 */

import {
    ButtonInteraction,
    Client,
    ClientEvents,
    CommandInteraction,
    GuildMember,
    Interaction,
    Message,
    MessageEmbed
} from "discord.js";
import {IEvent} from "../../interfaces/IEvent";
import axios from "axios";
import Utilities from "../../utils/Utilities";

export default class MessageEvent implements IEvent {

    public name: keyof ClientEvents;
    public once: boolean;
    public readonly client: Client;

    constructor(client: Client, name: keyof ClientEvents, once: boolean) {
        this.name = name;
        this.once = once;
        this.client = client;
    }

    public async execute(message: Message): Promise<void> {
        if (message.inGuild()) {
            if (Utilities.determineURLValidity(message.content)) {
                await axios.get(message.content)
                    .then(response => {
                        let code: string;
                        if ((response.data as string).length > 2000) {
                            code = (response.data as string).slice(0, 1900) + "...";
                        } else code = response.data as string;
                        const fileType = MessageEvent.determineFileExtension(message.content);
                        try {
                            return message.channel.send(`Hey ${message.author.username}, I've made your file easier to read.`
                                 + "\n" + "```" + fileType + "\n" + code.toString() + "```"
                            );
                        } catch (error: any) {
                            console.log(error);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        return;
                    });
            }
        }
    }

    private static determineFileExtension(url: string): string {
        const validExtensions = ["js", "ts", "css", "html", "cs", "java", "kt", "go", "py", "sass", "txt", "json"];
        for (let i = 0; i < validExtensions.length; i++) {
            if (url.endsWith(validExtensions[i])) {
                return validExtensions[i];
            }
        }
    }
}