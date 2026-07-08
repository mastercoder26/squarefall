const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const gameOverEl = document.getElementById("gameOver");

canvas.width = 480;
canvas.height = 640;

const FALL_SPEED = 180; // px per second, fixed
const SPAWN_INTERVAL = 0.8; // seconds, fixed
const SQUARE_MIN = 20;
const SQUARE_MAX = 40;
const PLAYER_SPEED = 320;

let state;
