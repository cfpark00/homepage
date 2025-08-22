import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { GraduationCap, Briefcase, Award, BookOpen, Users, Activity } from "lucide-react"
import type { CVData } from "@/app/(default)/cv/page"

export function TraditionalView({ data }: { data: CVData }) {
  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Research Interests</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-inside list-disc space-y-2">
            {data.researchInterests.map((interest, index) => (
              <li key={index} className="text-sm">{interest}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Education
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {data.education.map((edu, index) => (
              <div key={index} className="border-l-2 border-muted pl-6">
                <div className="relative -left-[27px] h-4 w-4 rounded-full bg-primary" />
                <div className="-mt-4">
                  <h3 className="font-semibold">{edu.degree}</h3>
                  <p className="text-sm text-muted-foreground">
                    {edu.institution} · {edu.period}
                  </p>
                  <p className="mt-1 text-sm">{edu.description}</p>
                  {edu.gpa && (
                    <p className="text-sm font-medium">{edu.gpa}</p>
                  )}
                  {edu.advisor && (
                    <p className="text-sm text-muted-foreground">
                      {edu.advisor}
                    </p>
                  )}
                  {edu.thesis && (
                    <p className="text-sm italic mt-1">
                      {edu.thesis}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Professional Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <h3 className="font-semibold">{exp.position}</h3>
                <p className="text-sm text-muted-foreground">
                  {exp.institution} · {exp.period}
                </p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                  {exp.responsibilities.map((resp, idx) => (
                    <li key={idx}>{resp}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Awards & Honors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.awards.map((award, index) => (
                <li key={index} className="flex justify-between">
                  <span className="text-sm">{award.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {award.year}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Skills & Expertise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(data.skills).map(([category, items]) => (
                <div key={category}>
                  <p className="mb-2 text-sm font-semibold">{category}</p>
                  <div className="flex flex-wrap gap-1">
                    {items.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Professional Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Membership</h4>
              <ul className="space-y-1">
                {data.service.membership.map((item, index) => (
                  <li key={index} className="flex justify-between text-sm">
                    <span>{item.organization}</span>
                    <span className="text-muted-foreground">{item.period}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Peer Review (30 papers total)</h4>
              <ul className="space-y-1">
                {data.service.reviewing.map((item, index) => (
                  <li key={index} className="flex justify-between text-sm">
                    <span>{item.venue}</span>
                    <span className="text-muted-foreground">{item.count} papers · {item.year}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Extracurricular Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {data.extracurricular.map((item, index) => (
              <li key={index} className="border-l-2 border-muted pl-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{item.activity}</span>
                  <span className="text-sm text-muted-foreground">{item.year}</span>
                </div>
                {item.achievement && (
                  <p className="text-xs text-muted-foreground mt-1">{item.achievement}</p>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </>
  )
}