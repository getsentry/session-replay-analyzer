/*
 * Accept as input raw RRWeb data. Transform the input into parsed
 * JSON with extraneous events removed.
 */
function split (segments: string[]): any[] {
  const events: any[] = []

  segments.forEach(segment => {
    try {
      const segmentEvents = JSON.parse(segment)
      if (segmentEvents instanceof Array) {
        segmentEvents.forEach(event => {
          events.push(event)
        })
      }
    } catch (e) {
      console.log(e)
    }
  })
  return events;
}

export { split }
