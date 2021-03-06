
const mineflayer = require('mineflayer')
const MAIN_PLAYER = 'dav'
const HOST = 'localhost'
const v = require('vec3');


//const HOST = '192.168.2.10'

class NPC_bot {
    constructor(username, conversation, spawn_coords) {
        this.bot = mineflayer.createBot({
            host: HOST,
            //port:51739,
            username: username,
            })
        // bias for the random walk
        this.bias_target=new v(spawn_coords.x, spawn_coords.y, spawn_coords.z);
        this.spawnPoint = new v(spawn_coords.x, spawn_coords.y, spawn_coords.z);
        this.bot.spawnPoint = new v(spawn_coords.x, spawn_coords.y, spawn_coords.z);
        this.bias_strength=0;
        this.engangement_dist = 6
        // destination for a few steps of the random walk
        this.dest = new v(spawn_coords.x, spawn_coords.y, spawn_coords.z);
        this.player_engaged = false;
        this.conversation = conversation;
        this.idle = false;

        // register event calbacks
        this.bot.on('spawn', this.start_bot);
        this.bot.on('physicTick', this.walkAround);
        this.bot.on('chat', (username, message) => {
            if (! this.idle) return;
            if (username != MAIN_PLAYER) return;
            if (username == this.bot.username) return;

            if (this.player_engaged) {
                this.process_conversation(message.toLowerCase());
            } else {
                if (this.conversation.engage_trigger.includes(message.toLowerCase())) {
                    this.attempt_engage();
                }
            }
        });
    }
      
    start_bot = () =>{
        this.bot.chat('/teleport '+this.bot.username +' '+ this.spawnPoint.x +' '+this.spawnPoint.y +' '+ this.spawnPoint.z );
        this.idle = true;
        return;
    }

    attempt_engage = () => {
        const playerEntity = this.bot.players[MAIN_PLAYER].entity;
        const player_pos = playerEntity.position;
        const bot_pos = this.bot.entity.position;
        var dist;
        var player;
        var entity;
        var min_dist=this.engangement_dist;
        var closest_bot = null;

        for (player in this.bot.players) {
            entity = this.bot.players[player].entity;
            if (entity === playerEntity){
                continue;
            }
            if (entity){
                console.log(entity.position);
                console.log(entity.position.x);
                console.log(player_pos.x);
                let dx = entity.position.x-player_pos.x;
                let dz = entity.position.z-player_pos.z;
                dist = dx*dx + dz*dz;
                console.log(dist);
                if (dist<min_dist){
                    min_dist = dist;
                    closest_bot = player;
                }
            }
        }
        //console.log(closest_bot);
        if (closest_bot == this.bot.username){
            this.player_engaged = true;
            this.bot.chat(conversation.engage_response);
        }
    }
    

    lookAtPlayer = () => {
        const playerEntity = this.bot.players[MAIN_PLAYER].entity
        if (!playerEntity) return; 
        var pos = new v(playerEntity.position.x, 
                        playerEntity.position.y+1.62,
                        playerEntity.position.z)
        this.bot.lookAt(pos);
    }

    walkAround = () => {
        if (! this.idle) return;
        if (Math.trunc(this.bot.time.timeOfDay)%30 == 0) {
            this.bot.chat('woah!');
        }
        if (this.player_engaged == true) {
            this.bot.clearControlStates();
            this.lookAtPlayer();
        }
        else {
            if (Math.trunc(this.bot.time.timeOfDay/20)%4 == 0) {
                this.step();
            }
            if (Math.trunc(this.bot.time.timeOfDay/20)%8 == 0) {
                this.create_dest()
                this.bot.clearControlStates();
            }
        }
    }

    create_dest = () =>{
        let dx = .1*(Math.random()-0.5);
        let dy = .1*(Math.random()-0.5);
        let dz = .1*(Math.random()-0.5);

        if (this.bias_strength != 0){
            dx = dx + this.bias_strength*(this.bot.entity.position.x-this.bias_target.x);
            dy = dy + this.bias_strength*(this.bot.entity.position.y-this.bias_target.y);
            dz = dz + this.bias_strength*(this.bot.entity.position.z-this.bias_target.z);
        }

        // get the squared distance to the destination
        //let norm = 1/Math.sqrt(dx*dx + dy*dy + dz*dz);
        let norm=1;

        this.dest  = new v(norm*(this.bot.entity.position.x+dx),
                           this.bot.entity.position.y+1.62,
                           norm*(this.bot.entity.position.z+dz));
        this.bot.lookAt(this.dest);
    }

    step = () => {
        //console.log("step!")
        this.bot.setControlState('forward', true);
    }

    process_conversation = (message) => {
        if (message == 'nom'){
            this.bot.chat(this.conversation.engage_name); 
        } else if (message == 'job') {
            this.bot.chat(this.conversation.engage_job); 
        } else if (message == this.conversation.engage_extra_trigger) {
            this.bot.chat(this.conversation.engage_extra);
        } else if (this.conversation.engage_leave_trigger.includes(message.toLowerCase())) {
            this.bot.chat(this.conversation.engage_leave);
            this.player_engaged = false;
        }
        


    }

}

module.exports = NPC_bot


