const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { token } = require('./config.json');
const { request } = require('undici');

async function getJSONResponse(body) {
    let fullBody = '';

    for await (const data of body) {
        fullBody += data.toString();
    }

    return JSON.parse(fullBody);
}


// Create a new client instance

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const { commandName } = interaction;
    if (commandName === 'pokemon-gen') {
        const p_name = interaction.options.getString('name');
        const pokemon = await request('https://pokeapi.co/api/v2/pokemon/' + p_name);
        const status_code = pokemon.statusCode;
        console.log(pokemon)
        if (status_code > 299) return interaction.channel.send('Pokemon not found!')

        const data = await getJSONResponse(pokemon.body);

        const sprite_url = data.sprites.front_default;
        const official_art = data.sprites.other['official-artwork'].front_default;
        const name = data.name;
        const random_move1 = data.moves[Math.floor(Math.random() * data.moves.length)].move.name;
        const random_move2 = data.moves[Math.floor(Math.random() * data.moves.length)].move.name;
        const random_move3 = data.moves[Math.floor(Math.random() * data.moves.length)].move.name;
        const random_move4 = data.moves[Math.floor(Math.random() * data.moves.length)].move.name;
        const pokemon_type = data.types[0].type.name;

        const embed = new EmbedBuilder()
            .setTitle(name)
            .setURL('https://bulbapedia.bulbagarden.net/wiki/' + name + '_(Pok%C3%A9mon)')
            .setAuthor({ name: 'Pokedex', iconURL: 'https://scontent.fmaa1-3.fna.fbcdn.net/v/t39.30808-6/305210378_481487853988893_2962652754532608370_n.png?_nc_cat=107&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=kMZhovV5v5EAX9yhXEb&_nc_ht=scontent.fmaa1-3.fna&oh=00_AT-vMD1TdLIzRvrTXfcAXwdey6ANA7CoYBhijZ_vB6ZYqA&oe=633C5FA0', url: 'https://discord.js.org' })
            .setDescription('A wild ' + name + ' appeared!')
            .setThumbnail(official_art)
            .addFields(
                { name: 'Type', value: pokemon_type, inline: true },
                { name: 'Move 1', value: random_move1, inline: true },
                { name: 'Move 2', value: random_move2, inline: true },
                { name: 'Move 3', value: random_move3, inline: true },
                { name: 'Move 4', value: random_move4, inline: true },
            )
            .setImage(sprite_url)
            .setTimestamp()
            
        return await interaction.channel.send({ embeds: [embed] });

    }
}
);

client.login(token);
