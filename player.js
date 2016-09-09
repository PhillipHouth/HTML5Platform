var Player = function () {
	this.sprite = new Sprite("sprites.png");
	this.sprite.buildAnimation(11, 2, 48, 48, 0.05,
		[0]);
	this.sprite.buildAnimation(11, 2, 48, 48, 0.05,
		[7, 8]);
	this.sprite.buildAnimation(11, 2, 48, 48, 0.05,
		[2, 3, 4]);
	this.sprite.buildAnimation(11, 2, 48, 48, 0.05,
		[21]);
	this.sprite.buildAnimation(11, 2, 48, 48, 0.05,
		[14, 13]);
	this.sprite.buildAnimation(11, 2, 48, 48, 0.05,
		[19, 18, 17]);
	this.sprite.buildAnimation(11, 2, 48, 48, 0.05,
		[6]);
	this.sprite.buildAnimation(11, 2, 48, 48, 0.05,
		[15]);
	this.sprite.buildAnimation(11, 2, 48, 48, 0.05,
		[1]);
	this.sprite.buildAnimation(11, 2, 48, 48, 0.05,
		[20]);
	this.sprite.buildAnimation(11, 2, 48, 48, 0.05,
		[9]);
	this.sprite.buildAnimation(11, 2, 48, 48, 0.05,
		[12]);


	for (var i = 0; i < ANIM_MAX; i++) {
		this.sprite.setAnimationOffset(i, -6, -12);
	}

	this.position = new Vector2();
	this.position.set(1 * TILE, 10 * TILE);

	this.width = 48;
	this.height = 48;

	this.velocity = new Vector2();

	this.falling = true;
	this.jumping = false;

	this.direction = RIGHT;
	this.cooldownTimer = 0;

};

var LEFT = 0;
var RIGHT = 1;

var ANIM_IDLE_RIGHT = 0;
var ANIM_JUMP_RIGHT = 1;
var ANIM_WALK_RIGHT = 2;
var ANIM_IDLE_LEFT = 3;
var ANIM_JUMP_LEFT = 4;
var ANIM_WALK_LEFT = 5;
var ANIM_SKID_RIGHT = 6;
var ANIM_SKID_LEFT = 7;
var ANIM_CROUCH_RIGHT = 8;
var ANIM_CROUCH_LEFT = 9;
var ANIM_APPEAL_RIGHT = 10;
var ANIM_APPEAL_LEFT = 11;
var ANIM_MAX = 12;

Player.prototype.update = function (deltaTime) {

	this.sprite.update(deltaTime);

	var left = false;
	var right = false;
	var jump = false;
	// check keypress events
	if (keyboard.isKeyDown(keyboard.KEY_LEFT) || keyboard.isKeyDown(keyboard.KEY_A) == true) {
		left = true;
		this.direction = LEFT;
		if (this.sprite.currentAnimation != ANIM_WALK_LEFT &&
			this.jumping == false)
			this.sprite.setAnimation(ANIM_WALK_LEFT);
		if (keyboard.isKeyDown(keyboard.KEY_SHIFT) == true) {
			this.velocity.x = this.velocity.x * 1.2;
		}
	}
	else if (keyboard.isKeyDown(keyboard.KEY_RIGHT) || keyboard.isKeyDown(keyboard.KEY_D) == true) {
		right = true;
		this.direction = RIGHT;
		if (this.sprite.currentAnimation != ANIM_WALK_RIGHT &&
			this.jumping == false)
			this.sprite.setAnimation(ANIM_WALK_RIGHT);
		if (keyboard.isKeyDown(keyboard.KEY_SHIFT) == true) {
			this.velocity.x = this.velocity.x * 1.2;
		}
	}
	else {
		if (this.jumping == false && this.falling == false) {
			if (this.direction == LEFT) {
				if (this.sprite.currentAnimation != ANIM_IDLE_LEFT)
					this.sprite.setAnimation(ANIM_IDLE_LEFT);
			}
			else {
				if (this.sprite.currentAnimation != ANIM_IDLE_RIGHT)
					this.sprite.setAnimation(ANIM_IDLE_RIGHT);
			}
		}
	}
	if (keyboard.isKeyDown(keyboard.KEY_SPACE) == true) {
		jump = true;
		if (left == true) {
			this.sprite.setAnimation(ANIM_JUMP_LEFT);
		}
		if (right == true) {
			this.sprite.setAnimation(ANIM_JUMP_RIGHT);
		}
	}
	if (jump == true && this.jumping == false) {
		sfxJump.play();
	}



	if (keyboard.isKeyDown(keyboard.KEY_DOWN) || keyboard.isKeyDown(keyboard.KEY_S) == true) {
		if (this.direction == LEFT && this.velocity.x == 0) {
			this.sprite.setAnimation(ANIM_CROUCH_LEFT);
		}
		if (this.direction == RIGHT && this.velocity.x == 0) {
			this.sprite.setAnimation(ANIM_CROUCH_RIGHT);
		}
	}
	if (keyboard.isKeyDown(keyboard.KEY_UP) || keyboard.isKeyDown(keyboard.KEY_W) == true) {
		if (this.direction == LEFT && this.velocity.x == 0) {
			this.sprite.setAnimation(ANIM_APPEAL_LEFT);
		}
		if (this.direction == RIGHT && this.velocity.x == 0) {
			this.sprite.setAnimation(ANIM_APPEAL_RIGHT);
		}

	}

	var wasleft = this.velocity.x < 0;
	var wasright = this.velocity.x > 0;
	var falling = this.falling;
	var ddx = 0; // acceleration
	var ddy = GRAVITY;

	if (left)
		ddx = ddx - ACCEL; // player wants to go left
	else if (wasleft) {
		ddx = ddx + FRICTION; // player was going left, but not any more
		if (this.velocity.y == 0)
			this.sprite.setAnimation(ANIM_SKID_LEFT);
	}
	if (right)
		ddx = ddx + ACCEL; // player wants to go right
	else if (wasright) {
		ddx = ddx - FRICTION; // player was going right, but not any more
		if (this.velocity.y == 0)
			this.sprite.setAnimation(ANIM_SKID_RIGHT);
	}
	if (jump && !this.jumping && !falling) {
		ddy = ddy - JUMP; // apply an instantaneous (large) vertical impulse
		this.jumping = true;
		if (this.direction == LEFT)
			this.sprite.setAnimation(ANIM_JUMP_LEFT)
		else
			this.sprite.setAnimation(ANIM_JUMP_RIGHT)

	}

	// calculate the new position and velocity:
	this.position.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));
	this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
	this.velocity.x = bound(this.velocity.x + (deltaTime * ddx), -MAXDX, MAXDX);
	this.velocity.y = bound(this.velocity.y + (deltaTime * ddy), -MAXDY, MAXDY);
	if ((wasleft && (this.velocity.x > 0)) ||
		(wasright && (this.velocity.x < 0))) {
		// clamp at zero to prevent friction from making us jiggle side to side
		this.velocity.x = 0;
	}
	// collision detection
	// Our collision detection logic is greatly simplified by the fact that the
	// player is a rectangle and is exactly the same size as a single tile.
	// So we know that the player can only ever occupy 1, 2 or 4 cells.
	// This means we can short-circuit and avoid building a general purpose
	// collision detection
	// engine by simply looking at the 1 to 4 cells that the player occupies:
	var tx = pixelToTile(this.position.x);
	var ty = pixelToTile(this.position.y);
	var nx = (this.position.x) % TILE; // true if player overlaps right
	var ny = (this.position.y) % TILE; // true if player overlaps below
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
	var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
	var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);
	// If the player has vertical velocity, then check to see if they have hit a platform
	// below or above, in which case, stop their vertical velocity, and clamp their
	// y position:
	if (this.velocity.y > 0) {
		if ((celldown && !cell) || (celldiag && !cellright && nx)) {
			// clamp the y position to avoid falling into platform below
			this.position.y = tileToPixel(ty);
			this.velocity.y = 0; // stop downward velocity
			this.falling = false; // no longer falling
			this.jumping = false; // (or jumping)
			ny = 0; // no longer overlaps the cells below
		}
	}
	else if (this.velocity.y < 0) {
		if ((cell && !celldown) || (cellright && !celldiag && nx)) {
			// clamp the y position to avoid jumping into platform above
			this.position.y = tileToPixel(ty + 1);
			this.velocity.y = 0; // stop upward velocity
			// player is no longer really in that cell, we clamped them to the cell below
			cell = celldown;
			cellright = celldiag; // (ditto)
			ny = 0; // player no longer overlaps the cells below
		}
	}
	if (this.velocity.x > 0) {
		if ((cellright && !cell) || (celldiag && !celldown && ny)) {
			// clamp the x position to avoid moving into the platform we just hit
			this.position.x = tileToPixel(tx);
			this.velocity.x = 0; // stop horizontal velocity
		}
	}
	else if (this.velocity.x < 0) {
		if ((cell && !cellright) || (celldown && !celldiag && ny)) {
			// clamp the x position to avoid moving into the platform we just hit
			this.position.x = tileToPixel(tx + 1);
			this.velocity.x = 0; // stop horizontal velocity
		}
	}
	if (this.position.y > canvas.height) {
		lives = lives - 1;
		if (lives > 0)
			sfxDeathFall.play();
		else sfxGameOverFall.play();
		this.position.set(1 * TILE, 10 * TILE);
	}
	if (score == 10) {
		if (lives > 1)
			sfxLoseLife.play();
		else
			sfxTimeOut.play();
	}
	if (lives == 0) {
		gameState = STATE_GAMEOVER;
		return;
	}
	if (this.position.x > canvas.width + worldOffsetX - 70) {
		gameState = STATE_WIN;
		sfxWin.play();
		this.sprite.setAnimation(ANIM_APPEAL_RIGHT);
		return;
	}

}

Player.prototype.draw = function () {
	this.sprite.draw(context, this.position.x - worldOffsetX, this.position.y);
}

