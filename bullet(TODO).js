var bullets = [];

function playerShoot() {

    var bullet = {
        image: document.createElement("img"),
        x: player.x,
        y: player.y,
        width: 15,
        height: 15,
        velocityX: 0,
        velocityY: 0
    }

    bullet.image.src = "bullet.png";

    // start off with a velocity that shoots the bullet straight up
    var velX = 0;
    var velY = 1;

    // now rotate this vector acording to the ship's current rotation
    var s = Math.sin(player.rotation);
    var c = Math.cos(player.rotation);

    // for an explanation of this formula,
    // see http://en.wikipedia.org/wiki/Rotation_matrix
    var xVel = (velX * c) - (velY * s);
    var yVel = (velX * s) + (velY * c);

    bullet.velocityX = xVel * BULLET_SPEED;
    bullet.velocityY = yVel * BULLET_SPEED;

    // finally, add the bullet to the bullets array
    bullets.push(bullet);
}