"use client"

import { toast } from "sonner"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Mail, MapPin, Github, Linkedin, GraduationCap, Bell } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
// import { ChatBox } from "@/components/chat-box"
import { FlyingPublications } from "@/components/flying-publications"

export default function HomePage() {
  return (
    <div className="flex flex-col relative bg-transparent">
      <FlyingPublications />
      <section className="relative overflow-hidden bg-background/50 py-12 md:py-20">
        <div className="container relative">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Profile image - appears first on mobile, on the right on desktop */}
              <div className="flex-shrink-0 lg:order-2">
                <Image 
                  src="/images/profile.jpg" 
                  alt="Core Francisco Park"
                  width={256}
                  height={320}
                  className="h-64 w-48 lg:h-80 lg:w-64 rounded-lg object-cover shadow-2xl"
                  priority
                />
              </div>
              
              {/* Text content - appears second on mobile, on the left on desktop */}
              <div className="flex-1 text-center lg:text-left lg:order-1">
                <h1 className="mb-3 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Core Francisco Park
                </h1>
                <p className="mb-6 text-sm text-muted-foreground">
                  If you think good academics should not have fancy websites: <Link href="/simple" className="underline hover:text-foreground">corefranciscopark.com/simple</Link>
                </p>
                <p className="mb-4 text-lg text-muted-foreground sm:text-xl">
                  Ph.D. Candidate at Harvard Physics exploring the intersection of
                  AI/ML, astrophysics, and neuroscience. Currently working on understanding
                  AI systems through carefully designed experiments.
                </p>
                
                {/* Contact buttons */}
                <div className="mb-8 flex flex-col gap-2">
                  {/* First row: Email and Location */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        navigator.clipboard.writeText("corefranciscopark@g.harvard.edu")
                        toast.success("Email copied to clipboard!")
                      }}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      corefranciscopark@g.harvard.edu
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MapPin className="mr-2 h-4 w-4" />
                      Cambridge, MA
                    </Button>
                  </div>
                  
                  {/* Second row: Social links */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                    <Button variant="ghost" size="sm" asChild>
                      <a href="https://x.com/corefpark" target="_blank" rel="noopener noreferrer">
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        Twitter
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <a href="https://scholar.google.com/citations?user=RfXjPuEAAAAJ" target="_blank" rel="noopener noreferrer">
                        <GraduationCap className="mr-2 h-4 w-4" />
                        Google Scholar
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <a href="https://github.com/cfpark00" target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        GitHub
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <a href="https://www.linkedin.com/in/core-francisco-park-aab305284" target="_blank" rel="noopener noreferrer">
                        <Linkedin className="mr-2 h-4 w-4" />
                        LinkedIn
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="py-12 md:py-20 relative z-10 bg-background/50">
        <div className="container mx-auto max-w-4xl space-y-8">
          <ChatBox />
          
          {/* Stay Updated - Redesigned */}
          {/* <div className="mx-auto max-w-2xl">
            <Card className="border-dashed bg-transparent">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-medium text-sm mb-1">Stay updated</h3>
                    <p className="text-xs text-muted-foreground">
                      Occasional updates about research and publications
                    </p>
                  </div>
                  <form className="flex w-full sm:w-auto gap-2">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="rounded-md border bg-background/70 px-3 py-1.5 text-sm w-40"
                    />
                    <Button type="submit" size="sm">
                      <Bell className="h-3 w-3 mr-1" />
                      Subscribe
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div> 
        </div>
      </section> */}
    </div>
  )
}