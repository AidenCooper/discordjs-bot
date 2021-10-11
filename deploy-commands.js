const dotenv = require('dotenv')
const fs = require('fs')

const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')

dotenv.config()

const commands = []
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for(const file of commandFiles) {
    const command = require(`./commands/${file}`)
    commands.push(command.data.toJSON())
}

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN)
rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands }).then(() => console.log('Registered commands.')).catch(console.error)