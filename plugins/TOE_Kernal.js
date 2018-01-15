//=============================================================================
// Tails of Equestria Plugins - Kernal
// TOE_Kernel.js
//=============================================================================

var Imported = Imported || {};
Imported.TOE_Kernel = true;

var TOE = TOE || {};

//=============================================================================
 /*:
 * @plugindesc Kernel utility of TOE
 * @author Tails of Equestria project -Compeador
 */
 //=============================================================================
TOE.Parameters = PluginManager.parameters('TOE_Kernal');
TOE.Param = TOE.Param || {};

//=============================================================================
// TOE
// Kernel functions and definitions goes to this static class 
//=============================================================================

function TOE() {
    throw new Error('This is a static class');
}
//-----------------------------------------------------------------------------
// roll: roll a x-faced dice for n times
// the opt parameter may contain:
// advantage: true      => roll the process 2 times and return max one
// disadvantage: true   => same as above but return min one
// modification: [int]  => a integer, the return value will add up this
// display: [class]     => a Window_Roll class, if given, print the
//                         result to the window.
//-----------------------------------------------------------------------------
TOE.roll = function(face, times, opt){
    if(!times)times = 1; // default parameter for times = 1
    if(!face){
        throw new Error('Undefined dice roll: unknown faced die');
        return 0;
    }
    // default parameter for opt = {modification: 0}
    if(!opt)opt = {};
    if(!opt.modification)opt.modification = 0;

    // roll process
    var sum = 0, sum2 = 0;
    for(i = 0; i < times; i++){
        sum += Math.floor((Math.random() * 1000) % face) + 1;
    }

    // (dis)advantage process
    if(opt.advantage || opt.disadvantage){
        for(i = 0; i < times; i++){
            sum2 += Math.floor((Math.random() * 1000) % face) + 1;
        }
    }

    var result = sum;
    if(opt.advantage)result = Math.max(sum, sum2);
    if(opt.disadvantage)result = Math.min(sum, sum2);

    // display result to Window_Roll if given
    if(opt.display){
        // set the first time of the roll index
        if(!opt.init_index)opt.init_index = opt.display.index() + 1;
        opt.display.displayRoll(face,times,result);
    }

    // prevent float mod. is given
    result = Math.floor(result + opt.modification);

    // Exploding hoof mechanics by recursive
    if(result == times * face){
        var next_level = Math.min(20, face + 2);
        return Math.max(this.roll(next_level, times, opt), result);
    }

    // hi-light the roll process
    if(opt.display){
        opt.display.setCursorRange(opt.init_index, opt.display.index());
    }
    return result;
};

//=============================================================================
// Window_Roll
//=============================================================================

function Window_Roll() {
    this.initialize.apply(this, arguments);
}

Window_Roll.prototype = Object.create(Window_Selectable.prototype);
Window_Roll.prototype.constructor = Window_Roll;

Window_Roll.prototype.initialize = function() {
    var width = this.windowWidth();
    var height = this.windowHeight();
    this._lines = [];
    Window_Selectable.prototype.initialize.call(this, 0, 0, width, height);
    this.refresh();
};


Window_Roll.prototype.windowWidth = function() {
    return 120;
};

Window_Roll.prototype.windowHeight = function() {
    return this.fittingHeight(this.maxLines());
};

Window_Roll.prototype.standardFontSize = function() {
    return 20;
};

Window_Roll.prototype.maxLines = function() {
    return 8;
};

Window_Roll.prototype.numLines = function() {
    return this._lines.length;
};

Window_Roll.prototype.addText = function(text) {
    this._lines.push(text);
    this.refresh();
};

Window_Roll.prototype.maxItems = function(){
	return this._lines.length;
}

Window_Roll.prototype.refresh = function() {
    this.contents.clear();
    this.ensureCursorVisible();
    for (var i = 0; i < this.maxItems(); i++) {
        this.drawLineText(i);
    }
    if(this.maxItems() > 0){
    	this.select(this.maxItems() - 1);
    }
};

Window_Roll.prototype.drawLineText = function(index) {
    var rect = this.itemRectForText(index);
    this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
    this.drawTextEx(this._lines[index], rect.x, rect.y, rect.width);
};

Window_Roll.prototype.displayRoll = function(face, times, result){
    var str = sprintf("%sD%d=%d", times > 1 ? times : '', face, result);
	this.addText(str)
};

Window_Roll.prototype.setCursorRange = function(head, rear){
    // Swap head and rear if the order is reversed
    if(head > rear){
        head ^= rear; rear ^= head; head ^= rear;
    }
    var height = this.itemHeight() * (rear - head + 1);
    var rect = this.itemRect(this.index());
    rect.y -= (height - this.itemHeight());
    rect.height = height;
    this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
}