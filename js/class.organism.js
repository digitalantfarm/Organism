class Organism {
    constructor(options) {
        this.app = options.app;
        this.delta;

        this.instance = PIXI.Sprite.fromImage('img/organism-small.png');

        this.instance.anchor.set(0.5);
        this.setScale(0.1);
        this.setTint(0xAAFFAA);

        this.setStatus('idle');

        this.directionModifier = {
            left: 1,
            top: 1
        };

        this.energy = 100;

        this.destination = {
            left: null,
            top: null
        };

        this.postMoveHook = function(moveOffset) {}
    }

    getStatus() {
        return this.status;
    }

    getX() {
        return this.instance.x;
    }

    getY() {
        return this.instance.y;
    }

    setStatus(newStatus) {
        if (!newStatus) {
            newStatus = 'idle';
        }
        this.status = newStatus;
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

    doAction(delta) {
        this.delta = delta;
        switch(this.getStatus()) {
            case 'roaming':
                this.chooseDirection();
                this.move();
                break;
            case 'idle':
            default:
                this.setStatus('roaming');
        }
    }

    chooseDirection(probability = 0.1) {
        let previousLeft = this.directionModifier.left;
        let previousTop = this.directionModifier.top;
        let chanceLeft = Math.random();
        let chanceTop = Math.random();
        if ( chanceLeft <= probability ) {
            this.directionModifier.left = this.directionModifier.left * -1;
        }
        if ( chanceTop <= probability ) {
            this.directionModifier.top = this.directionModifier.top * -1;
        }
        if (this.directionModifier.left == (previousLeft * -1) && this.directionModifier.top == (previousTop * -1)) {
            this.chooseDirection();
        }
    }

    move() {
        let coords = {
            left: this.getX(),
            top: this.getY()
        };
        let newOffset = {
            left: coords.left,
            top: coords.top
        };
        let destination = this.destination;

        if (destination.left != null && destination.top != null) {
            let leftDiff = destination.left - coords.left;
            let topDiff = destination.top - coords.top;

            if (!dump.diff) {
                dump.diff = {
                    left: leftDiff,
                    top: topDiff
                };
            }

            if (leftDiff != 0) {
                if (leftDiff < 0) {
                    newOffset.left = coords.left - 1;
                }
                if (leftDiff > 0) {
                    newOffset.left = coords.left + 1;
                }
            }
            if (topDiff != 0) {
                if (topDiff < 0) {
                    newOffset.top = coords.top - 1;
                }
                if (topDiff > 0) {
                    newOffset.top = coords.top + 1;
                }
            }

            if (leftDiff == 0 && topDiff == 0) {
                //console.log('At food!');
            }

            //newOffset.left = coords.left + (1 * this.directionModifier.left);
            //newOffset.top = coords.top + (1 * this.directionModifier.top);
        } else {
            if ( ( coords.left + this.directionModifier.left ) < 0 || ( coords.left + this.directionModifier.left ) > window.screen.width ) {
                newOffset.left = coords.left - this.directionModifier.left;
            } else {
                newOffset.left = coords.left + this.directionModifier.left;
            }
    
            if ( ( coords.top + this.directionModifier.top ) < 0 || ( coords.top + this.directionModifier.top ) > window.screen.height ) {
                newOffset.top = coords.top - this.directionModifier.top;
            } else {
                newOffset.top = coords.top + this.directionModifier.top;
            }
        }

        this.setX(newOffset.left);
        this.setY(newOffset.top);

        this.postMoveHook(newOffset);
    }

    registerAction(listener) {
        this.postMoveHook = listener;
    }
}
