'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, ArrowUpRight, ChevronDown, Github, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const REPOSITORY = {
  name: 'coffee-finder',
  url: 'https://github.com/VathanakSol/coffee-finder'
}

interface Contributor {
  id: number
  login: string
  avatarUrl: string
  profileUrl: string
  contributions: number
  type: string
}

function formatContributions(count: number) {
  return new Intl.NumberFormat('en-US').format(count)
}

export function ContributorSection() {
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const totalContributions = contributors.reduce((total, contributor) => {
    return total + contributor.contributions
  }, 0)

  useEffect(() => {
    let active = true

    const loadContributors = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/github/contributors')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch contributors')
        }

        if (active) {
          setContributors(data.contributors || [])
        }
      } catch (fetchError) {
        if (active) {
          setError(fetchError instanceof Error ? fetchError.message : 'Failed to fetch contributors')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadContributors()

    return () => {
      active = false
    }
  }, [])

  return (
    <section aria-labelledby="contributor-heading" className="mt-6">
      <Card className="overflow-hidden border-amber-200/70 bg-white/85 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-950/75">
        <CardContent className="space-y-5 px-5 py-5 md:px-6 md:py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2.5">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
                <Users className="h-3 w-3" />
                Project Credits
              </p>

              <h2
                id="contributor-heading"
                className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-50 md:text-2xl"
              >
                Thanks to the contributors behind Coffee Finder.
              </h2>

              {!isExpanded ? (
                <p className="max-w-2xl text-xs leading-5 text-muted-foreground md:text-sm">
                  Contributors and repo details are available on demand.
                </p>
              ) : (
                <p className="max-w-3xl text-xs leading-5 text-muted-foreground md:text-sm">
                  This project is maintained in the open. Every contribution helps improve Coffee Finder,
                  and the repository is open for anyone who wants to explore the code, suggest fixes, or
                  build on top of it.
                </p>
              )}
            </div>

            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setIsExpanded((current) => !current)}
              className="h-9 shrink-0 rounded-full border-amber-200 bg-white/75 px-4 text-xs dark:border-gray-700 dark:bg-gray-900/70 dark:hover:bg-gray-900"
            >
              {isExpanded ? 'Hide Details' : 'Show Details'}
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          {isExpanded ? (
            <>
              <div className="flex flex-wrap gap-2.5">
                <Button asChild size="sm" className="h-9 rounded-full bg-gray-900 px-4 text-xs text-white dark:bg-gray-100 dark:text-gray-950 dark:hover:bg-gray-200">
                  <a href={REPOSITORY.url} target="_blank" rel="noreferrer noopener">
                    <Github className="h-3.5 w-3.5" />
                    View Repository
                  </a>
                </Button>

                <Button asChild size="sm" variant="outline" className="h-9 rounded-full border-amber-200 bg-white/75 px-4 text-xs dark:border-gray-700 dark:bg-gray-900/70 dark:hover:bg-gray-900">
                  <a href={`${REPOSITORY.url}/graphs/contributors`} target="_blank" rel="noreferrer noopener">
                    See All Contributors
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>

              <div className="rounded-3xl border border-amber-100 bg-amber-50/60 p-4 dark:border-gray-800 dark:bg-gray-900/50">
                <div className="flex items-center justify-between gap-3 border-b border-amber-100 pb-3 dark:border-gray-800">
                  <div>
                    <p className="flex items-center gap-1.5 text-xs font-medium text-gray-900 dark:text-gray-100 md:text-sm">
                      <Users className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                      Contributors
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                      {loading
                        ? 'Loading contributors...'
                        : `${contributors.length} contributors, ${formatContributions(totalContributions)} total contributions`}
                    </p>
                  </div>
                </div>

                {error ? (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300 md:text-sm">
                    {error}
                  </div>
                ) : loading ? (
                  <div className="mt-4 space-y-2.5">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="h-8 animate-pulse rounded-full bg-white/80 dark:bg-gray-800" />
                    ))}
                  </div>
                ) : contributors.length === 0 ? (
                  <div className="mt-4 rounded-2xl border border-amber-100 bg-white/80 px-3.5 py-2.5 text-xs text-muted-foreground dark:border-gray-800 dark:bg-gray-950/70 md:text-sm">
                    No contributors found yet.
                  </div>
                ) : (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {contributors.map((contributor) => (
                      <span
                        key={contributor.id}
                        className="rounded-full border border-amber-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                      >
                        {contributor.login}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 rounded-2xl border border-amber-100 bg-amber-50/60 px-4 py-3 text-xs text-muted-foreground dark:border-gray-800 dark:bg-gray-900/50 md:text-sm">
              <ArrowRight className="h-3.5 w-3.5 text-amber-700 dark:text-amber-300" />
              Expand this section to see contributors and project credit details.
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}