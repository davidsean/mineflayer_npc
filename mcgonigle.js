const NPC_bot = require('./npc_bot.js')
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

class McGonigle extends NPC_bot {
    constructor(username, conversation, spawn_coords) {
        super(username, conversation, spawn_coords);
        this.run = false;
        this.bot.on('physicTick', this.new_behavior);
    }

    new_behavior = () => {
        if (this.run == false) {
            this.check_for_trigger();
            return;
        }
        else {
            this.run_away();
        }
    }

    check_for_trigger = () => {
        if (this.run == true) return;
        if (this.bot.entities) {
            for (let entity in this.bot.entities) {
                if (this.bot.entities[entity].type == 'mob') {
                    if(this.bot.entities[entity].mobType == 'Silverfish') {
                        this.bot.chat('a Silverfish! AAH!!')
                        this.run = true;
                        sleep(10000).then(() => {
                            this.bot.chat('aaaaaah! a l\'aide!')
                            // This will execute 10 seconds from now
                        });
                    }
                }
            }
        }
    }

    run_away = () =>{
        if (Math.trunc(this.bot.time.timeOfDay/20)%4 == 0) {
            this.bot.setControlState('jump', true);
        }
        else {
            this.create_dest();
            this.bot.setControlState('jump', false);
        }

        this.idle = false;
        this.bot.setControlState('forward', true);
        return;
    }
}

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

spawn_coords={
    x:8,
    y:64,
    z:-30,
}

spawn_coords={
    x:-1,
    y:64,
    z:-112,
}

let mcgonigle = new McGonigle('McGonigle', conversation, spawn_coords);
