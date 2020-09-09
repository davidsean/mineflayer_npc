const NPC_bot = require('./npc_bot.js')

conversation = {
    engage_trigger : 'allo bonjour salut salutation salutations hey yo',
    engage_response : 'Allo',
    engage_name : 'Je m\'apelle.. Hic!... McGonigle.',
    engage_job : ' Hic!.. J\'aime le vin!... Hic! Ils m\'ont mis ici car j\'en buvais trop!',
    engage_extra : 'Tu as du vin? Ca m\'aide a avoir moins peur de ces bibittes!',
    engage_extra_trigger : 'vin',
    engage_leave : 'Bye... Hic!',
    engage_leave_trigger : 'bye babye ciao a+',
}

spawn_coords = {
    x:8,
    y:64,
    z:-30,
}

let marie = new NPC_bot('Marie', conversation);

