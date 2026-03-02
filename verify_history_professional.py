import asyncio
from playwright.async_api import async_playwright, expect

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        # Base URL with custom path
        base_url = "http://localhost:8080/-Comes-To-Life-/"

        print("Navigating to Games Hub...")
        await page.goto(base_url + "games")
        await page.wait_for_timeout(3000)

        # Verify Hub
        await page.screenshot(path="final_games_hub_professional.png")

        # Verify Pyramid Trail (History)
        print("Testing Pyramid Trail...")
        await page.get_by_role("heading", name="The Pyramid Trail").first.click()
        await page.wait_for_timeout(2000)
        await page.screenshot(path="final_professional_trail.png")

        # Verify Great Minds (History)
        print("Testing Great Minds...")
        await page.get_by_role("button", name="Back to Games").click()
        await page.wait_for_timeout(1500)
        await page.get_by_role("heading", name="Hall of Records").first.click()
        await page.wait_for_timeout(2000)
        await page.screenshot(path="final_professional_minds.png")

        # Verify Order of Builders (History)
        print("Testing Order of Builders...")
        await page.get_by_role("button", name="Back to Games").click()
        await page.wait_for_timeout(1500)
        await page.get_by_role("heading", name="Chronicles of the Nile").first.click()
        await page.wait_for_timeout(2000)
        await page.screenshot(path="final_professional_builders.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
