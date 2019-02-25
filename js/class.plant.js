class Plant extends Organism {
    constructor(options) {
        super(options);

        this.setScale(0.1);
        this.setTint(0x669966);
        this.instance.alpha = 0.1;

        this.energy = 0;

        this.intervalAction = setInterval(
            (function(self) {         //Self-executing func which takes 'this' as self
                return function() {   //Return a function in the context of 'self'
                    if (self.energy < 100) {
                        self.energy++;
                    }
                    if (self.instance.alpha < 1) {
                        self.instance.alpha = self.instance.alpha + 0.01;
                    }
                    if (self.energy == 100 && self.instance.alpha >= 1) {
                        clearInterval(self.intervalAction);
                    }
                }
            })(this),
            250
        );
    }
}
