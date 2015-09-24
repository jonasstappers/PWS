function Vector (x, y) {
    if (!(this instanceof Vector)){
        return new Vector(x, y);
    }
    
    this.x = x || 0;
    this.y = y || 0;
}

Vector.prototype.addX = function (vec) {
    this.x += vec.x;
    return this;
}

Vector.prototype.addY = function (vec) {
    this.y += vec.y;
    return this;
}