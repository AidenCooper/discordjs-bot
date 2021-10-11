const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder().setName('time').setDescription('Time from certain dates.').addStringOption(
        option => option.setName('time').setDescription('The previous time').setRequired(true)
    ),

    async execute(interaction) {
        let time = interaction.options.getString('time')

        const addDays = (date, days) => {
            let result = new Date(date)
            result.setDate(result.getDate() + days)
            return result
        }
        
        const diffDays = (a, b) => {
            const first = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes(), a.getSeconds(), a.getMilliseconds());
            const second = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate(), b.getHours(), b.getMinutes(), b.getSeconds(), b.getMilliseconds());
        
            return Math.floor((second - first) / (1000 * 60 * 60 * 24));
        }
        
        let start
        let end = new Date()

        if(time == '606') {
            start = new Date('October 2, 2020 06:06:00')
        } else if(time === '904') {
            start = new Date('October 7, 2020 21:04:00')
        } else {
            return
        }

        let years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0
        let modified = new Date(start)
        let totalDays = diffDays(start, end)

        loop: while(totalDays !== 0) {
            if(totalDays >= 365) {
                let temp = new Date(modified)
                temp.setFullYear(temp.getFullYear() + 1)
                
                const difference = diffDays(modified, temp)

                if((difference == 366 && totalDays > 365) || difference == 365) {
                    modified = addDays(modified, difference)
                    totalDays -= difference
                    years += 1
                    continue
                }
            } else if(totalDays >= 28) {
                let temp = new Date(modified)
                temp.setMonth(temp.getMonth() + 1)
                
                const difference = diffDays(modified, temp)

                switch(true){
                    case difference == 28:
                    case difference == 29 && totalDays >= 29:
                    case difference == 30 && totalDays >= 30:
                    case difference == 31 && totalDays >= 31:
                        modified = addDays(modified, difference)
                        totalDays -= difference
                        months += 1
                        continue loop
                    default:
                        continue loop
                }
            } else {
                modified = addDays(modified, totalDays)
                days += totalDays
                totalDays = 0
                break
            }
        }

        const duration = end.getTime() - modified.getTime()

        milliseconds = Math.floor(duration % 1000)
        seconds = Math.floor((duration / 1000) % 60)
        minutes = Math.floor((duration / (1000 * 60)) % 60)
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

        const embed = new MessageEmbed().setColor('RANDOM').addFields(
            { name: 'Years', value: `${years}`, inline: true },
            { name: 'Months', value: `${months}`, inline: true },
            { name: 'Days', value: `${days}`, inline: true },
            { name: 'Hours', value: `${hours}`, inline: true },
            { name: 'Minutes', value: `${minutes}`, inline:true },
            { name: 'Seconds', value: `${seconds}`, inline: true },
            { name: 'Milliseconds', value: `${milliseconds}`, inline: true }
        )

        await interaction.reply({
            embeds: [embed]
        })
    }
}