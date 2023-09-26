# Session Replay Analyzer

## Accessibility Issues [/api/<version>/analyze/accessibility]

### Submit Accessibility Analysis [POST]

- Request

  ```json
  {
    "data": {
      "filenames": ["90/a.txt", "90/b.txt"]
    }
  }
  ```

- Response (200)

  ```json
  {
    "data": [
      {
        "id": "123",
        "impact": "Really big.",
        "description": "Missing aria label.",
        "help_url": "https://www.sentry.io",
        "element": "div > a.class",
        "failure_summary": "You forgot the aria-label."
      }
    ]
  }
  ```
