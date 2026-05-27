from playwright.sync_api import sync_playwright
import os
import time

def run_cuj(page):
    page.goto("http://localhost:8080/-Comes-To-Life-/games")
    page.wait_for_timeout(2000)
    page.screenshot(path="/home/jules/verification/screenshots/games_hub.png")
    page.wait_for_timeout(500)
    page.get_by_text("Trials of Wisdom", exact=True).click()
    page.wait_for_timeout(2000)
    page.screenshot(path="/home/jules/verification/screenshots/game_loaded.png")
    page.get_by_role("button", name="Back to Games").click()
    page.wait_for_timeout(1000)
    page.screenshot(path="/home/jules/verification/screenshots/verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
