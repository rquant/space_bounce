var STAGE_WIDTH = 950;
var STAGE_HEIGHT = 650;

//only used when debugging box2d world
var BOX2D_DEMO_WIDTH = 500;
var BOX2D_DEMO_HEIGHT = 500;

var FPS = 30;

var BACKGROUND_COLOR = "#303030";
var PLANET_COLOR = "#E7F3FF";

//star field data
var STAR_COUNT = 300;
var MIN_STAR_RADIUS = 0.3;
var MAX_STAR_RADIUS = 0.7;
var MIN_STAR_VELOCITY = 0.1;
var MAX_STAR_VELOCITY = 0.7;

//energy orb data
var ENERGYORB_COUNT = 5;

//player capsule data
var PLAYER_RADIUS = 35;
var PLAYER_COLOR = "grey";

//force field data
var MAX_FORCE_FIELD_LENGTH = PLAYER_RADIUS * 3;
var BOUNDARY_THICKNESS = 3;

//physics data
var GRAVITY_X = 0;
var GRAVITY_Y = 6;

//the length of boundary from the stage, used for checking bounds of kinematic bodies
var BOUNDS = 10;

//properites for the menu system
var MENU_BUTTON_WIDTH = 180;
var MENU_BUTTON_HEIGHT = 30;
var BUTTON_PADDING = 20;

var HUD_OFFSET = 15;

var MAX_ENERGY = FPS * 30;
var ENERGY_ORB_VAL = FPS * 3;
var ANTIMATTER_ORB_VAL = FPS;

var TIME_TO_RESCUE = 50;
