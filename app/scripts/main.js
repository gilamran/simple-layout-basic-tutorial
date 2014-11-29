'use strict';
/* global PIXI, SimpleLayout, atlasJson */

// init pixi stage
var stage = new PIXI.Stage(0xFFFFFF);
var canvas = $('canvas')[0];
var renderer = PIXI.autoDetectRenderer(800, 600, {view:canvas});

var assetsFactory = new SimpleLayout.PixiJSImpl.AtlasAssetsFactory_PixiJS({atlasImageUrl:'images/atlas.png', atlasJson:atlasJson});
var gameScreen;

function createLayout() {
	// creating the layout
	var rootContainer		= new SimpleLayout.LayoutContainer();
	var mainContainer 		= new SimpleLayout.LayoutContainer();
	var buttonsContainer 	= new SimpleLayout.LayoutContainer();
	var background 			= new SimpleLayout.LayoutItem();

	background.assetId = 'background.png';
	background.fillArea = true;	// will NOT keep its own aspect ratio, and fill the given area

	buttonsContainer.addNewLayoutItem('playButton.png');
	buttonsContainer.addNewLayoutItem('challengeButton.png');
	buttonsContainer.addNewLayoutItem('getProButton.png');
	buttonsContainer.layout = new SimpleLayout.layout.VerticalLayout();

	var logoLayoutItem = new SimpleLayout.LayoutItem();
	logoLayoutItem.requestedHeightPercent = 0.4;
	logoLayoutItem.assetId = 'Logo.png';

	mainContainer.addLayoutItem(logoLayoutItem);
	mainContainer.addLayoutItem(buttonsContainer);
	mainContainer.layout = new SimpleLayout.layout.VerticalLayout();
	mainContainer.layout.paddingLeft = 0.2;
	mainContainer.layout.paddingRight = 0.2;
	mainContainer.layout.paddingTop = 0.1;
	mainContainer.layout.paddingBottom = 0.1;
	mainContainer.layout.gap = 0.1;

	rootContainer.layout = new SimpleLayout.layout.BasicLayout();
	rootContainer.addLayoutItem(background);
	rootContainer.addLayoutItem(mainContainer);
	return rootContainer;
}

function onAssetsLoaded()
{
	// creating the game layout
	gameScreen = createLayout();

	// asking SimpleLayout to go over all the children and create the assets using the provided factory
	SimpleLayout.LayoutAssetsFactory.createAssets(gameScreen, assetsFactory);

	// After creating the real Pixi assets (Concrete Display Objects)
	// Add the the root parent to the stage
	stage.addChild(gameScreen.displayObject.getConcreteDisplayObject());

	fitCanvasToWindow();
}

function fitCanvasToWindow() {
	var windowWidth = $(window).width() || 800;
	var windowHeight = $(window).height() || 600;
	renderer.resize(windowWidth, windowHeight);

	if (gameScreen) {
		// execute the layout for the current renderer size
		gameScreen.fitInto(renderer.width, renderer.height);
	}

	// ask Pixi to draw the stage
	renderer.render(stage);
}

$( window ).resize(fitCanvasToWindow);

// load the assets
assetsFactory.loadAssets(onAssetsLoaded);
