/*
 * Accept as input raw RRWeb data. Transform the input into parsed
 * JSON with extraneous events removed.
 */
function split (segments: string[]): any[] {
  const events: any[] = []

  segments.forEach(segment => {
    const segmentEvents = JSON.parse(segment)

    if (segmentEvents instanceof Array) {
      segmentEvents.forEach(event => {
        if (event.type === 2) {
          events.push(event)
        }
      })
    }
  })

  return events
}

export { split }
