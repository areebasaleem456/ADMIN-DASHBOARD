export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-12'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const token = assertValue(
  "skzVEC7jchGxsKINyiFiM276TOLJKZdcRQJ5Kna9bFZTq51l4RmnvcBWR0mDfWZzxPgFe3G1ePLMx1rVWfW7Y4jPPZciEXYQLvldJ4cZhbZTQ2aXsAxQhJZDkG1qLv40lgv5jBBXLXuKFYft1zZJ6PXudfuu1J1oCWJaXIrdmEytlYvOSYCe",
  'Missing environment variable: "skzVEC7jchGxsKINyiFiM276TOLJKZdcRQJ5Kna9bFZTq51l4RmnvcBWR0mDfWZzxPgFe3G1ePLMx1rVWfW7Y4jPPZciEXYQLvldJ4cZhbZTQ2aXsAxQhJZDkG1qLv40lgv5jBBXLXuKFYft1zZJ6PXudfuu1J1oCWJaXIrdmEytlYvOSYCe"'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
