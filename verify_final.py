import asyncio
from playwright.async_api import async_playwright
import os

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1280, 'height': 800})

        base_url = "http://localhost:8080/-Comes-To-Life-/"

        print("Navigating to Games page...")
        await page.goto(base_url + "games")
        await page.wait_for_selector("h1:has-text('Ancient Games')")
        await page.screenshot(path="final_games_hub.png")
        print("Captured final_games_hub.png")

        # Define games to screenshot (Intro and Gameplay if possible)
        trials = [
            ("Solar & Lunar Maze", "maze_intro.png"),
            ("Pharaoh's Riddles", "riddles_intro.png"),
            ("Pyramid Builder", "pyramid_intro.png"),
            ("Hieroglyph Decoder", "decoder_intro.png"),
            ("Temple Escape", "escape_intro.png"),
            ("Nile Navigator", "nile_intro.png")
        ]

        for game_title, screenshot_name in trials:
            print(f"Opening {game_title}...")
            try:
                # Use text-based filtering to avoid quote escaping issues
                await page.locator("h3, h4").filter(has_text=game_title).first.click()

                # Wait for game to load
                await page.wait_for_timeout(2000)
                await page.screenshot(path=f"final_{screenshot_name}")
                print(f"Captured final_{screenshot_name}")

                # Go back to menu
                await page.locator("button:has-text('Back to Games')").first.click()
                await page.wait_for_selector("h1:has-text('Ancient Games')")
            except Exception as e:
                print(f"Could not capture {game_title}: {e}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
