import { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 60;

type Point = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  
  const directionRef = useRef(direction);
  
  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setIsPaused(false);
    setHasStarted(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && hasStarted) {
        setIsPaused(p => !p);
        return;
      }

      if (isPaused || gameOver) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, gameOver, hasStarted]);

  useEffect(() => {
    if (isPaused || gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [isPaused, gameOver, food, generateFood, highScore]);

  return (
    <div className="flex flex-col items-center gap-6 font-digital">
      {/* Score Board */}
      <div className="flex gap-8 bg-black border-4 border-[#0ff] px-8 py-4 shadow-[8px_8px_0px_#f0f]">
        <div className="flex flex-col items-center">
          <span className="text-[#f0f] text-xl uppercase tracking-widest mb-1">DATA_YIELD</span>
          <span className="text-5xl font-bold text-white">{score}</span>
        </div>
        <div className="w-1 bg-[#0ff]"></div>
        <div className="flex flex-col items-center">
          <span className="text-[#f0f] text-xl uppercase tracking-widest mb-1">MAX_OVERRIDE</span>
          <span className="text-5xl font-bold text-white">{highScore}</span>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative p-2 bg-black border-4 border-[#f0f] shadow-[-8px_8px_0px_#0ff]">
        <div 
          className="bg-black relative overflow-hidden"
          style={{ 
            width: GRID_SIZE * CELL_SIZE, 
            height: GRID_SIZE * CELL_SIZE,
            backgroundImage: 'linear-gradient(#0ff 1px, transparent 1px), linear-gradient(90deg, #0ff 1px, transparent 1px)',
            backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
            opacity: 0.8
          }}
        >
          {/* Food */}
          <div 
            className="absolute bg-[#f0f] animate-ping"
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              left: food.x * CELL_SIZE,
              top: food.y * CELL_SIZE,
            }}
          />
          <div 
            className="absolute bg-[#fff]"
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              left: food.x * CELL_SIZE,
              top: food.y * CELL_SIZE,
            }}
          />

          {/* Snake */}
          {snake.map((segment, index) => {
            const isHead = index === 0;
            return (
              <div
                key={`${segment.x}-${segment.y}-${index}`}
                className={`absolute ${isHead ? 'bg-white' : 'bg-[#0ff]'}`}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  left: segment.x * CELL_SIZE,
                  top: segment.y * CELL_SIZE,
                  opacity: Math.max(0.3, 1 - (index / snake.length)),
                }}
              >
                {isHead && (
                  <div className="w-full h-full bg-[#f0f] animate-pulse"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Overlays */}
        {(!hasStarted || gameOver) && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80">
            <div className="text-center p-6 bg-black border-4 border-[#f0f] shadow-[8px_8px_0px_#0ff]">
              <h2 className="text-4xl md:text-5xl font-arcade text-white mb-4 glitch-text" data-text={gameOver ? 'SYS_FAILURE' : 'AWAITING_INPUT'}>
                {gameOver ? 'SYS_FAILURE' : 'AWAITING_INPUT'}
              </h2>
              {gameOver && <p className="text-[#0ff] text-2xl mb-6">FINAL_YIELD: {score}</p>}
              <button 
                onClick={resetGame}
                className="w-full py-4 px-6 bg-[#0ff] hover:bg-[#f0f] text-black hover:text-white font-arcade text-xl transition-colors border-2 border-white"
              >
                {gameOver ? 'REBOOT_SYS' : 'EXECUTE'}
              </button>
              <p className="mt-4 text-xl text-[#f0f] animate-pulse">&gt;&gt; INPUT: WASD / ARROWS</p>
            </div>
          </div>
        )}
        
        {isPaused && hasStarted && !gameOver && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80">
            <div className="text-4xl md:text-5xl font-arcade text-[#f0f] glitch-text" data-text="SYS_PAUSED">
              SYS_PAUSED
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
