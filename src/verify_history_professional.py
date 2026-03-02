import asyncio
from playwright.async_api import async_playwright

async def run():
    print("Starting Playwright...")
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()
        
        url = "http://localhost:8080/-Comes-To-Life-/games"
        print(f"Navigating to {url}...")
        await page.goto(url, timeout=60000)
        await page.wait_for_load_state("networkidle")
        
        # Click History tab
        print("Clicking History tab...")
        await page.click("button:has-text('History')")
        await page.wait_for_timeout(2000)

        # Hall of Records
        print("Checking Hall of Records...")
        minds_card = page.get_by_role("heading", name="Hall of Records")
        if await minds_card.is_visible():
            print("Found Hall of Records heading.")
            await minds_card.click()
            await page.wait_for_timeout(2000)
            begin_btn = page.locator("button:has-text('Begin Entry')")
            if await begin_btn.is_visible():
                print("Found Begin Entry button.")
                await begin_btn.click()
                await page.wait_for_timeout(2000)
                await page.screenshot(path="final_professional_minds.png")
                print("Captured Professional Minds gameplay.")
            else:
                print("Begin Entry button NOT visible.")
        else:
            print("Hall of Records card NOT visible.")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
