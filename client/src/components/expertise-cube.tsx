import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import type { ExpertiseScore } from "@shared/schema";

interface ExpertiseCubeProps {
  expertiseScore: ExpertiseScore;
  filters: {
    dimensions: Record<string, boolean>;
    minExperienceYears: number;
    department: string;
  };
  onFaceClick: (faceName: string) => void;
}

const faceConfigs = [
  { name: "technicalSkills", label: "Technical Skills", color: "#0078D4", icon: "💻" },
  { name: "leadership", label: "Leadership", color: "#107C10", icon: "👥" },
  { name: "communication", label: "Communication", color: "#FFB900", icon: "💬" },
  { name: "projectManagement", label: "Project Mgmt", color: "#D13438", icon: "📋" },
  { name: "innovation", label: "Innovation", color: "#881798", icon: "💡" },
  { name: "domainKnowledge", label: "Domain", color: "#6B7280", icon: "🎓" },
];

export function ExpertiseCube({ expertiseScore, filters, onFaceClick }: ExpertiseCubeProps) {
  const [rotationX, setRotationX] = useState(-20);
  const [rotationY, setRotationY] = useState(25);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(false);
  const [scale, setScale] = useState(1);
  const cubeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationId: number;
    if (autoRotate) {
      const animate = () => {
        setRotationY(prev => (prev + 1) % 360);
        animationId = requestAnimationFrame(animate);
      };
      animationId = requestAnimationFrame(animate);
    }
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [autoRotate]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;
    
    setRotationX(prev => prev - deltaY * 0.5);
    setRotationY(prev => prev + deltaX * 0.5);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch events for mobile support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setLastMousePos({ x: touch.clientX, y: touch.clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    
    e.preventDefault(); // Prevent scrolling
    const touch = e.touches[0];
    const deltaX = touch.clientX - lastMousePos.x;
    const deltaY = touch.clientY - lastMousePos.y;
    
    setRotationX(prev => prev - deltaY * 0.5);
    setRotationY(prev => prev + deltaX * 0.5);
    setLastMousePos({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleResetView = () => {
    setRotationX(-20);
    setRotationY(25);
    setScale(1);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const toggleAutoRotate = () => {
    setAutoRotate(!autoRotate);
  };

  const faces = faceConfigs.map((config) => ({
    ...config,
    score: expertiseScore[config.name as keyof ExpertiseScore] as number,
    isVisible: filters.dimensions[config.name] !== false,
  }));

  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Cube Controls */}
      <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10 bg-white rounded-lg shadow-lg p-2 md:p-3">
        <div className="flex items-center space-x-1 md:space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleResetView}
            title="Reset View"
          >
            <Home size={14} className="text-gray-600 md:w-4 md:h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <ZoomIn size={14} className="text-gray-600 md:w-4 md:h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <ZoomOut size={14} className="text-gray-600 md:w-4 md:h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleAutoRotate}
            title="Auto Rotate"
            className={autoRotate ? "text-ms-blue" : "text-gray-600"}
          >
            <RotateCcw size={14} className="md:w-4 md:h-4" />
          </Button>
        </div>
      </div>

      {/* 3D Cube Container */}
      <div 
        className="w-full h-full flex items-center justify-center perspective-1000 touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div
          ref={cubeRef}
          className="relative preserve-3d"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale3d(${scale}, ${scale}, ${scale})`,
            transition: isDragging ? 'none' : 'transform 0.3s ease',
            width: 'min(300px, 60vw)',
            height: 'min(300px, 60vw)',
          }}
        >
          {/* Front Face - Technical Skills */}
          {faces[0].isVisible && (
            <div
              className="absolute w-full h-full border-2 border-white/20 flex flex-col items-center justify-center text-white font-semibold cursor-pointer transition-all duration-300 hover:brightness-110"
              style={{
                backgroundColor: faces[0].color,
                transform: 'translateZ(150px)',
                backdropFilter: 'blur(10px)',
              }}
              onClick={() => onFaceClick("technicalSkills")}
            >
              <div className="text-2xl md:text-3xl mb-1 md:mb-2">{faces[0].icon}</div>
              <div className="text-xs md:text-sm font-bold">{faces[0].label}</div>
              <div className="text-xs mt-1">Score: {faces[0].score.toFixed(1)}/10</div>
            </div>
          )}

          {/* Right Face - Leadership */}
          {faces[1].isVisible && (
            <div
              className="absolute w-full h-full border-2 border-white/20 flex flex-col items-center justify-center text-white font-semibold cursor-pointer transition-all duration-300 hover:brightness-110"
              style={{
                backgroundColor: faces[1].color,
                transform: 'rotateY(90deg) translateZ(150px)',
              }}
              onClick={() => onFaceClick("leadership")}
            >
              <div className="text-2xl md:text-3xl mb-1 md:mb-2">{faces[1].icon}</div>
              <div className="text-xs md:text-sm font-bold">{faces[1].label}</div>
              <div className="text-xs mt-1">Score: {faces[1].score.toFixed(1)}/10</div>
            </div>
          )}

          {/* Back Face - Project Management */}
          {faces[3].isVisible && (
            <div
              className="absolute w-full h-full border-2 border-white/20 flex flex-col items-center justify-center text-white font-semibold cursor-pointer transition-all duration-300 hover:brightness-110"
              style={{
                backgroundColor: faces[3].color,
                transform: 'rotateY(180deg) translateZ(150px)',
              }}
              onClick={() => onFaceClick("projectManagement")}
            >
              <div className="text-2xl md:text-3xl mb-1 md:mb-2">{faces[3].icon}</div>
              <div className="text-xs md:text-sm font-bold">{faces[3].label}</div>
              <div className="text-xs mt-1">Score: {faces[3].score.toFixed(1)}/10</div>
            </div>
          )}

          {/* Left Face - Innovation */}
          {faces[4].isVisible && (
            <div
              className="absolute w-full h-full border-2 border-white/20 flex flex-col items-center justify-center text-white font-semibold cursor-pointer transition-all duration-300 hover:brightness-110"
              style={{
                backgroundColor: faces[4].color,
                transform: 'rotateY(-90deg) translateZ(150px)',
              }}
              onClick={() => onFaceClick("innovation")}
            >
              <div className="text-2xl md:text-3xl mb-1 md:mb-2">{faces[4].icon}</div>
              <div className="text-xs md:text-sm font-bold">{faces[4].label}</div>
              <div className="text-xs mt-1">Score: {faces[4].score.toFixed(1)}/10</div>
            </div>
          )}

          {/* Top Face - Communication */}
          {faces[2].isVisible && (
            <div
              className="absolute w-full h-full border-2 border-white/20 flex flex-col items-center justify-center text-white font-semibold cursor-pointer transition-all duration-300 hover:brightness-110"
              style={{
                backgroundColor: faces[2].color,
                transform: 'rotateX(90deg) translateZ(150px)',
              }}
              onClick={() => onFaceClick("communication")}
            >
              <div className="text-2xl md:text-3xl mb-1 md:mb-2">{faces[2].icon}</div>
              <div className="text-xs md:text-sm font-bold">{faces[2].label}</div>
              <div className="text-xs mt-1">Score: {faces[2].score.toFixed(1)}/10</div>
            </div>
          )}

          {/* Bottom Face - Domain Knowledge */}
          {faces[5].isVisible && (
            <div
              className="absolute w-full h-full border-2 border-white/20 flex flex-col items-center justify-center text-white font-semibold cursor-pointer transition-all duration-300 hover:brightness-110"
              style={{
                backgroundColor: faces[5].color,
                transform: 'rotateX(-90deg) translateZ(150px)',
              }}
              onClick={() => onFaceClick("domainKnowledge")}
            >
              <div className="text-2xl md:text-3xl mb-1 md:mb-2">{faces[5].icon}</div>
              <div className="text-xs md:text-sm font-bold">{faces[5].label}</div>
              <div className="text-xs mt-1">Score: {faces[5].score.toFixed(1)}/10</div>
            </div>
          )}
        </div>
      </div>

      {/* Employee Info Overlay - Hidden on small screens */}
      <div className="hidden md:block absolute bottom-2 md:bottom-4 left-2 md:left-4 bg-white rounded-lg shadow-lg p-2 md:p-4 max-w-xs">
        <h3 className="font-semibold mb-2 text-sm md:text-base">Current Analysis</h3>
        <div className="text-xs md:text-sm text-gray-600">
          <p>Overall Score: <span className="font-semibold text-ms-blue">{expertiseScore.overallScore.toFixed(1)}/10</span></p>
          <p className="text-xs mt-1">Last updated: {new Date(expertiseScore.lastUpdated).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Cube Legend - Compact on mobile */}
      <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-white rounded-lg shadow-lg p-2 md:p-4 max-w-xs">
        <h4 className="font-medium mb-2 md:mb-3 text-xs md:text-sm">Dimensions</h4>
        <div className="space-y-1 md:space-y-2 text-xs">
          {faceConfigs.slice(0, 3).map((face) => (
            <div key={face.name} className="flex items-center">
              <div 
                className="w-2 h-2 md:w-3 md:h-3 rounded mr-1 md:mr-2" 
                style={{ backgroundColor: face.color }}
              />
              <span className="text-xs md:text-sm">{face.label}</span>
            </div>
          ))}
          <div className="text-xs text-gray-500 mt-1">+3 more...</div>
        </div>
      </div>
    </div>
  );
}
