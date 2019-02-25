class Egg {
    constructor(options) {
        this.queen = options.queen;

        this.instance = PIXI.Sprite.fromImage('img/organism-small.png');

        this.instance.anchor.set(0.5);
        this.setScale(0.075);
        this.setTint(0xFFFFAA);
        this.hatched = false;

        this.intervalAction = setInterval(
            (function(self) {         //Self-executing func which takes 'this' as self
                return function() {   //Return a function in the context of 'self'
                    if (!self.hatched) {
                        if (self.instance.alpha < 1) {
                            self.instance.alpha = self.instance.alpha + (0.01 * self.queen.delta);
                        } else {
                            self.hatch({left: self.getX(), top: self.getY()});
                            self.hatched = true;
                        }
                    } else {
                        if (self.instance.alpha >= 0.1) {
                            self.instance.alpha = self.instance.alpha - (0.01 * self.queen.delta);
                        } else {
                            clearInterval(self.intervalAction);
                        }
                    }
                }
            })(this),
            250
        );
    }

    hatch(hatchOffset) {
        let hatchChance = Math.random();
        if (hatchChance > 0.5) {
            var newWorker = new Worker({app: this.queen.app});
            newWorker.setX(hatchOffset.left);
            newWorker.setY(hatchOffset.top);
            this.queen.app.stage.addChild(newWorker.instance);
            let newWorkerID = new Date().getTime().toString();
            this.queen.workers[newWorkerID] = newWorker;
        }
    }

    getX() {
        return this.instance.x;
    }

    getY() {
        return this.instance.y;
    }

    setScale(newScale) {
        if (!newScale) {
            newScale = 0.1;
        }
        this.instance.scale.set(newScale);
    }

    setX(newX) {
        this.instance.x = newX;
    }

    setY(newY) {
        this.instance.y = newY;
    }

    setTint(newTint) {
        if (!newTint) {
            newTint = 0xEEEEEE;
        }
        this.instance.tint = newTint;
    }
}
