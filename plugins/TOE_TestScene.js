//=============================================================================
// Tails of Equestria Plugins - Simple Test Scene
// TOE_TestScene.js
//=============================================================================

var Imported = Imported || {};
Imported.TOE_TestScene = true;

var TOE = TOE || {};

//=============================================================================
 /*:
 * @plugindesc Simple Testing Scene that offer a blank-white base to
 * testing your stuffs and codes. This will replace first scene class
 * with this testing scene.
 * @author Tails of Equestria project -Compeador
 *
 * @param ---General---
 * @default
 *
 * @param TestEnabled
 * @parent ---General---
 * @desc Testing Enable Flag
 * @default false
 */
 //=============================================================================
TOE.Parameters = PluginManager.parameters('TOE_TestScene');
TOE.Param = TOE.Param || {};

TOE.Param.TestEnabled = eval(String(TOE.Parameters['TestEnabled']));

// Global variable for debug watching
var $watch = null;

//=============================================================================
// Scene_Test
//=============================================================================

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
    $watch = this._testWindow
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


//=============================================================================
// Scene_Boot
//=============================================================================

var alias_sb_start = Scene_Boot.prototype.start;

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
        SceneManager.goto(TOE.Param.TestEnabled ? Scene_Test : Scene_Title);
        Window_TitleCommand.initCommandPosition();
    }
    this.updateDocumentTitle();
};