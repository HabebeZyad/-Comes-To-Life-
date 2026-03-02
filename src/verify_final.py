import asyncio
from playwright.async_api import async_playwright
import os

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()
        
        # Log console messages
        page.on("console", lambda msg: print(f"BROWSER CONSOLE: {msg.type}: {msg.text}"))
        page.on("pageerror", lambda err: print(f"BROWSER ERROR: {err}"))

        base_url = "http://127.0.0.1:8080/-Comes-To-Life-/"
        
        print(f"Navigating to {base_url}games...")
        try:
            # Increase timeout and wait for load state
            response = await page.goto(base_url + "games", wait_until="load", timeout=60000)
            print(f"Response status: {response.status if response else 'No response'}")
            
            await page.wait_for_timeout(5000) # Wait for React to mount
            
            await page.screenshot(path="debug_initial.png")
            
            # Check for main heading
            try:
                await page.wait_for_selector("h1", timeout=15000)
                h1_text = await page.inner_text("h1")
                print(f"H1 Text Found: {h1_text}")
            except:
                print("H1 not found within 15s")
                # Log body content
                body = await page.inner_html("body")
                print(f"Body content length: {len(body)}")
                if len(body) < 500:
                    print(f"Body snippet: {body[:200]}")

            await page.screenshot(path="final_games_hub_professional.png")
            print("Captured final_games_hub_professional.png")

            # Definitions for narrative trials
            trials = [
                ("Chronicles of the Nile", "chronicles.png"),
                ("The Pyramid Trail", "trail.png"),
                ("The Great Minds", "minds.png"),
                ("Scribe's Journal", "journal.png")
            ]

            for game_title, screenshot_name in trials:
                print(f"Attempting to capture {game_title}...")
                try:
                    # Look for the game card and click play
                    locator = page.locator("h3, h4").filter(has_text=game_title).first
                    if await locator.count() > 0:
                        await locator.click()
                        await page.wait_for_timeout(3000)
                        await page.screenshot(path=f"final_{screenshot_name}")
                        print(f"Success: {screenshot_name}")
                        
                        # Go back
                        back = page.locator("button").filter(has_text="Back to Games").first
                        if await back.count() > 0:
                            await back.click()
                            await page.wait_for_timeout(1000)
                    else:
                        print(f"Skip: {game_title} (not visible)")
                except Exception as e:
                    print(f"Error for {game_title}: {e}")

        except Exception as e:
            print(f"Fatal error: {e}")
            await page.screenshot(path="fatal_error.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
