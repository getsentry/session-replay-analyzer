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
          if (event.type == 1 || event.type == 2 || event.type == 3 || event.type == 4) {
            events.push(event)
          }
        })
      }
    } catch (e) {
      console.log(e)
    }
  })
  return events;
}

export { split }
