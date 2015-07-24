/**
 * [Rect Object]
 * @param {[type]} x [ x-coordinate location of the left side of the rectangle.]
 * @param {[type]} y [ y-coordinate location of the left side of the rectangle.]
 * @param {[type]} w [a non-negative value that represents the Width of the rectangle.]
 * @param {[type]} h [a non-negative value that represents the Height of the rectangle.]
 *
 * p1(x,y)               p2(r)
 *  +-----------w---------+
 *   |                        |
 *   |                        h
 *   |                        |
 *  +-----------------------+
 * p3(r)                  p4(r)
 */
function Rect(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
}
/**
 * [check position x,y is in Rect Object ?]
 * @param  {[type]} x [x-coordinate location]
 * @param  {[type]} y [y-coordinate location]
 * @return {[if point(x,y) in Rect return true else return false]}
 */
Rect.prototype.inRect = function(x,y) {
  if((x>=this.x && x<=this.x+this.w) &&(y>=this.y && y<=this.y+this.h) )
    return true;
  else
    return false;
}
/**
 * [check point(x,y) is in p4(r) ?]
 * @param  {[type]} x [x-coordinate location]
 * @param  {[type]} y [y-coordinate location]
 * @param  {[type]} r [radius of point]
 * @return {[type]}   [if point(x,y) in p4(r) return true else return false]
 */
Rect.prototype.in4thPoint = function(x,y,r) {
  if((x>=this.x+this.w-r && x<=this.x+this.w+r) &&(y>=this.y+this.h-r && y<=this.y+this.h+r) )
    return true;
  else
    return false;
}
