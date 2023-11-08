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
          if (event.type === 2 || event.type === 3) {
            events.push(event)
          }
        })
      }
    } catch (e) {
      console.log(e)
      return []
    }
  })
  return events.slice(0, 5);
}

export { split }
