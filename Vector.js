var Vector2 = function () {
    this.x = 1;
    this.y = 1;
}


Vector2.prototype.set = function (x, y) {
    this.x = x;
    this.y = y;
}

Vector2.prototype.normalize = function () {
    this.x = 0;
    this.y = 0;
}

Vector2.prototype.add = function (v2) {
    var newVector = new Vector2();
    newVector.Set(this.x + v2.x, this.y + v2.y);
    return newVector;
}

Vector2.prototype.subtract = function (v2) {
    this.x = this.x - v2.x;
    this.y = this.y - v2.y;
}

Vector2.prototype.multiplyScalar = function (num) {
    this.x = this.x * num;
    this.y = this.y * num;
}