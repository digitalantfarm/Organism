class Queen extends Organism {
    constructor(options) {
        super(options);

        this.setScale(0.2);
        this.setTint(0xFF00FF);

        this.postMoveHook = this.layEgg;

        this.eggs = {};
        this.workers = {};
    }

    layEgg(eggOffset) {
        if (this.energy > 0) {
            let eggChance = Math.random();
            if (eggChance > 0.95) {
                var newEgg = new Egg({queen: this});
                newEgg.setX(eggOffset.left);
                newEgg.setY(eggOffset.top);
                newEgg.instance.alpha = 0.1;
                this.app.stage.addChild(newEgg.instance);
                let newEggID = new Date().getTime().toString();
                this.eggs[newEggID] = newEgg;
                this.energy--;
            }
        } else {
            this.setStatus('hungry');
        }
    }

    doAction(delta) {
        this.delta = delta;
        switch(this.getStatus()) {
            case 'hungry':
                if (this.energy > 0) {
                    this.setStatus('idle');
                }
                break;
            case 'roaming':
                this.chooseDirection();
                this.move();
                break;
            case 'idle':
            default:
                this.setStatus('roaming');
        }
    }
}
