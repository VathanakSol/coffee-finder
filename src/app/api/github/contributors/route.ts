import { NextResponse } from 'next/server'

interface GitHubContributorResponse {
  id: number
  login: string
  avatar_url: string
  html_url: string
  contributions: number
  type: string
}

const GITHUB_OWNER = 'vathanaksol'
const GITHUB_REPO = 'coffee-finder'
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contributors`

async function fetchContributorsPage(page: number) {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'coffee-finder-app',
  }

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  const response = await fetch(`${GITHUB_API_URL}?per_page=100&page=${page}`, {
    headers,
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    throw new Error(`GitHub contributors request failed with status ${response.status}`)
  }

  return (await response.json()) as GitHubContributorResponse[]
}

export async function GET() {
  try {
    const contributors: GitHubContributorResponse[] = []
    let page = 1

    while (true) {
      const currentPage = await fetchContributorsPage(page)
      contributors.push(...currentPage)

      if (currentPage.length < 100) {
        break
      }

      page += 1
    }

    const rankedContributors = [...contributors].sort((left, right) => {
      return right.contributions - left.contributions
    })

    return NextResponse.json({
      repository: {
        owner: GITHUB_OWNER,
        name: GITHUB_REPO,
        url: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`,
      },
      contributors: rankedContributors.map((contributor) => ({
        id: contributor.id,
        login: contributor.login,
        avatarUrl: contributor.avatar_url,
        profileUrl: contributor.html_url,
        contributions: contributor.contributions,
        type: contributor.type,
      })),
    })
  } catch (error) {
    console.error('Error fetching GitHub contributors:', error)

    return NextResponse.json(
      {
        error: 'Failed to fetch repository contributors',
      },
      { status: 500 }
    )
  }
}