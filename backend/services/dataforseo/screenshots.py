import logging

from .client import DataForSEOClient

logger = logging.getLogger(__name__)


class ScreenshotService:
    """DataForSEO screenshot capture for SERPs and web pages."""

    def __init__(self, client: DataForSEOClient):
        self.client = client

    def capture_serp_screenshot(self, task_id: str) -> str | None:
        """Capture a screenshot of a SERP result.

        Args:
            task_id: The task ID from a previous SERP task.

        Returns:
            Screenshot URL, or None if unavailable.
        """
        payload = [{"task_id": task_id}]
        data = self.client.post("serp/screenshot", payload)

        tasks = data.get("tasks") or []
        if not tasks:
            logger.warning("No tasks returned for SERP screenshot task_id=%s", task_id)
            return None

        result = tasks[0].get("result")
        if not result:
            logger.warning("No result for SERP screenshot task_id=%s", task_id)
            return None

        # Result contains items_count and items list with image URLs
        items = result[0].get("items") or []
        if items:
            return items[0].get("image")
        return None

    def capture_page_screenshot(
        self,
        url: str,
        full_page: bool = True,
        browser_preset: str | None = None,
    ) -> str | None:
        """Capture a screenshot of a web page via the OnPage API.

        Args:
            url: The URL of the page to screenshot.
            full_page: Whether to capture the full page or just the viewport.
            browser_preset: Optional browser preset (e.g., "desktop", "mobile").

        Returns:
            Screenshot image URL, or None if unavailable.
        """
        task: dict = {
            "url": url,
            "full_page_screenshot": full_page,
        }
        if browser_preset:
            task["browser_preset"] = browser_preset

        data = self.client.post("on_page/page_screenshot", [task], timeout=60)

        tasks = data.get("tasks", [])
        if not tasks:
            logger.warning("No tasks returned for page screenshot url=%s", url)
            return None

        result = tasks[0].get("result")
        if not result:
            logger.warning("No result for page screenshot url=%s", url)
            return None

        return result[0].get("image") or result[0].get("url")

    def capture_serp_pages(
        self,
        task_id: str,
        rank_position: int,
        keyword: str,
        location_code: int,
        language_code: str,
        device: str = "desktop",
        max_pages: int = 5,
    ) -> list[dict]:
        """Capture a single SERP screenshot for the original task.

        We previously tried to capture pages 2..N for ranks beyond 10 by
        re-running the SERP API with offset=10/20/etc and screenshotting
        each task. Verified empirically (Apr 2026): DataForSEO's
        ``serp/screenshot`` endpoint ignores the offset and renders page 1
        of Google for every captured task. Different UUIDs, identical
        page-1 content. So the multi-page list was misleading users into
        clicking "Page 2" tabs that just showed page 1 again.

        Returns a single-item list ``[{"page": <serp_page>, "url": ...}]``
        where ``serp_page`` is the page that *contains* the rank (computed
        from rank_position). The returned image is the page-1 SERP — we
        keep the page metadata so the UI can label it "Found on page N".

        ``rank_position``, ``keyword``, ``location_code``, ``language_code``,
        ``device`` and ``max_pages`` are kept in the signature for API
        compatibility but only ``task_id`` and ``rank_position`` are used.
        """
        url = self.capture_serp_screenshot(task_id)
        if not url:
            return []
        page = max(1, ((rank_position - 1) // 10) + 1) if rank_position else 1
        return [{"page": page, "url": url}]

    def capture_maps_screenshot(self, check_url: str) -> str | None:
        """Capture a screenshot of a Google Maps SERP result.

        Maps tasks don't support serp/screenshot, so we use page_screenshot
        with the Maps check_url (which includes location via uule param).

        Args:
            check_url: Google Maps SERP URL from the API response.

        Returns:
            Screenshot URL, or None.
        """
        if not check_url:
            return None
        return self.capture_page_screenshot(url=check_url, full_page=True)
