import { getApiBaseURL } from '../services/api'
import './HomePage.css'

export function HomePage() {
  const apiBase = getApiBaseURL()

  return (
    <section className="home">
      <h2 className="home__heading">Welcome</h2>
      <p className="home__text">
        This app will connect to your Go API at{' '}
        <code className="home__code">{apiBase}</code>
        . Movie list, forms, and tiles will be added in the next steps.
      </p>
      <p className="home__text home__text--muted">
        Ensure the backend is running and MongoDB is reachable before calling
        the API from the UI.
      </p>
    </section>
  )
}
