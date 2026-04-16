import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameState } from '../types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Play, Pause, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = 'UP';

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: { x: 5, y: 5 },
    direction: INITIAL_DIRECTION,
    score: 0,
    isGameOver: false,
    isPaused: true,
  });

  const moveSnake = useCallback(() => {
    if (gameState.isGameOver || gameState.isPaused) return;

    setGameState((prev) => {
      const newSnake = [...prev.snake];
      const head = { ...newSnake[0] };

      switch (prev.direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check collisions
      if (
        head.x < 0 || head.x >= GRID_SIZE ||
        head.y < 0 || head.y >= GRID_SIZE ||
        newSnake.some((segment) => segment.x === head.x && segment.y === head.y)
      ) {
        return { ...prev, isGameOver: true };
      }

      newSnake.unshift(head);

      // Check food
      if (head.x === prev.food.x && head.y === prev.food.y) {
        const newFood = {
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
        };
        return {
          ...prev,
          snake: newSnake,
          food: newFood,
          score: prev.score + 10,
        };
      }

      newSnake.pop();
      return { ...prev, snake: newSnake };
    });
  }, [gameState.isGameOver, gameState.isPaused]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          setGameState((prev) => prev.direction !== 'DOWN' ? { ...prev, direction: 'UP' } : prev);
          break;
        case 'ArrowDown':
          setGameState((prev) => prev.direction !== 'UP' ? { ...prev, direction: 'DOWN' } : prev);
          break;
        case 'ArrowLeft':
          setGameState((prev) => prev.direction !== 'RIGHT' ? { ...prev, direction: 'LEFT' } : prev);
          break;
        case 'ArrowRight':
          setGameState((prev) => prev.direction !== 'LEFT' ? { ...prev, direction: 'RIGHT' } : prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [moveSnake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = '#ff00ff'; // Neon Magenta
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      gameState.food.x * cellSize + cellSize / 2,
      gameState.food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw snake
    gameState.snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00ffff' : '#008888'; // Neon Cyan
      if (index === 0) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ffff';
      }
      ctx.fillRect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );
      ctx.shadowBlur = 0;
    });

    if (gameState.isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ff0000';
      ctx.font = 'bold 30px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
    }
  }, [gameState]);

  const resetGame = () => {
    setGameState({
      snake: INITIAL_SNAKE,
      food: { x: 5, y: 5 },
      direction: INITIAL_DIRECTION,
      score: 0,
      isGameOver: false,
      isPaused: false,
    });
  };

  const togglePause = () => {
    setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  };

  return (
    <Card className="p-6 bg-zinc-950 border-zinc-800 shadow-2xl shadow-cyan-900/20">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight uppercase">System.Snake</h2>
        </div>
        <Badge variant="outline" className="text-cyan-400 border-cyan-900/50 bg-cyan-950/20 px-3 py-1 font-mono">
          SCORE: {gameState.score.toString().padStart(4, '0')}
        </Badge>
      </div>

      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded-lg border border-zinc-800 bg-black cursor-none"
        />
        
        {gameState.isPaused && !gameState.isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-lg">
            <Button 
              onClick={togglePause}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-6 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105"
            >
              <Play className="mr-2 fill-current" /> START GAME
            </Button>
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-4">
        <Button
          variant="outline"
          onClick={togglePause}
          disabled={gameState.isGameOver}
          className="flex-1 border-zinc-800 text-zinc-400 hover:text-cyan-400 hover:border-cyan-900/50 hover:bg-cyan-950/20"
        >
          {gameState.isPaused ? <Play size={18} className="mr-2" /> : <Pause size={18} className="mr-2" />}
          {gameState.isPaused ? 'RESUME' : 'PAUSE'}
        </Button>
        <Button
          variant="outline"
          onClick={resetGame}
          className="flex-1 border-zinc-800 text-zinc-400 hover:text-magenta-400 hover:border-magenta-900/50 hover:bg-magenta-950/20"
        >
          <RotateCcw size={18} className="mr-2" /> RESET
        </Button>
      </div>
      
      <div className="mt-4 text-[10px] text-zinc-600 font-mono uppercase tracking-[0.2em] text-center">
        Use Arrow Keys to Navigate • Avoid Walls & Self
      </div>
    </Card>
  );
};
