// Backup of the original right side design with abstract geometric shapes

export const OriginalRightSide = () => (
  <>
    {/* Right side - Art */}
    <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Abstract geometric shapes */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="grid grid-cols-3 gap-4 opacity-20">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="h-20 w-20 rounded-lg bg-white/30 backdrop-blur-sm"
              style={{
                animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
        
        <div className="mt-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-2">Welcome to Research Portal</h2>
          <p className="text-white/80 max-w-md">
            Your secure workspace for managing research projects, experiments, and collaborations.
          </p>
        </div>
      </div>

      {/* Add floating animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  </>
)