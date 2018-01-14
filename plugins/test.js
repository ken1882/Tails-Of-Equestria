
function Scene_Test() {
    this.initialize.apply(this, arguments);
}

Scene_Test.prototype = Object.create(Scene_Base.prototype);
Scene_Test.prototype.constructor = Scene_Test;

Scene_Test.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
};

Scene_Test.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.createBackground();
    this.createWindowLayer();
    this.createWindow();
    $Watch = this._testWindow
};

Scene_Test.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    SceneManager.clearStack();
    this.startFadeIn(this.fadeSpeed(), false);
};

Scene_Test.prototype.update = function() {
    if (!this.isBusy()) {
        this._testWindow.open();
    }
    Scene_Base.prototype.update.call(this);
};

Scene_Test.prototype.isBusy = function() {
    return this._testWindow.isClosing() || Scene_Base.prototype.isBusy.call(this);
};

Scene_Test.prototype.terminate = function() {
    Scene_Base.prototype.terminate.call(this);
    SceneManager.snapForBackground();
};

Scene_Test.prototype.createBackground = function() {
	bmp = new Bitmap(Graphics.width, Graphics.height)
	bmp.fillRect(0,0,Graphics.width,Graphics.height, 'rgba(255,255,255,1)')
    this._backSprite = new Sprite(bmp);
    this.addChild(this._backSprite);
};

Scene_Test.prototype.createWindow = function() {
    this._testWindow = new Window_Roll();
    this.addWindow(this._testWindow);
};
//-------------------------------------------
function Window_Roll() {
    this.initialize.apply(this, arguments);
}

Window_Roll.prototype = Object.create(Window_Selectable.prototype);
Window_Roll.prototype.constructor = Window_Roll;

Window_Roll.prototype.initialize = function() {
    var width = this.windowWidth();
    var height = this.windowHeight();
    ls(width, height)
    this._lines = [];
    Window_Selectable.prototype.initialize.call(this, 0, 0, width, height);
    this.refresh();
};

Window_Roll.prototype.setSpriteset = function(spriteset) {
    this._spriteset = spriteset;
};

Window_Roll.prototype.windowWidth = function() {
    return 120;
};

Window_Roll.prototype.windowHeight = function() {
    return this.fittingHeight(this.maxLines());
};

Window_Base.prototype.standardFontSize = function() {
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

Window_Roll.prototype.popBaseLine = function() {
    var baseLine = this._baseLineStack.pop();
    while (this._lines.length > baseLine) {
        this._lines.pop();
    }
};

Window_Roll.prototype.wait = function() {
    this._waitCount = this.messageSpeed();
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

Window_Roll.prototype.displayRoll = function(face, result){
	this.addText(sprintf("D%d=%d", face, result))
};

//------------------------------

var old_boot_scene_start = Scene_Boot.prototype.start;
var $Testing = true;
var $Watch   = null;

Scene_Boot.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    SoundManager.preloadImportantSounds();
    if (DataManager.isBattleTest()) {
        DataManager.setupBattleTest();
        SceneManager.goto(Scene_Battle);
    } else if (DataManager.isEventTest()) {
        DataManager.setupEventTest();
        SceneManager.goto(Scene_Map);
    } else {
        this.checkPlayerLocation();
        DataManager.setupNewGame();
        SceneManager.goto($Testing ? Scene_Test : Scene_Title);
        Window_TitleCommand.initCommandPosition();
    }
    this.updateDocumentTitle();
};