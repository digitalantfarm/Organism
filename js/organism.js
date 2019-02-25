var app = {};
var plants = {};
var queen = {};

var dump = {};

window.onload = function() {
    app = new PIXI.Application(window.screen.width, window.screen.height, {backgroundColor : 0x111111});
    document.body.appendChild(app.view);

    queen = new Queen({app: app});
    var qx = Math.random() * app.screen.width;
    var qy = Math.random() * app.screen.height;
    queen.setX(qx);
    queen.setY(qy);

    app.stage.addChild(queen.instance);

    // Listen for animate update
    app.ticker.add(function(delta) {
        // delta is 1 if running at 100% performance
        // creates frame-independent transformation
        queen.doAction(delta);
        for (let workers in queen.workers) {
            queen.workers[workers].doAction(delta);
        }

        let plantChance = Math.random();
        if (plantChance > 0.99) {
            let newPlant = new Plant({app: app});
            var px = Math.random() * app.screen.width;
            var py = Math.random() * app.screen.height;
            newPlant.setX(px);
            newPlant.setY(py);
            app.stage.addChild(newPlant.instance);
            let newPlantID = new Date().getTime().toString();
            plants[newPlantID] = newPlant;
        }
    });
}
