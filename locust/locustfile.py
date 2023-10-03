from locust import HttpUser, task


class WebsiteUser(HttpUser):
    @task
    def index(self):
        self.client.post(
            "/api/0/analyze/accessibility", json={"data": {"filenames": ["a"]}}
        )
