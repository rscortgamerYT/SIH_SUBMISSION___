"use client"

import Image from "next/image"

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center gap-4">
            <Image
              src="/afterburner-logo.png"
              alt="AfterBurner Logo"
              width={120}
              height={40}
              className="object-contain"
            />
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Created and maintained by <span className="font-semibold text-primary">Shikhar Shahi</span> &{" "}
              <span className="font-semibold text-primary">Team AfterBurner</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              To solve civic problems in Jharkhand and empower voices
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>© 2024 TownShip</span>
            <span>•</span>
            <span>Empowering Communities</span>
            <span>•</span>
            <span>Building Better Cities</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
