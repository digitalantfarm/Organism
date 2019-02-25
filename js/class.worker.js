class Worker extends Organism {
    constructor(options) {
        super(options);

        this.setScale(0.1);
        this.setTint(0x6666FF);

        this.targetFood = {};
        this.gotFood = 0;
    }

    getDestination() {
        return this.destination;
    }

    setDestination(coords) {
        this.destination = coords;
    }

    checkLocation(target = 'food') {
        switch(target) {
            case 'queen':
                let coords = {
                    left: queen.getX(),
                    top: queen.getY()
                }
        
                this.setDestination(coords);
                break;
            case 'food':
                let foundFoodAt = {
                    left: window.screen.width,
                    top: window.screen.height,
                    avg: (window.screen.width + window.screen.height) / 2
                };
        
                for (let food in plants) {
                    let coords = {
                        left: plants[food].getX(),
                        top: plants[food].getY()
                    }
                    let avg = (coords.left + coords.top) / 2;
                    if (avg < foundFoodAt.avg && plants[food].energy > 0) {
                        foundFoodAt.left = coords.left;
                        foundFoodAt.top = coords.top;
                        foundFoodAt.avg = avg;
                        this.targetFood = food;
                    }
                }
        
                this.setDestination(foundFoodAt);
                this.setStatus('gathering');
                break;
            default:
        }
    }

    getFood() {
        let coords = {
            left: this.getX(),
            top: this.getY()
        };
        let diff = {
            left: coords.left - this.destination.left,
            top: coords.top - this.destination.top
        };
        if ((diff.left < 2 && diff.left > -2) && (diff.top < 2 && diff.top > -2)) {
        //if (Math.floor(coords.left) == Math.floor(this.destination.left) && Math.floor(coords.top) == Math.floor(this.destination.top)) {
            //console.log(plants[this.targetFood].energy);
            if (plants[this.targetFood].energy <= 0) {
                this.setStatus('searching');
            } else {
                plants[this.targetFood].energy--;
                this.gotFood++;
                this.setStatus('feeding');
            }
        }
    }

    getQueen() {
        let coords = {
            left: this.getX(),
            top: this.getY()
        };
        let diff = {
            left: coords.left - this.destination.left,
            top: coords.top - this.destination.top
        };
        if ((diff.left < 2 && diff.left > -2) && (diff.top < 2 && diff.top > -2)) {
        //if (Math.floor(coords.left) == Math.floor(this.destination.left) && Math.floor(coords.top) == Math.floor(this.destination.top)) {
            //console.log(plants[this.targetFood].energy);
            if (queen.energy < 100) {
                queen.energy++;
                this.gotFood--;
                this.setStatus('searching');
            //} else {
            //    this.setStatus('searching');
            }
        }
    }

    doAction(delta) {
        this.delta = delta;

        if (queen.energy < 50 && this.getStatus() != 'gathering' && this.getStatus() != 'feeding') {
            this.setStatus('searching');
        }

        switch(this.getStatus()) {
            case 'searching':
                this.checkLocation('food');
                break;
            case 'gathering':
                this.move();
                this.getFood();
                break;
            case 'feeding':
                this.checkLocation('queen');
                this.move();
                this.getQueen();
                break;
            case 'stopped':
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
